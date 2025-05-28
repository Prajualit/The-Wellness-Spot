"use client";
import React from 'react'
import { useSelector } from "react-redux";

const page = () => {

    const user = useSelector((state) => state.user.user);

    return (
        <div>
            {user ? user.name : "No user logged in"}
        </div>
    )
}

export default page
