"use client";

import DashboardLayout from "@/components/Dashboardlayout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [addUserModal, setAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [newUserErrors, setNewUserErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/auth`);
      const data = await res.json();
      setUsers(data.data || []);

    } catch (err) {
      // console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setDeletingId(userId);
      const res = await fetch(`/api/auth/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();


      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success(data.message || "User deleted successfully");
      } else {
        toast.error(data.error || data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  // Open add user modal
  const openAddUserModal = () => {
    setNewUserData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setNewUserErrors({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setAddUserModal(true);
  };

  // Close add user modal
  const closeAddUserModal = () => {
    setAddUserModal(false);
    setNewUserData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setNewUserErrors({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Open change password modal
  const openChangePasswordModal = (user: User) => {
    setSelectedUser(user);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setChangePasswordModal(true);
  };

  // Close change password modal
  const closeChangePasswordModal = () => {
    setChangePasswordModal(false);
    setSelectedUser(null);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Validate new user form
  const validateNewUserForm = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!newUserData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newUserData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!newUserData.password) {
      newErrors.password = "Password is required";
    } else if (newUserData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!newUserData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newUserData.password !== newUserData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setNewUserErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Validate change password form
  const validateForm = () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle new user creation
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateNewUserForm()) {
      return;
    }

    try {
      setAddingUser(true);
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUserData.email,
          password: newUserData.password,
        }),
      });

      const data = await res.json();


      if (res.ok) {
        toast.success(data.message || "User created successfully");
        closeAddUserModal();
        // Refresh users list
        fetchUsers();
      } else {
        if (data.error?.includes("already exists") || data.message?.includes("already exists")) {
          setNewUserErrors(prev => ({
            ...prev,
            email: "User with this email already exists"
          }));
        } else {
          toast.error(data.error || data.message || "Failed to create user");
        }
      }
    } catch (err) {
      console.error("Add user error:", err);
      toast.error("Error creating user");
    } finally {
      setAddingUser(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!validateForm()) {
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch(`/api/auth/${selectedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          password: passwordData.newPassword,
        }),
      });

      const data = await res.json();


      if (res.ok) {
        toast.success(data.message || "Password changed successfully");
        closeChangePasswordModal();
      } else {
        if (data.message === "Invalid credentials") {
          setErrors((prev) => ({
            ...prev,
            oldPassword: "Current password is incorrect",
          }));
        } else {
          toast.error(data.error || data.message || "Failed to change password");
        }
      }
    } catch (err) {
      console.error("Password change error:", err);
      toast.error("Error changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle input change for change password form
  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle input change for new user form
  const handleNewUserInputChange = (field: string, value: string) => {
    setNewUserData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (newUserErrors[field as keyof typeof newUserErrors]) {
      setNewUserErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-900 dark:text-gray-100">Loading users...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <button
            onClick={openAddUserModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add New User
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Updated At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {user._id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openChangePasswordModal(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={deletingId === user._id}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New User Modal */}
        {addUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New User</h2>
                
                <form onSubmit={handleAddUser}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={newUserData.email}
                      onChange={(e) =>
                        handleNewUserInputChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        newUserErrors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter email address"
                      required
                    />
                    {newUserErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {newUserErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="newUserPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="newUserPassword"
                      value={newUserData.password}
                      onChange={(e) =>
                        handleNewUserInputChange("password", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        newUserErrors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />
                    {newUserErrors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {newUserErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="newUserConfirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="newUserConfirmPassword"
                      value={newUserData.confirmPassword}
                      onChange={(e) =>
                        handleNewUserInputChange("confirmPassword", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        newUserErrors.confirmPassword ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Confirm password"
                      required
                      minLength={6}
                    />
                    {newUserErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {newUserErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeAddUserModal}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      disabled={addingUser}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingUser}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
                    >
                      {addingUser ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {changePasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Change Password</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Changing password for: <strong className="text-gray-900 dark:text-white">{selectedUser?.email}</strong>
                </p>

                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label
                      htmlFor="oldPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        handleInputChange("oldPassword", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.oldPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter current password"
                      required
                    />
                    {errors.oldPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.oldPassword}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeChangePasswordModal}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      disabled={changingPassword}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                      {changingPassword ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}