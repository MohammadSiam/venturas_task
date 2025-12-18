import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    // Switch to login form after successful registration
    setTimeout(() => {
      setIsLogin(true);
      setShowSuccessMessage(false);
    }, 3000);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setShowSuccessMessage(false);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setShowSuccessMessage(false);
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Account created successfully!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You can now sign in with your new account.
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-xs text-gray-500">
                Redirecting to login...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLogin) {
    return <LoginForm onSwitchToRegister={switchToRegister} />;
  }

  return (
    <RegisterForm
      onSuccess={handleRegistrationSuccess}
      onSwitchToLogin={switchToLogin}
    />
  );
};

export default AuthWrapper;
