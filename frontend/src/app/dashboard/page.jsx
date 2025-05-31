"use client";
import React from 'react'
import { useSelector } from "react-redux";
import Dashboard from '../../components/dashboard';

const page = () => {

    const user = useSelector((state) => state.user.user);

    return (
        <div>
            {user ? user.name : "No user logged in"}
            <Dashboard/>
        </div>
    )
}

export default page
