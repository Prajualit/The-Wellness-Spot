import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';

const Table = () => {

    const Thead = [
        'BMI',
        'Weight',
        'Height',
        'Actions'
    ];

    const user = useSelector((state) => state.user.user);

    return (
        <table className="flex-1">
            <thead>
                <tr className="bg-gray-50">
                    {Thead.map((item, index) => {
                        return (
                            <th
                                key={index}
                                className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 px-4 py-3 text-left text-[#101518] w-[400px] text-sm font-medium leading-normal">
                                {item}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {user.records.map((item, index) => {
                    return (
                        <tr key={index} className="border-t border-t-[#d4dde2]">
                            <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                                {item.weight}
                            </td>
                            <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                                {item.height}
                            </td>
                            <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                                {item.bmi}
                            </td>
                            <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                                <Button>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Table
