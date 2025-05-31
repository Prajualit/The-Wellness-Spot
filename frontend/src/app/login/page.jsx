"use client";
import React, { useState } from "react";
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
    const [confirmationResult, setConfirmationResult] = useState(null);

    const router = useRouter();

    const sendOtp = async (e) => {
        e.preventDefault();
        try {
            const fullPhone = "+91" + phone;
            const result = await sendOTP(fullPhone);
            setConfirmationResult(result);
            setIsOtpSent(true);
        } catch (err) {
            console.error("Failed to send OTP:", err.message);
        }
    };

    const dispatch = useDispatch();

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await confirmOTP(confirmationResult, otp);
            const idToken = await result.user.getIdToken(true);

            const response = await axios.post("/api/v1/users/login", { idToken, name });

            console.log("Login response:", response);

            if (response.status === 200) {
                dispatch(setUser(response.data.data.user));
                router.push("/dashboard");
            } else {
                console.error("Login failed: " + response.data.message);
            }
        } catch (error) {
            console.error(
                "OTP verification failed: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Login Your Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                        required
                                    />
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button className="w-full" type="submit">Send OTP</Button>
                            </form>
                        </TabsContent>
                    </Tabs>


                    {isOtpSent && (
                        <form onSubmit={handleVerifyOTP}>
                            <Separator className="my-6" />
                            <div className="space-y-4 flex flex-col">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter the OTP sent to your phone"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
            <div id="recaptcha-container" />
        </div>
    );
}
