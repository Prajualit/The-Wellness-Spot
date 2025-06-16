"use client";
import React from 'react'
import { useSelector } from "react-redux";
import Dashboard from '../../components/dashboard/dashboard.jsx';
import Footer from '@/components/footer.js';

const page = () => {

    return (
        <div>
            <Dashboard/>
            <Footer />
        </div>
    )
}

export default page
