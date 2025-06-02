import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import axios from '@/lib/axios.js';
import { updateUser } from '@/redux/Slice/userSlice.js';

const Table = () => {
    const Thead = ['BMI', 'Weight', 'Height', 'Age', 'Actions'];
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const handleDelete = async (recordId) => {
        try {
            const response = await axios.delete(`/users/remove-record/${recordId}`);
            if (response.status === 200) {
                console.log(response.data);
                dispatch(updateUser(updatedUser));
                console.log('Record deleted successfully');
            } else {
                console.log('Failed to delete record: ' + response.data.message);
            }
            console.error('Error deleting record:', error);
        }
    };

    return (
        <table className="flex-1">
            <thead>
                <tr className="bg-gray-50">
                            </th>
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
                {user.records.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            className="text-center text-[#5c778a] text-sm font-normal leading-normal py-4"
                        >
                            No records found
                        </td>
                    </tr>
                ) : (
                    user.records.map((item) => {
                        const itemList = [item.bmi, item.weight, item.height, item.age];

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
                                    <Button
                                        onClick={() => handleDelete(item._id)}
                                        className="cursor-pointer"
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
};

export default Table;
