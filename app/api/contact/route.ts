import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("=== CONTACT API ROUTE STARTED ===");
  
  try {
    // Log request details
    console.log("1. Parsing request body...");
    const body = await req.json();
    console.log("2. Request body:", JSON.stringify(body, null, 2));
    
    const { name, email, linkedin, message } = body;

    // Validate required fields
    console.log("3. Validating required fields...");
    if (!name || !email || !message) {
      console.log("❌ Validation failed - missing required fields");
      console.log("   name:", !!name, "email:", !!email, "message:", !!message);
      return NextResponse.json({ 
        success: false, 
        error: "Name, email, and message are required." 
      }, { status: 400 });
    }
    console.log("✅ Validation passed");

    // Check environment variable
    console.log("4. Checking environment variable...");
    console.log("   CONTACT_EMAIL_PASS exists:", !!process.env.CONTACT_EMAIL_PASS);
    console.log("   CONTACT_EMAIL_PASS length:", process.env.CONTACT_EMAIL_PASS?.length || 0);
    
    if (!process.env.CONTACT_EMAIL_PASS) {
      console.log("❌ Environment variable missing");
      return NextResponse.json({ 
        success: false, 
        error: "Server email password not set." 
      }, { status: 500 });
    }
    console.log("✅ Environment variable found");

    // Create transporter
    console.log("5. Creating nodemailer transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "slam.robots@gmail.com",
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });
    console.log("✅ Transporter created");

    // Verify transporter configuration
    console.log("6. Verifying transporter configuration...");
    try {
      await transporter.verify();
      console.log("✅ Transporter verification successful");
    } catch (verifyError) {
      console.log("❌ Transporter verification failed:", verifyError);
      return NextResponse.json({ 
        success: false, 
        error: "Email configuration error: " + (verifyError instanceof Error ? verifyError.message : "Unknown error")
      }, { status: 500 });
    }

    // Send email
    console.log("7. Sending email...");
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "slam.robots@gmail.com",
      subject: `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nLinkedIn: ${linkedin || 'Not provided'}\n\nMessage:\n${message}`,
    };
    console.log("   Mail options:", JSON.stringify(mailOptions, null, 2));

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    
    console.log("=== CONTACT API ROUTE COMPLETED SUCCESSFULLY ===");
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.log("❌ ERROR IN CONTACT API ROUTE:");
    console.log("   Error type:", typeof error);
    console.log("   Error message:", error instanceof Error ? error.message : error);
    console.log("   Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.log("   Full error object:", error);
    console.log("=== CONTACT API ROUTE FAILED ===");
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to send email: " + (error instanceof Error ? error.message : "Unknown error")
    }, { status: 500 });
  }
} 