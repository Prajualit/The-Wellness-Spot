import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const setupRecaptcha = () => {
  if (typeof window === "undefined") return;

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      }
    );
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }
};

export const sendOTP = async (phoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const confirmOTP = async (confirmationResult, otpCode) => {
  return await confirmationResult.confirm(otpCode);
};
