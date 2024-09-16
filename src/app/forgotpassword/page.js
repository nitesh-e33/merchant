import ForgotPasswordForm from "../components/ForgotPasswordForm"

const Page = () => {
    return (
        <div
        className="flex items-center justify-center min-h-screen bg-gray-100"
        style={{ backgroundImage: `url('/themes/backend/img/DroomPay_Background.jpg')`, backgroundSize: 'cover' }}
        >
        <ForgotPasswordForm />
        </div>
    );
};

export default Page;
