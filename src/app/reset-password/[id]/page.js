'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import ResetPasswordForm from '../../components/ResetPasswordForm';
import { apiRequest } from '@/app/lib/apiHelper';

const ResetPassword = ({ params }) => {
  const { id } = params;
  const [isTokenValid, setIsTokenValid] = useState(null);
  const router = useRouter();

  async function checkUserResetToken(tokenId) {
    try {
      const response = await apiRequest('POST', '/check-user-reset-token', { 
        post: { reset_token: tokenId }
      });
      if (response.StatusCode === "1") {
        setIsTokenValid(true);
      } else {
        toast.error(response.Result || 'Reset token is invalid or expired.');
        setIsTokenValid(false);
      }
    } catch (error) {
      toast.error('An error occurred while checking the reset token.');
      console.error('Error checking reset token:', error);
      setIsTokenValid(false);
    }
  }

  // Check token validity on component mount
  useEffect(() => {
    if (id) {
      checkUserResetToken(id);
    }
  }, [id]);

  useEffect(() => {
    if (isTokenValid === false) {
      router.push('/');
    }
  }, [isTokenValid, router]);

  if (isTokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Checking reset token...</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url('/themes/backend/img/DroomPay_Background.jpg')`, backgroundSize: 'cover' }}
    >
      {isTokenValid && <ResetPasswordForm token={id} />}
    </div>
  );
};

export default ResetPassword;
