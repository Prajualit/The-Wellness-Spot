import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Setup invisible reCAPTCHA once
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved");
        },
      },
      auth
    );
  }
};

// Send OTP
export const sendOTP = async (phoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  return confirmationResult;
};

// Confirm OTP
export const confirmOTP = async (confirmationResult, otpCode) => {
  return await confirmationResult.confirm(otpCode);
};
