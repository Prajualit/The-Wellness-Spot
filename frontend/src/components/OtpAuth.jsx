'use client';
import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const OtpAuth = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const configureCaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => sendOTP()
            });
        }
    };

    const sendOTP = async () => {
        configureCaptcha();
        try {
            const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            console.log('OTP sent to ' + phone);
        } catch (error) {
            console.error('Error sending OTP: ', error.message);
        }
    };

    const verifyOTP = async () => {
        try {
            const result = await confirmationResult.confirm(otp);
            console.log('OTP verified successfully', result.user.uid);
        } catch (error) {
            console.error('Error verifying OTP: ', error.message);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Firebase OTP Auth</h2>
            <input
                type="text"
                placeholder="+91xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 my-2 w-full"
            />
            <div id="recaptcha-container"></div>
            <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-2 rounded">
                Send OTP
            </button>

            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 my-2 w-full"
            />
            <button onClick={verifyOTP} className="bg-green-500 text-white px-4 py-2 rounded">
                Verify OTP
            </button>
        </div>
    );
};

export default OtpAuth;
