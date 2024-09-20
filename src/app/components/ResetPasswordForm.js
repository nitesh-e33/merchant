import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../lib/apiHelper';
import { toast } from 'react-toastify';

export default function ResetPasswordForm({ token }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const router = useRouter();

  // Toggle password visibility
  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setPasswordVisible(!passwordVisible);
    } else {
      setConfirmPasswordVisible(!confirmPasswordVisible);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Password confirmation is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const submitResetPassword = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const resetData = {
          token: token,
          new_password: password,
          new_password_confirmation: confirmPassword,
        };

        const response = await apiRequest("POST", "/reset-password", { post: resetData });
        if (response.StatusCode === '1') {
          toast.success(response.Message);
          router.push('/');
        } else {
          toast.error(response.Result || 'Password reset failed. Please try again.');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('An error occurred during the password reset process.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
      <div className="flex justify-center">
        <Image
          src="/themes/backend/img/DroomPay.png"
          alt="DroomPay Logo"
          width={180}
          height={50}
        />
      </div>
      <p className="text-center text-gray-600 mt-2">Reset Your Password</p>

      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        {/* New Password Field */}
        <div className="mb-4">
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
              onClick={() => togglePasswordVisibility('password')}
            >
              <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </div>
          </div>
          <p className="text-red-500 text-sm mt-1">{passwordError}</p>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
              onClick={() => togglePasswordVisibility('confirmPassword')}
            >
              <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </div>
          </div>
          <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className={`bg-blue-500 text-white p-2 rounded-lg w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={submitResetPassword}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </div>
      </form>
      <div className="text-center mt-2 text-gray-600">
        Powered By
        <Image
          src="https://matrix.droom.in/themes/backend/img/logo.png"
          alt="Droom logo"
          width={100}
          height={30}
          className="inline-block ml-2"
        />
      </div>
    </div>
  );
}
