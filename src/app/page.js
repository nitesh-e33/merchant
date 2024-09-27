'use client'
import { toast } from "react-toastify";
import LoginForm from "./components/LoginForm"
import { useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { decryptedData } from "./lib/helper";

const HomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('invaliduser')) {
      toast.error('Please login to access your account.');
    }
  }, [searchParams]);

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
      const userData = decryptedData(encryptedUser);
      if (userData && Object.keys(userData).length) {
        router.push(userData.isKYCVerified ? '/dashboard' : '/my-account');
      }
    }
  }, [router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundImage: `url('/themes/backend/img/DroomPay_Background.jpg')`, backgroundSize: 'cover' }}
    >
      <LoginForm />
    </div>
  );
};

export default HomePage;
