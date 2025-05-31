"use client";
import React from 'react'
import { useSelector } from "react-redux";
import Dashboard from "@/components/dashboard/dashboard.jsx";

const page = () => {

    const user = useSelector((state) => state.user.user);
    return (
        <div>
            <Dashboard user={user} />
        </div>
    )
}

export default page
