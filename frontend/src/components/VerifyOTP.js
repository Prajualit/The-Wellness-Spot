import { useState, useEffect } from "react";
import axios from "axios";
import { sendOTP, confirmOTP } from "../firebase/otp"; // your existing OTP utils

export default function VerifyOTP({ name, phone }) {
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    sendOTP(phone)
      .then((result) => setConfirmationResult(result))
      .catch((err) => alert("Failed to send OTP: " + err.message));
  }, [phone]);

  const handleVerifyOTP = async () => {
    try {
      const result = await confirmOTP(confirmationResult, otp);
      const idToken = await result.user.getIdToken();

      const response = await axios.post("/api/auth/login", { idToken, name });

      if (response.status === 200) {
        alert("Login successful!");
      } else {
        alert("Login failed: " + response.data.message);
      }
    } catch (error) {
      alert(
        "OTP verification failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerifyOTP}>Verify OTP</button>
    </div>
  );
}
