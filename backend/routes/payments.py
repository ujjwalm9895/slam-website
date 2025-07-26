from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
from models import (
    PaymentCreate, PaymentUpdate, PaymentResponse, 
    BaseResponse, PaymentStatus
)
from utils.auth import get_current_user
from database import get_collection
from config import settings
from datetime import datetime
import razorpay
import uuid

router = APIRouter()

# Initialize Razorpay client
client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))

@router.post("/create", response_model=BaseResponse)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new payment"""
    try:
        payments_collection = get_collection("payments")
        orders_collection = get_collection("orders")
        
        # Get order details
        order = orders_collection.find_one({"_id": payment_data.orderId})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Verify order belongs to current user
        if order["customerId"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Create payment document
        payment_id = str(uuid.uuid4())
        payment_doc = {
            "_id": payment_id,
            "orderId": payment_data.orderId,
            "amount": payment_data.amount,
            "currency": payment_data.currency,
            "gateway": payment_data.gateway,
            "paymentMethod": payment_data.paymentMethod,
            "status": PaymentStatus.PENDING,
            "gatewayTransactionId": None,
            "fees": None,
            "processedAt": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert payment into database
        result = payments_collection.insert_one(payment_doc)
        
        if result.inserted_id:
            # Create Razorpay order
            razorpay_order = client.order.create({
                "amount": int(payment_data.amount * 100),  # Convert to paise
                "currency": payment_data.currency,
                "receipt": payment_id,
                "notes": {
                    "order_id": payment_data.orderId,
                    "customer_id": current_user["id"]
                }
            })
            
            return BaseResponse(
                success=True,
                message="Payment created successfully",
                data={
                    "paymentId": payment_id,
                    "razorpayOrderId": razorpay_order["id"],
                    "amount": payment_data.amount,
                    "currency": payment_data.currency
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create payment"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment: {str(e)}"
        )

@router.post("/verify", response_model=BaseResponse)
async def verify_payment(
    razorpay_payment_id: str,
    razorpay_order_id: str,
    razorpay_signature: str,
    current_user: dict = Depends(get_current_user)
):
    """Verify payment with Razorpay"""
    try:
        payments_collection = get_collection("payments")
        orders_collection = get_collection("orders")
        
        # Verify signature
        try:
            client.utility.verify_payment_signature({
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_order_id": razorpay_order_id,
                "razorpay_signature": razorpay_signature
            })
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid payment signature"
            )
        
        # Get payment details from Razorpay
        payment_details = client.payment.fetch(razorpay_payment_id)
        
        # Find payment in database
        payment = payments_collection.find_one({"gatewayTransactionId": razorpay_payment_id})
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # Update payment status
        update_data = {
            "status": PaymentStatus.PAID if payment_details["status"] == "captured" else PaymentStatus.FAILED,
            "gatewayTransactionId": razorpay_payment_id,
            "fees": payment_details.get("fee", 0) / 100,  # Convert from paise
            "processedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        payments_collection.update_one(
            {"_id": payment["_id"]},
            {"$set": update_data}
        )
        
        # Update order payment status
        if payment_details["status"] == "captured":
            orders_collection.update_one(
                {"_id": payment["orderId"]},
                {"$set": {"paymentStatus": "paid", "updatedAt": datetime.utcnow()}}
            )
        
        return BaseResponse(
            success=True,
            message="Payment verified successfully",
            data={
                "paymentId": str(payment["_id"]),
                "status": update_data["status"],
                "amount": payment["amount"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify payment: {str(e)}"
        )

@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get payment by ID"""
    try:
        payments_collection = get_collection("payments")
        orders_collection = get_collection("orders")
        
        payment = payments_collection.find_one({"_id": payment_id})
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # Verify user has access to this payment
        order = orders_collection.find_one({"_id": payment["orderId"]})
        if not order or order["customerId"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Convert ObjectId to string
        payment["id"] = str(payment["_id"])
        del payment["_id"]
        
        return PaymentResponse(**payment)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve payment: {str(e)}"
        )

@router.get("/order/{order_id}", response_model=BaseResponse)
async def get_order_payments(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get payments for an order"""
    try:
        payments_collection = get_collection("payments")
        orders_collection = get_collection("orders")
        
        # Verify order belongs to current user
        order = orders_collection.find_one({"_id": order_id, "customerId": current_user["id"]})
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Get payments for the order
        payments = list(payments_collection.find({"orderId": order_id}))
        
        # Convert ObjectId to string
        for payment in payments:
            payment["id"] = str(payment["_id"])
            del payment["_id"]
        
        return BaseResponse(
            success=True,
            message="Order payments retrieved successfully",
            data={"payments": payments}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve order payments: {str(e)}"
        )

@router.post("/refund/{payment_id}", response_model=BaseResponse)
async def refund_payment(
    payment_id: str,
    amount: Optional[float] = None,
    current_user: dict = Depends(get_current_user)
):
    """Refund a payment"""
    try:
        payments_collection = get_collection("payments")
        orders_collection = get_collection("orders")
        
        # Get payment
        payment = payments_collection.find_one({"_id": payment_id})
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # Verify user has access to this payment
        order = orders_collection.find_one({"_id": payment["orderId"]})
        if not order or order["customerId"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        # Check if payment is paid
        if payment["status"] != PaymentStatus.PAID:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment is not paid"
            )
        
        # Process refund through Razorpay
        refund_amount = int((amount or payment["amount"]) * 100)  # Convert to paise
        
        refund = client.payment.refund(payment["gatewayTransactionId"], {
            "amount": refund_amount
        })
        
        # Update payment status
        payments_collection.update_one(
            {"_id": payment_id},
            {
                "$set": {
                    "status": PaymentStatus.REFUNDED,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        return BaseResponse(
            success=True,
            message="Payment refunded successfully",
            data={
                "refundId": refund["id"],
                "amount": refund_amount / 100
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refund payment: {str(e)}"
        ) 