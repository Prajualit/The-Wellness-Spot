import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import axios from '@/lib/axios.js';
import { updateUser } from '@/redux/Slice/userSlice.js';
import LoadingButton from '../ui/LoadingButton';
import RecordDetailModal from './RecordDetailModal';
import EditRecordModal from './EditRecordModal';

const Table = () => {
    const Thead = ['Date', 'BMI', 'Weight', 'Height', 'Age', 'Actions', 'More'];
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState(null);

    const handleDelete = async (recordId) => {
        try {
            const response = await axios.delete(`/users/remove-record/${recordId}`);
            if (response.status === 200) {
                const { updatedUser } = response.data;
                dispatch(updateUser(updatedUser));
            }
        } catch (error) {
            // Handle delete error
        }
    };

    const handleEdit = (record) => {
        setRecordToEdit(record);
        setIsEditModalOpen(true);
    };

    const handleMoreActions = (recordId) => {
        const record = user?.records.find(r => r._id === recordId);
        if (record) {
            setSelectedRecord(record);
            setIsDetailModalOpen(true);
        }
    };

    const DeleteIcon = ({ size = 24, color = "#000000" }) => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                role="img"
            >
                <path
                    d="M19.5 5.5L18.6139 20.121C18.5499 21.1766 17.6751 22 16.6175 22H7.38246C6.32488 22 5.4501 21.1766 5.38612 20.121L4.5 5.5"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M3 5.5H8M21 5.5H16M16 5.5L14.7597 2.60608C14.6022 2.2384 14.2406 2 13.8406 2H10.1594C9.75937 2 9.39783 2.2384 9.24025 2.60608L8 5.5M16 5.5H8"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9.5 16.5L9.5 10.5"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M14.5 16.5L14.5 10.5"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    const EditIcon = ({ size = 24, color = "#000000" }) => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                role="img"
            >
                <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    return (
        <div>
            <table className="flex-1 ">
                <thead>
                    <tr className="bg-gray-50 ">
                        {Thead.map((item, index) => (
                            <th
                                key={index}
                                className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal"
                            >
                                {item}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {user?.records.length === 0 ? (
                        <tr className="border-t border-t-[#d4dde2]">
                            <td
                                colSpan={7}
                                className="text-center w-full border text-[#5c778a] text-sm font-normal leading-normal py-4"
                            >
                                No records found. Please add a new record.
                            </td>
                        </tr>
                    ) : (
                        user?.records.map((item) => {
                            const itemList = [item?.createdAt
                                ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })
                                : 'N/A', 
                                item.bmi, 
                                (item.lastWeight || item.weight), 
                                item.height, 
                                item.age
                            ];

                            return (
                                <tr
                                    key={item._id}
                                    className="border-t border-t-[#d4dde2]"
                                >
                                    {itemList.map((value, index) => (
                                        <td
                                            key={`${item._id}-${index}`}
                                            className="h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal"
                                        >
                                            {value}
                                        </td>
                                    ))}
                                    <td className="h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="cursor-pointer hover:bg-green-50 hover:scale-110 rounded-full p-2 transition-all duration-300 flex items-center justify-center"
                                                title="Edit record"
                                            >
                                                <EditIcon size={18} color="green" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="cursor-pointer hover:bg-gray-100 hover:scale-110 rounded-full p-2 transition-all duration-300 flex items-center justify-center"
                                                title="Delete record"
                                            >
                                                <DeleteIcon size={18} color="#be1515" />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <LoadingButton
                                            onClick={() => handleMoreActions(item._id)}
                                            className="!bg-white !text-black hover:!bg-gray-100"
                                            title="More actions"
                                        >
                                            View More
                                        </LoadingButton>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            
            <RecordDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                record={selectedRecord}
            />
            
            <EditRecordModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                record={recordToEdit}
            />
        </div>
    );
};

export default Table;
