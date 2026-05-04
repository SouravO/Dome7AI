import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../src/lib/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // New user form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const functions = getFunctions();

  useEffect(() => {
    // Check basic authentication status.
    // If not authenticated via localStorage or firebase, redirect.
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      navigate("/admin");
      return;
    }

    // Use firebase auth observer to ensure we wait until user is loaded
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          const isAdmin = tokenResult.claims.admin === true || user.email === "zettaaitechnologies@gmail.com";
          if (isAdmin) {
            loadUsers();
          } else {
            navigate("/"); // redirect non-admins home
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const listUsers = httpsCallable(functions, 'listUsers');
      const result = await listUsers();
      setUsers(result.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password) {
      alert("Email and password are required.");
      return;
    }

    setActionLoading(true);
    try {
      const adminRegisterUser = httpsCallable(functions, 'adminRegisterUser');
      await adminRegisterUser(newUser);
      alert("User registered successfully and linked with Kujiale!");
      setNewUser({ name: "", email: "", password: "" });
      loadUsers();
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAdmin = async (uid, currentStatus) => {
    setActionLoading(true);
    try {
      const toggleAdmin = httpsCallable(functions, 'toggleAdmin');
      await toggleAdmin({ uid, adminStatus: !currentStatus });
      alert(`Admin status successfully updated.`);
      loadUsers();
    } catch (error) {
      console.error("Error toggling admin status:", error);
      alert("Failed to update admin status: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleUserStatus = async (uid, currentDisabled) => {
    setActionLoading(true);
    try {
      const toggleUserStatus = httpsCallable(functions, 'toggleUserStatus');
      await toggleUserStatus({ uid, disabled: !currentDisabled });
      alert(`User successfully ${!currentDisabled ? 'disabled' : 'enabled'}.`);
      loadUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      alert("Failed to update user status: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authTimestamp");
    auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-black text-white py-4 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            User Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 sm:px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm sm:text-base"
            >
              Gallery Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Add User Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-lg p-4 sm:p-6 lg:col-span-1"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Register New User
            </h2>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder="Min 6 characters"
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white text-sm sm:text-base"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-4"
              >
                {actionLoading ? "Registering..." : "Register User"}
              </button>
            </form>
          </motion.div>

          {/* Users List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900 rounded-lg p-4 sm:p-6 lg:col-span-2"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              All Users ({users.length})
            </h2>

            {loading ? (
              <p className="text-gray-400 text-center py-4">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 font-medium text-sm sm:text-base text-gray-300">Name</th>
                      <th className="py-3 px-4 font-medium text-sm sm:text-base text-gray-300">Email</th>
                      <th className="py-3 px-4 font-medium text-sm sm:text-base text-gray-300 text-center">Admin</th>
                      <th className="py-3 px-4 font-medium text-sm sm:text-base text-gray-300 text-center">Status</th>
                      <th className="py-3 px-4 font-medium text-sm sm:text-base text-gray-300 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.uid} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                          <td className="py-3 px-4 text-sm sm:text-base">{user.displayName || "-"}</td>
                          <td className="py-3 px-4 text-sm sm:text-base">{user.email}</td>
                          <td className="py-3 px-4 text-sm sm:text-base text-center">
                            {user.admin ? (
                              <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Admin</span>
                            ) : (
                              <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">User</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm sm:text-base text-center">
                            {user.disabled ? (
                              <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs">Disabled</span>
                            ) : (
                              <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Active</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleToggleAdmin(user.uid, user.admin)}
                                disabled={actionLoading || user.email === "zettaaitechnologies@gmail.com"}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs sm:text-sm transition-colors disabled:opacity-50"
                              >
                                {user.admin ? "Revoke Admin" : "Make Admin"}
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(user.uid, user.disabled)}
                                disabled={actionLoading || user.email === "zettaaitechnologies@gmail.com"}
                                className={`px-3 py-1 rounded text-xs sm:text-sm transition-colors disabled:opacity-50 ${user.disabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                              >
                                {user.disabled ? "Enable" : "Disable"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-gray-400">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
