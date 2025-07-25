"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Users,
  Building2,
  Eye
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api";

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
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      // In a real app, you'd have an admin endpoint
      // For now, we'll simulate this
      const response = await fetch(`${API_BASE_URL}/users?status=pending`);
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
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      // In a real app, you'd call an admin API
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/approve`, {
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
      // For demo, just remove from list
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      alert('User approved successfully! (Demo mode)');
    }
  };

  const handleReject = async (userId: number) => {
    try {
      // In a real app, you'd call an admin API
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reject`, {
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
        return <Users className="w-5 h-5 text-green-600" />;
      case 'dealer':
        return <Building2 className="w-5 h-5 text-purple-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage user registrations and approvals</p>
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
                  <Users className="w-6 h-6 text-yellow-600" />
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
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Approvals</h2>
            
            {pendingUsers.length === 0 ? (
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