"use client";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { sendOTP, confirmOTP } from "@/firebase/otp.js";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/Slice/userSlice.js";


export default function LoginPage() {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const router = useRouter();
    const dispatch = useDispatch();

    // Initialize recaptcha on component mount
    useEffect(() => {
        // Ensure recaptcha container is ready
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
            // Clear any existing recaptcha
            recaptchaContainer.innerHTML = '';
        }
    }, []);

    // Phone number validation
    const validatePhone = (phoneNumber) => {
        const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
        return phoneRegex.test(phoneNumber);
    };

    // Name validation
    const validateName = (name) => {
        return name && name.trim().length >= 2;
    };

    // OTP validation
    const validateOTP = (otp) => {
        return otp && otp.trim().length === 6 && /^\d{6}$/.test(otp.trim());
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Validate inputs
            const trimmedName = name.trim();
            const trimmedPhone = phone.trim();

            if (!validateName(trimmedName)) {
                setError("Please enter a valid name (at least 2 characters)");
                return;
            }

            if (!validatePhone(trimmedPhone)) {
                setError("Please enter a valid 10-digit mobile number");
                return;
            }

            setLoading(true);
            const fullPhone = "+91" + trimmedPhone;

            console.log("Sending OTP to:", fullPhone);
            const result = await sendOTP(fullPhone);

            if (!result) {
                throw new Error("Failed to send OTP. Please try again.");
            }

            setConfirmationResult(result);
            setIsOtpSent(true);
            setError("");

        } catch (err) {
            console.error("Failed to send OTP:", err);
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Validate OTP
            const trimmedOTP = otp.trim();

            if (!validateOTP(trimmedOTP)) {
                setError("Please enter a valid 6-digit OTP");
                return;
            }

            if (!confirmationResult) {
                setError("Please request OTP first");
                return;
            }

            setLoading(true);

            console.log("Verifying OTP:", trimmedOTP);
            const result = await confirmOTP(confirmationResult, trimmedOTP);

            if (!result || !result.user) {
                throw new Error("OTP verification failed");
            }

            console.log("OTP verified, getting ID token...");
            const idToken = await result.user.getIdToken(true);

            if (!idToken) {
                throw new Error("Failed to get authentication token");
            }

            console.log("Logging in user...");
            const response = await axios.post("/users/login", {
                idToken: idToken,
                name: name.trim()
            });

            console.log("Login response:", response);

            if (response.status === 200 && response.data?.data?.user) {
                dispatch(setUser(response.data.data.user));
                router.push("/dashboard");
            } else {
                throw new Error(response.data?.message || "Login failed");
            }

        } catch (error) {
            console.error("OTP verification failed:", error);
            let errorMessage = "OTP verification failed. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);

            // If verification fails, allow user to retry
            if (error.code === 'auth/invalid-verification-code') {
                setError("Invalid OTP. Please check and try again.");
            }

        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setError("");
        setOtp("");
        setIsOtpSent(false);
        setConfirmationResult(null);
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: 'url(/download.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'left',
                backgroundRepeat: 'repeat',
                position: 'relative',
            }}
        >
            {/* Background overlay for better contrast */}
            <div className="absolute inset-0 bg-blue-900/40"></div>

            {/* Content */}
            <Card className="w-full max-w-md shadow-xl relative z-10">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Login Your Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <Tabs defaultValue="phone" className="w-full">
                        <TabsContent value="phone">
                            <form onSubmit={sendOtp} className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isOtpSent || loading}
                                        required
                                        minLength={2}
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                            +91
                                        </span>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter 10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 10) {
                                                    setPhone(value);
                                                }
                                            }}
                                            disabled={isOtpSent || loading}
                                            required
                                            maxLength={10}
                                            className="rounded-l-none"
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={isOtpSent || loading}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {isOtpSent && (
                        <>
                            <Separator className="my-6" />
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 6) {
                                                setOtp(value);
                                            }
                                        }}
                                        required
                                        maxLength={6}
                                    />
                                    <p className="text-sm text-gray-600">
                                        OTP sent to +91{phone}
                                    </p>
                                </div>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={resendOTP}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </Button>
                            </form>
                        </>
                    )}
                </CardContent>
            </Card>
            <div id="recaptcha-container" />
        </div>
    );
}