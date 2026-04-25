import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const { confirmUserPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!oobCode) {
      setStatus({ type: 'error', message: 'Invalid or missing reset code.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    try {
      setStatus({ type: 'loading', message: 'Resetting password...' });
      if (confirmUserPasswordReset) {
        await confirmUserPasswordReset(oobCode, newPassword);
        setStatus({ type: 'success', message: 'Password successfully reset!' });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
         throw new Error("Password reset function not configured properly.");
      }
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-action-code') {
        msg = 'The reset link has expired or been used already. Please request a new one.';
      }
      setStatus({ type: 'error', message: msg || 'Failed to reset password.' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-[#111] border border-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-light mb-6 text-center">Set New Password</h2>
        
        {!oobCode ? (
          <div className="text-center">
            <p className="text-red-500 mb-6">Invalid password reset link. The URL seems to be missing the reset code.</p>
            <Link to="/forgot-password" className="inline-block bg-white text-black px-6 py-3 font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              Request New Link
            </Link>
          </div>
        ) : status.type === 'success' ? (
          <div className="text-center">
            <p className="text-green-500 text-lg mb-6">{status.message}</p>
            <p className="text-gray-400">Redirecting to login in a few seconds...</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm tracking-wider uppercase block mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors rounded"
                required
                minLength={6}
                placeholder="Enter a secure password"
              />
            </div>
            
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="w-full bg-white text-black font-semibold py-3 uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {status.type === 'loading' ? 'RESETTING...' : 'SET NEW PASSWORD'}
            </button>
            
            {status.message && status.type !== 'success' && (
              <p className={`text-sm text-center ${status.type === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                {status.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
