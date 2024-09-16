'use client'
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../lib/apiHelper';
import { toast } from "react-toastify";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const submitResetForm = async () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (isValid) {
      setLoading(true);
      try {

        const resetData = {
          email: email,
          user_type: 'Merchant',
          temp_token: 'reset-password'
        };
        const response = await apiRequest("POST", "/forgot-password", { post: resetData });
        if (response.StatusCode === '1') {
            toast.success(response.Message);
            setTimeout(function () {
                router.push('/');
            }, 2000);
        } else {
            if(response.Message) {
                toast.error(response.Message);
            } else {
                toast.error('Something error. Please try again later.');
            }
        }
      } catch (error) {
        console.error('Error logging in:', error);
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
        <p className="text-center text-gray-600 mt-2">Reset Password</p>
        <form action="/" method="" id="reset-password" className="mt-4">
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p id="emailError" className="text-red-500 text-sm mt-1">{emailError}</p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className={`bg-blue-500 text-white p-2 rounded-lg w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={submitResetForm}
              disabled={loading}
            >
              Request New Password
            </button>
          </div>
        </form>
        <div className="mt-1 font-bold">
          <Link href="/" className="text-blue-500">Sign in with old password??</Link>
        </div>
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
