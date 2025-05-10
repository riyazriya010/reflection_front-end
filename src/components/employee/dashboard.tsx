"use client"

import { useRouter } from 'next/navigation';
import EmployeeGotRequestedStatus from './Card';
import RequestedMailTable from './Requested';
import employeeApi from '@/app/api/employee';

export default function EmployeeDashBoard() {
    const router = useRouter()
    
    const handleLogout = async () => {
        const response = await employeeApi.logout()
        if(response.data.success){
            router.replace('/')
        }
    }


    return (
        <>
            <div className="min-h-screen bg-[#121212] p-10">
                <div className="max-w-6xl mx-auto text-white space-y-10">
                    <div className='flex justify-between'>
                        <h1 className="text-3xl font-bold mb-10">Employee Dashboard</h1>
                        <button 
                        className='bg-red-600 border-8 border-red-700 rounded-[22px] h-12 w-20 text-white'
                        onClick={() => handleLogout()}
                        >Logout</button>
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
