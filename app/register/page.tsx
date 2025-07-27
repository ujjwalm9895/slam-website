"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Users, 
  Building2, 
  CheckCircle, 
  Loader2,
  ArrowLeft
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? "http://localhost:8000/api"
    : "https://api.klipsmart.shop/api");

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  // Role-specific fields
  location?: string;
  crop_type?: string;
  farm_size?: string;
  farm_size_unit?: string;
  domain?: string;
  experience?: string;
  description?: string;
  consultation_fee?: string;
  company_name?: string;
  specialization?: string;
}

export default function RegisterPage() {
  const [userType, setUserType] = useState<string>("");
  const [form, setForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "India"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get user type from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type) {
      setUserType(type);
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Register user
      const userData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        country: form.country,
        role: userType
      };

      const userResponse = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!userResponse.ok) {
        throw new Error('Failed to register user');
      }

      const userResult = await userResponse.json();

      // Create profile based on user type
      if (userType === 'farmer') {
        const farmerData = {
          location: form.location,
          crop_type: form.crop_type,
          farm_size: parseFloat(form.farm_size || "0"),
          farm_size_unit: form.farm_size_unit,
          description: `Farmer from ${form.location}`
        };

        await fetch(`${API_BASE_URL}/farmers/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(farmerData)
        });
      } else if (userType === 'expert') {
        const expertData = {
          domain: form.domain,
          experience: form.experience,
          description: form.description,
          consultation_fee: parseFloat(form.consultation_fee || "0")
        };

        await fetch(`${API_BASE_URL}/experts/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expertData)
        });
      } else if (userType === 'dealer') {
        const dealerData = {
          company_name: form.company_name,
          location: form.location,
          specialization: form.specialization,
          description: form.description
        };

        await fetch(`${API_BASE_URL}/dealers/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dealerData)
        });
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeInfo = () => {
    switch (userType) {
      case 'farmer':
        return {
          title: 'Farmer Registration',
          icon: <Users className="w-8 h-8 text-green-600" />,
          description: 'Join our community of farmers and share your knowledge',
          color: 'green'
        };
      case 'expert':
        return {
          title: 'Expert Registration',
          icon: <User className="w-8 h-8 text-blue-600" />,
          description: 'Share your expertise and help farmers succeed',
          color: 'blue'
        };
      case 'dealer':
        return {
          title: 'Dealer Registration',
          icon: <Building2 className="w-8 h-8 text-purple-600" />,
          description: 'Connect farmers with quality equipment and supplies',
          color: 'purple'
        };
      default:
        return {
          title: 'User Registration',
          icon: <User className="w-8 h-8 text-gray-600" />,
          description: 'Join our agricultural platform',
          color: 'gray'
        };
    }
  };

  const userTypeInfo = getUserTypeInfo();

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your registration has been submitted successfully. 
              {userType === 'expert' && (
                <span className="block mt-2 text-sm">
                  <strong>Note:</strong> Expert accounts require admin approval. 
                  You'll be notified once your account is approved.
                </span>
              )}
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/product'}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Go to Product Page
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Go to Home
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {userTypeInfo.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userTypeInfo.title}
              </h1>
              <p className="text-gray-600">
                {userTypeInfo.description}
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={form.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {userType === 'farmer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Farmer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.location || ""}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.crop_type || ""}
                        onChange={(e) => handleInputChange('crop_type', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Wheat, Rice, Cotton"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Farm Size *
                      </label>
                      <input
                        type="number"
                        required
                        value={form.farm_size || ""}
                        onChange={(e) => handleInputChange('farm_size', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter farm size"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit *
                      </label>
                      <select
                        required
                        value={form.farm_size_unit || ""}
                        onChange={(e) => handleInputChange('farm_size_unit', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select unit</option>
                        <option value="acres">Acres</option>
                        <option value="hectares">Hectares</option>
                        <option value="sq_meters">Square Meters</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {userType === 'expert' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Expert Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain of Expertise *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.domain || ""}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Soil Science, Crop Management"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.experience || ""}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., 10+ years"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      value={form.description || ""}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your expertise and qualifications..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.consultation_fee || ""}
                      onChange={(e) => handleInputChange('consultation_fee', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter consultation fee per hour"
                    />
                  </div>
                </div>
              )}

              {userType === 'dealer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dealer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.company_name || ""}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.location || ""}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.specialization || ""}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Tractors, Drones, Seeds"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Description *
                    </label>
                    <textarea
                      required
                      value={form.description || ""}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your company and services..."
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>

              {/* Admin Approval Notice */}
              {userType === 'expert' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                  <strong>Important:</strong> Expert accounts require admin approval. 
                  Your application will be reviewed and you'll be notified once approved.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 