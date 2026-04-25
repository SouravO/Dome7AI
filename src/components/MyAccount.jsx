import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
const MyAccount = () => {
  const [userData, setUserData] = useState({
    email: "",
    fullName: "",
    phone: "",
    avatarUrl: null
  });

  const { user, updateUserPassword } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter both old and new passwords.' });
      return;
    }
    
    try {
      setPasswordStatus({ type: 'loading', message: 'Changing password...' });
      if (updateUserPassword) {
        await updateUserPassword(passwordData.oldPassword, passwordData.newPassword);
        setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
        setIsChangingPassword(false);
        setPasswordData({ oldPassword: '', newPassword: '' });
      } else {
        throw new Error("Change password function not available.");
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect old password.';
      }
      setPasswordStatus({ type: 'error', message: errorMessage || 'Failed to change password.' });
    }
    
    setTimeout(() => setPasswordStatus({ type: '', message: '' }), 5000);
  };

  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email || "N/A",
        fullName: user.displayName || user.email?.split('@')[0] || "N/A",
        phone: user.phoneNumber || "N/A",
        avatarUrl: user.photoURL || null
      });
    } else {
      setUserData({
        email: "user@example.com",
        fullName: "John Doe",
        phone: "+1 (555) 123-4567",
        avatarUrl: null
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-6">
            ACCOUNT SETTINGS
          </p>
          <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
            Profile
            <br />
            <span className="italic font-serif">Overview.</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-xl">
            Manage your personal information and account preferences.
          </p>
        </div>
      </div>

      {/* Account Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-3xl">
          {/* Profile Card */}
          <div className="bg-black border border-gray-900 overflow-hidden">
            {/* Profile Header */}
            <div className="p-12 border-b border-gray-900">
              <div className="flex items-center gap-8">
                {userData.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="User Avatar"
                    className="w-24 h-24 object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 border border-white/20 flex items-center justify-center bg-neutral-900">
                    <span className="text-3xl font-light text-white">
                      {userData.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-light text-white mb-2">{userData.fullName}</h2>
                  <p className="text-gray-400 text-sm">{userData.email}</p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="p-12">
              <h3 className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-8">
                PERSONAL INFORMATION
              </h3>

              <div className="space-y-8">
                <div className="border-b border-gray-900 pb-6">
                  <label className="text-gray-500 text-xs tracking-wider uppercase block mb-2">
                    Full Name
                  </label>
                  <p className="text-white text-lg font-light">{userData.fullName}</p>
                </div>

                <div className="border-b border-gray-900 pb-6">
                  <label className="text-gray-500 text-xs tracking-wider uppercase block mb-2">
                    Email Address
                  </label>
                  <p className="text-white text-lg font-light break-all">{userData.email}</p>
                </div>

                <div className="pb-6">
                  <label className="text-gray-500 text-xs tracking-wider uppercase block mb-2">
                    Phone Number
                  </label>
                  <p className="text-white text-lg font-light">{userData.phone}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-900">
                {!isChangingPassword ? (
                  <div className="flex items-center gap-4">
                    <button className="inline-flex items-center gap-3 px-8 py-4 border border-white text-white text-xs tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300">
                      EDIT PROFILE
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-gray-500 hover:text-white text-xs tracking-wider uppercase transition-colors"
                    >
                      CHANGE PASSWORD
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                    <div>
                      <label className="text-gray-500 text-xs tracking-wider uppercase block mb-2">Old Password</label>
                      <input 
                        type="password" 
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                        className="w-full bg-transparent border border-gray-900 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs tracking-wider uppercase block mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full bg-transparent border border-gray-900 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-2">
                      <button 
                        type="submit"
                        disabled={passwordStatus.type === 'loading'}
                        className="inline-flex items-center gap-3 px-8 py-3 border border-white text-white text-xs tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                      >
                        {passwordStatus.type === 'loading' ? 'SAVING...' : 'SAVE PASSWORD'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordStatus({ type: '', message: '' });
                          setPasswordData({ oldPassword: '', newPassword: '' });
                        }}
                        className="text-gray-500 hover:text-white text-xs tracking-wider uppercase transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
                {passwordStatus.message && (
                  <p className={`mt-4 text-sm ${passwordStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {passwordStatus.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;