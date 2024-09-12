'use client'
import { toast } from "react-toastify";
import LoginForm from "./components/LoginForm"
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';

const HomePage = () => {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('invaliduser')) {
      toast.error('Please login to access your account.');
    }
  }, [searchParams]);

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