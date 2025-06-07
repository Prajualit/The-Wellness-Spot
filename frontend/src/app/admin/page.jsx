"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminGuard from "@/lib/AdminGuard";
import axios from "@/lib/axios";
import TokenCheck from "@/lib/tokenCheck";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.post("/admin/get-all-users");
                if (res.status !== 200) {
                    console.error("Failed to fetch stats:", res.data.message);
                    return;
                } else {
                    const data = res.data.data;
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }
        fetchStats();
    }, []);

    return (
        <>
            <TokenCheck />
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
                            </CardContent>
                        </Card>
                    ) : (
                        <div>Loading stats...</div>
                    )}
                </div>
            </AdminGuard>
        </>
    );
}
