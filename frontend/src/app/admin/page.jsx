"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminGuard from "@/lib/AdminGuard";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            const res = await fetch("http://localhost:5000/api/v1/admin/dashboard-stats", {
                credentials: "include",
            });
            const data = await res.json();
            setStats(data.data);
        }

        fetchStats();
    }, []);

    return (
        <AdminGuard>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                {stats ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>Total Users: {stats.totalUsers}</div>
                            {/* Add more stats here */}
                        </CardContent>
                    </Card>
                ) : (
                    <div>Loading stats...</div>
                )}
            </div>
        </AdminGuard>
    );
}
