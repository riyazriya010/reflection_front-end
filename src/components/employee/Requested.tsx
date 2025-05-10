"use client";

import employeeApi from '@/app/api/employee';
import { useEffect, useState } from 'react';

const feedbackList = [
    { date: '2025-05-08', name: 'John Doe', status: 'Pending' },
    { date: '2025-05-07', name: 'Anonymous', status: 'Submitted' },
    { date: '2025-05-06', name: 'Alice Ray', status: 'Rejected' },
    { date: '2025-05-05', name: 'Anonymous', status: 'Expired' },
];

const statusColors: Record<string, string> = {
    Pending: 'text-yellow-400',
    Submitted: 'text-green-400',
    Rejected: 'text-red-400',
    Expired: 'text-violet-400',
};

const employeeNames = ['John Doe', 'Alice Ray', 'Mark Stone'];

export default function RequestedMailTable() {
    const [statusFilter, setStatusFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [employees, setEmployees] = useState([])

    const filteredData = feedbackList.filter((item) => {
        const matchStatus = statusFilter ? item.status === statusFilter : true;
        const matchFrom = fromDate ? new Date(item.date) >= new Date(fromDate) : true;
        const matchTo = toDate ? new Date(item.date) <= new Date(toDate) : true;
        return matchStatus && matchFrom && matchTo;
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await employeeApi.getEmployees()
            console.log('respo ',response)
            if(response.data.success){
                setEmployees(response.data.result)
            }
        }
        fetchData()
    })

    return (
        <>
            <div>
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-black p-2 rounded-[22px]"
                    >
                        Request Feedback
                    </button>
                </div>
                <div className="mt-8 bg-[#1e1e1e] p-6 rounded-2xl shadow-lg text-white">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">FeedBack I requested from others</h2>

                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-[#2c2c2c] border border-[#3a3a3a] text-white px-3 py-1 rounded"
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Expired">Expired</option>
                            </select>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="bg-[#2c2c2c] border border-[#3a3a3a] text-white px-3 py-1 rounded"
                            />

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="bg-[#2c2c2c] border border-[#3a3a3a] text-white px-3 py-1 rounded"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#3a3a3a] text-gray-400 text-left">
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, i) => (
                                    <tr key={i} className="border-b border-[#2a2a2a] hover:bg-[#2e2e2e] transition">
                                        <td className="py-3">{item.date}</td>
                                        <td className="py-3">{item.name}</td>
                                        <td className={`py-3 ${statusColors[item.status]}`}>{item.status}</td>
                                        <td className="py-3">
                                            <button className="text-blue-400 hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                            No results found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-md shadow-lg text-white">
                        <h2 className="text-xl font-semibold mb-4">Request Feedback</h2>

                        <label className="block mb-2">Select Employee</label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="w-full bg-[#2c2c2c] border border-[#3a3a3a] px-3 py-2 rounded mb-4"
                        >
                            <option value="">Select</option>
                            {employeeNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>

                        <label className="block mb-2">Message</label>
                        <textarea
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-[#2c2c2c] border border-[#3a3a3a] px-3 py-2 rounded mb-4"
                            placeholder="Write your message..."
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setSelectedEmployee('')
                                }

                                }
                                className="bg-gray-500 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle request submission here
                                    console.log('Requested:', selectedEmployee, feedbackMessage);
                                    setIsModalOpen(false);
                                    setSelectedEmployee('')
                                }}
                                className="bg-blue-500 px-4 py-2 rounded"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </>

    );
}
