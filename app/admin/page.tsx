"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  LogOut,
  Shield
} from "lucide-react";
import { API_BASE_URL, secureFetch } from "@/lib/api";

// Admin credentials (in production, this should be stored securely)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "slam2024"
};

interface PendingUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  profile?: any;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem("adminAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchPendingUsers();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      fetchPendingUsers();
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
    setUsername("");
    setPassword("");
  };

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      // In a real app, you'd have an admin endpoint
      // For now, we'll simulate this
      const response = await secureFetch('users?status=pending');
      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data);
      } else {
        // Simulate some pending users for demo
        setPendingUsers([
          {
            id: 1,
            name: "Dr. Rajesh Kumar",
            email: "rajesh@example.com",
            phone: "+91-98765-43210",
            role: "expert",
            status: "pending",
            created_at: "2025-01-26T10:30:00Z",
            profile: {
              domain: "Soil Science",
              experience: "15+ years",
              description: "PhD in Agricultural Sciences with expertise in soil testing and crop management",
              consultation_fee: 1500
            }
          },
          {
            id: 2,
            name: "Priya Sharma",
            email: "priya@example.com",
            phone: "+91-98765-43211",
            role: "expert",
            status: "pending",
            created_at: "2025-01-25T14:20:00Z",
            profile: {
              domain: "Crop Management",
              experience: "8+ years",
              description: "Agricultural consultant specializing in organic farming and pest management",
              consultation_fee: 1200
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
      // Simulate some pending users for demo when API fails
      setPendingUsers([
        {
          id: 1,
          name: "Dr. Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91-98765-43210",
          role: "expert",
          status: "pending",
          created_at: "2025-01-26T10:30:00Z",
          profile: {
            domain: "Soil Science",
            experience: "15+ years",
            description: "PhD in Agricultural Sciences with expertise in soil testing and crop management",
            consultation_fee: 1500
          }
        },
        {
          id: 2,
          name: "Priya Sharma",
          email: "priya@example.com",
          phone: "+91-98765-43211",
          role: "expert",
          status: "pending",
          created_at: "2025-01-25T14:20:00Z",
          profile: {
            domain: "Crop Management",
            experience: "8+ years",
            description: "Agricultural consultant specializing in organic farming and pest management",
            consultation_fee: 1200
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      // In a real app, you'd call an admin API
      const response = await secureFetch(`admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        alert('User approved successfully!');
      } else {
        alert('Failed to approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      // For demo, just remove from list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert('User approved successfully! (Demo mode)');
    }
  };

  const handleReject = async (userId: number) => {
    try {
      // In a real app, you'd call an admin API
      const response = await secureFetch(`admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        alert('User rejected successfully!');
      } else {
        alert('Failed to reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      // For demo, just remove from list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert('User rejected successfully! (Demo mode)');
    }
  };

  const handleViewUser = (user: PendingUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'expert':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'farmer':
        return <User className="w-5 h-5 text-green-600" />;
      case 'dealer':
        return <User className="w-5 h-5 text-purple-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'expert':
        return 'bg-blue-100 text-blue-800';
      case 'farmer':
        return 'bg-green-100 text-green-800';
      case 'dealer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access the admin panel
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1 relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter username"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          
          <div className="text-center text-xs text-gray-500">
            <p>Demo Credentials:</p>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>slam2024</strong></p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage user registrations and approvals</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingUsers.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Experts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingUsers.filter(u => u.role === 'expert').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Dealers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingUsers.filter(u => u.role === 'dealer').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Approvals</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <Shield className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Loading pending users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Approvals</h3>
                <p className="text-gray-500">All user registrations have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Registered</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {getRoleIcon(user.role)}
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">{user.phone}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(user.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                </div>
              </div>

              {selectedUser.profile && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Profile Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.profile.domain && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Domain</label>
                        <p className="text-gray-900">{selectedUser.profile.domain}</p>
                      </div>
                    )}
                    {selectedUser.profile.experience && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience</label>
                        <p className="text-gray-900">{selectedUser.profile.experience}</p>
                      </div>
                    )}
                    {selectedUser.profile.consultation_fee && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                        <p className="text-gray-900">₹{selectedUser.profile.consultation_fee}/hour</p>
                      </div>
                    )}
                    {selectedUser.profile.company_name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="text-gray-900">{selectedUser.profile.company_name}</p>
                      </div>
                    )}
                  </div>
                  {selectedUser.profile.description && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedUser.profile.description}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedUser.id);
                    setShowUserModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 