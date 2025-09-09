import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Trash2, Plus } from "lucide-react";
import AdminRecordDetailModal from "./AdminRecordDetailModal";
import AdminEditRecordModal from "./AdminEditRecordModal";
import AdminAddRecordModal from "./AdminAddRecordModal";
import axios from "../../lib/axios";

const ViewRecord = ({ records, userName, userId, onUpdateRecord }) => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const Thead = ['Date', 'BMI', 'Weight', 'Height', 'Age', 'Actions'];

    const handleViewMore = (record) => {
        setSelectedRecord(record);
        setShowDetailModal(true);
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

    const handleAddRecord = () => {
        setShowAddModal(true);
    };

    const handleDelete = (record) => {
        setRecordToDelete(record);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!recordToDelete || !userId) return;
        
        setIsDeleting(true);
        try {
            const response = await axios.delete(`/admin/delete-user-record/${userId}/${recordToDelete._id}`);
            
            if (response.data.message || response.status === 200) {
                // Call parent callback to refresh data
                if (onUpdateRecord) {
                    onUpdateRecord();
                }
                setShowDeleteConfirm(false);
                setRecordToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setRecordToDelete(null);
    };

    const handleUpdateRecord = () => {
        // Call parent callback to refresh data
        if (onUpdateRecord) {
            onUpdateRecord();
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                        View Records
                    </Button>
                </DialogTrigger>

                <DialogContent className="bg-white w-[95%] sm:w-[85%] min-h-[60%] max-h-[90vh] overflow-auto flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl">
                            {userName ? `${userName}'s Records` : 'User Records'}
                        </DialogTitle>
                        <div className="flex justify-center mt-4">
                            <Button
                                onClick={handleAddRecord}
                                className="bg-green-700 cursor-pointer hover:bg-green-800 text-white"
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Record
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="text-sm w-full text-neutral-500">
                        <Card className="w-full border-none shadow-none">
                            <CardContent className={"px-0"}>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                {Thead.map((item, index) => (
                                                    <th
                                                        key={index}
                                                        className="px-4 py-3 text-left text-[#101518] text-sm font-medium leading-normal border-b"
                                                    >
                                                        {item}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!records || records.length === 0 ? (
                                                <tr className="border-t border-t-[#d4dde2]">
                                                    <td
                                                        colSpan={6}
                                                        className="text-center w-full text-[#5c778a] text-sm font-normal leading-normal py-8"
                                                    >
                                                        No records found for this user.
                                                    </td>
                                                </tr>
                                            ) : (
                                                records.map((item) => {
                                                    const itemList = [
                                                        item?.createdAt
                                                            ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })
                                                            : 'N/A',
                                                        item.bmi || 'N/A',
                                                        item.weight ? `${item.weight} kg` : 'N/A',
                                                        item.height ? `${item.height} cm` : 'N/A',
                                                        item.age || 'N/A'
                                                    ];

                                                    return (
                                                        <tr
                                                            key={item._id}
                                                            className="border-t border-t-[#d4dde2] hover:bg-gray-50"
                                                        >
                                                            {itemList.map((value, index) => (
                                                                <td
                                                                    key={`${item._id}-${index}`}
                                                                    className="px-4 py-3 text-[#5c778a] text-sm font-normal leading-normal"
                                                                >
                                                                    {value}
                                                                </td>
                                                            ))}
                                                            <td className="px-4 py-3">
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleViewMore(item)}
                                                                        className="h-8 px-3 text-xs hover:bg-green-50 hover:text-green-700"
                                                                    >
                                                                        <Eye className="h-3 w-3 mr-1" />
                                                                        View More
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEdit(item)}
                                                                        className="h-8 px-3 text-xs hover:bg-green-50 hover:text-green-700"
                                                                    >
                                                                        <Edit3 className="h-3 w-3 mr-1" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(item)}
                                                                        className="h-8 px-3 text-xs hover:bg-red-50 hover:text-red-600"
                                                                    >
                                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Admin Record Detail Modal */}
            <AdminRecordDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                record={selectedRecord}
                userName={userName}
            />

            {/* Admin Edit Record Modal */}
            <AdminEditRecordModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                record={selectedRecord}
                userName={userName}
                userId={userId}
                onUpdate={handleUpdateRecord}
            />

            {/* Admin Add Record Modal */}
            <AdminAddRecordModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                userName={userName}
                userId={userId}
                onUpdate={handleUpdateRecord}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-black">
                            Confirm Delete
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this health record? This action cannot be undone.
                        </p>
                        {recordToDelete && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Record Date:</strong> {new Date(recordToDelete.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>BMI:</strong> {recordToDelete.bmi || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Weight:</strong> {recordToDelete.weight ? `${recordToDelete.weight} kg` : 'N/A'}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={cancelDelete}
                            disabled={isDeleting}
                            className="px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="px-4 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Record'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ViewRecord;