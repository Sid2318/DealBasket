import React, { useState } from "react";
import "./SignUpPage.scss";
import SignUpForm from "./components/SignUpForm";
import OtpVerification from "./components/OtpVerification";

const SignUpPage = () => {
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: OTP Verification
  const [formData, setFormData] = useState(null);

  // Handle successful OTP sending
  const handleOtpSent = (userData) => {
    setFormData(userData);
    setStep(2);
  };

  // Handle back to form from OTP verification
  const handleBackToForm = () => {
    setStep(1);
    setFormData(null);
  };

  return (
    <>
      {step === 1 ? (
        <SignUpForm onOtpSent={handleOtpSent} />
      ) : (
        <OtpVerification formData={formData} onBackToForm={handleBackToForm} />
      )}
    </>
  );
};

export default SignUpPage;
