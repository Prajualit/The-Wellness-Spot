import React from 'react'

const Table = () => {

    const Thead = [
        'Date',
        'Blood Sugar',
        'Blood Pressure',
        'BMI',
        'Weight',
        'Actions'
    ];

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
                <tr className="border-t border-t-[#d4dde2]">
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-120 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        2024-07-20
                    </td>
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-240 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        95 mg/dL
                    </td>
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-360 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        120/80 mmHg
                    </td>
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-480 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        22.5
                    </td>
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-600 h-[72px] px-4 py-2 w-[400px] text-[#5c778a] text-sm font-normal leading-normal">
                        135 lbs
                    </td>
                    <td className="table-952c22f1-0138-435f-b64e-7ec1d8771011-column-720 h-[72px] px-4 py-2 w-60 text-[#5c778a] text-sm font-bold leading-normal tracking-[0.015em]">
                        Delete
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Table
