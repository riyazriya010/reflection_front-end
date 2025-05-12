"use client"

import { useRouter } from 'next/navigation';
import EmployeeGotRequestedStatus from './Card';
import RequestedMailTable from './Requested';
import employeeApi from '@/app/api/employee';
import { useEffect, useState } from 'react';

export default function EmployeeDashBoard() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [department, setDepartment] = useState('')

    useEffect(() => {
        const getUserName = localStorage.getItem('username')
        const getDepartment = localStorage.getItem('department')
        if (getUserName && getDepartment) {
            setUsername(getUserName)
            setDepartment(getDepartment)
        }
    })

    const handleLogout = async () => {
        const response = await employeeApi.logout()
        if (response.data.success) {
            router.replace('/')
        }
    }


    return (
        <>
            <div className="min-h-screen bg-[#121212] p-10">
                <div className="max-w-6xl mx-auto text-white space-y-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold mb-10">Employee Dashboard</h1>

                        <div className="flex items-center gap-4 bg-gray-800 px-4 py-2 rounded-xl text-white shadow-md">
                            <div className="text-right leading-tight">
                                <p className="text-sm font-semibold text-gray-300">Department</p>
                                <p className="text-md font-bold">{department}</p>
                            </div>
                            <div className="h-10 w-[1px] bg-gray-600 mx-2" />
                            <div className="text-right leading-tight">
                                <p className="text-sm font-semibold text-gray-300">Name</p>
                                <p className="text-md font-bold">{username}</p>
                            </div>
                        </div>

                        <button
                            className="bg-red-600 hover:bg-red-700 border-2 border-red-800 rounded-full h-12 w-24 text-white font-semibold transition"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>


                    {/* Card Details Of employee got request from others */}
                    <EmployeeGotRequestedStatus />

                    {/* Table Details of employee requested feedback from others */}
                    <RequestedMailTable />
                </div>
            </div>
        </>

    );
}
