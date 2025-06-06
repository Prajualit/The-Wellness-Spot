"use client";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("http://localhost:5000/api/v1/admin/all-users", {
                credentials: "include",
            });
            const data = await res.json();
            setUsers(data.data);
        }

        fetchUsers();
    }, []);

    return (
        <AdminGuard>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">All Users</h1>
                {users.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>User List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ) : (
                    <div>Loading users...</div>
                )}
            </div>
        </AdminGuard>
    );
}
