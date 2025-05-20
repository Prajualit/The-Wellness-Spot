'use client'
import { useState } from "react";
import UserInfoForm from "@/components/UserInfoForm";
import VerifyOTP from "@/components/VerifyOTP";

export default function Login() {
    const [step, setStep] = useState("userinfo"); // which step to show
    const [userData, setUserData] = useState({}); // store name + phone from step 1

    return (
        <div>
            {step === "userinfo" && (
                <UserInfoForm
                    onNext={(data) => {
                        setUserData(data);
                        setStep("verify");
                    }}
                />
            )}
            {step === "verify" && <VerifyOTP name={userData.name} phone={userData.phone} />}
        </div>
    );
}
