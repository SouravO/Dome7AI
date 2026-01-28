import React, { useState, useEffect } from "react";

const MyAccount = () => {
  const [userData, setUserData] = useState({
    email: "",
    fullName: "",
    phone: "",
    avatarUrl: null
  });

  useEffect(() => {
    // Get user info from localStorage (Supabase auth token)
    try {
      const authData = localStorage.getItem("sb-pecdeaansqtmawzzpsgw-auth-token");
      if (authData) {
        const parsed = JSON.parse(authData);
        const user = parsed.user;
        if (user) {
          setUserData({
            email: user.email || "N/A",
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0] || "N/A",
            phone: user.phone || user.user_metadata?.phone || "N/A",
            avatarUrl: user.user_metadata?.avatar_url || null
          });
        }
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      // Set default values in case of error
      setUserData({
        email: "user@example.com",
        fullName: "John Doe",
        phone: "+1 (555) 123-4567",
        avatarUrl: null
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-2xl">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8">
            {userData.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 mb-4"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold">
                  {userData.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-2xl font-semibold">{userData.fullName}</h2>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium mb-4 text-blue-400">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="font-medium">{userData.fullName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Address</p>
                <p className="font-medium break-all">{userData.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Phone Number</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;