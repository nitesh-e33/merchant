'use client'
import LoginForm from "./components/LoginForm"

const HomePage = () => {
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
