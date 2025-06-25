"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminGuard from "@/lib/AdminGuard";
import axios from "@/lib/axios.js";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ViewRecord from "@/components/admin/ViewRecord.jsx";
import UserCircleSolidIcon from '@/components/svg/UserCircleSolidIcon';
import Header from "@/components/dashboard/header";

export default function AdminDashboard() {
    const [users, setUsers] = useState(null);

    const Thead = ["Photo", "Name", "Phone", "Joined At", "Last Active", "Records", "Actions"];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.post("/admin/get-all-users");
                if (res.status !== 200) {
                    console.error("Failed to fetch stats:", res.data.message);
                    return;
                } else {
                    const data = res.data.data;
                    const users = data.users;
                    console.log("Users:", users);
                    setUsers(users);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }
        fetchStats();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        try {
            const response = await axios.delete(`/admin/delete-user/${userId}`);
            if (response.status === 200) {
                setUsers(users.filter(user => user._id !== userId));
                console.log('User deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        }
    };

    return (
        <AdminGuard>
            <Header />
            <div className="lg:px-14 px-5 py-14 flex flex-col space-y-6">
                <h1 className="text-[36px] font-bold">Users</h1>
                    <div className="flex flex-col space-y-4 items-center justify-center">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        {Thead.map((item, index) => (
                                            <th
                                                key={index}
                                                className="text-left px-4 py-3 text-[#101518] text-sm font-medium leading-normal border-b"
                                            >
                                                {item}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && users.length > 0 ? (
                                        users.map((user) => {
                                            const records = user.records || [];

                                            const userData = [
                                                user.avatarUrl,
                                                user.name,
                                                user.phone,
                                                new Date(user.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }),
                                                new Date(user.updatedAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                }),
                                                records.length
                                            ];

                                            return (
                                                <tr key={user._id} className="border-t border-t-[#d4dde2] hover:bg-gray-50">
                                                    {userData.map((item, index) => (
                                                        <td
                                                            key={`${user._id}-${index}`}
                                                            className="px-4 py-3 text-[#5c778a] text-sm font-normal leading-normal"
                                                        >
                                                            {/* Handle Avatar Image */}
                                                            {index === 0 && typeof item === 'string' && item.startsWith('http') ? (
                                                                <Image
                                                                    src={item}
                                                                    alt="User Avatar"
                                                                    width={40}
                                                                    height={40}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : index === 0 ? (
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <UserCircleSolidIcon size={30} color="gray" />
                                                                </div>
                                                            ) :
                                                                index === 5 ? (
                                                                    <div className="flex items-center gap-2">
                                                                        {records.length > 0 ? (
                                                                            <ViewRecord records={records} userName={user.name} />
                                                                        ) : (
                                                                            records.length === 0 && (
                                                                                <span className="text-gray-500">No Records</span>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span>{item || 'N/A'}</span>
                                                                )}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-3 text-[#5c778a] text-sm font-bold leading-normal">
                                                        <Button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            variant="destructive"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                        >
                                                            Delete User
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr className="border-t border-t-[#d4dde2]">
                                            <td
                                                colSpan={7}
                                                className="text-center w-full text-[#5c778a] text-sm font-normal leading-normal py-8"
                                            >
                                                {users === null ? 'Loading users...' : 'No users found.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminGuard>
    );
}