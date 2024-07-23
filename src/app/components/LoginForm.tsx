import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from "../lib/constant";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  
  const submitLoginForm = async() => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (isValid) {
      try {
        let response = await fetch(`${API_BASE_URL}/merchant/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email: email, password: password, isLoginProcess: email})
        });

        // Handle the response from the API
        response = await response.json();
        console.log('Login successful:', response);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in:', error);
      }
    }
  };

  return (
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full heigh">
        <div className="flex justify-center">
          <Image
            src="/themes/backend/img/DroomPay.png"
            alt="DroomPay Logo"
            width={180}
            height={50}
          />
        </div>
        <p className="text-center text-gray-600 mt-2">Sign in to start your session</p>
        <form action="/login" method="post" id="loginwithpassword" className="mt-4">
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
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p id="passwordError" className="text-red-500 text-sm mt-1">{passwordError}</p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded-lg w-full"
              onClick={submitLoginForm}
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-1 font-bold">
          <Link href="/forgotpassword" className="text-blue-500">Forgot Your Password?</Link>
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
