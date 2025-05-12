"use client";

import employeeApi from '@/app/api/employee';
import { useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { summarizedFeedback } from '@/lib/security/openAi';

interface Employee {
    _id: string;
    username: string;
}

interface Feedback {
    _id: any
    createdAt: string;
    receiverName: string;
    status: keyof typeof statusColors;
    deadline: string;
}

const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    responded: 'text-green-400',
    rejected: 'text-red-400',
    rxpired: 'text-violet-400',
};

export default function RequestedMailTable() {
    const [statusFilter, setStatusFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [deadline, setDeadline] = useState('');
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [errors, setErrors] = useState({ employee: '', message: '', deadline: '' });
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [loading, setLoading] = useState(false);

    const filteredData = feedbackList.filter((item: any) => {
        const matchStatus = statusFilter ? item.status === statusFilter : true;
        const matchFrom = fromDate ? new Date(item.createdAt) >= new Date(fromDate) : true;
        const matchTo = toDate ? new Date(item.createdAt) <= new Date(toDate) : true;
        return matchStatus && matchFrom && matchTo;
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await employeeApi.getEmployees();
            if (response?.data?.success) {
                setEmployees(response.data.result);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await employeeApi.requestedFeedback();
                console.log('re ', response)
                if (response?.data?.result) {
                    setFeedbackList(response.data.result);
                }
            } catch (error: any) {
                console.log(error)
                if (error && error.response?.status === 401) {
                    toast.warn(error.response?.data?.message)
                }
            }
        };
        fetchFeedbacks();
    }, []);

    const handleSubmit = async () => {
        const newErrors = { employee: '', message: '', deadline: '' };

        if (!selectedEmployee) newErrors.employee = 'Please select an employee.';
        if (!feedbackMessage.trim()) newErrors.message = 'Message cannot be empty.';
        if (!deadline) newErrors.deadline = 'Deadline should be selected.';

        if (newErrors.employee || newErrors.message || newErrors.deadline) {
            setErrors(newErrors);
            return;
        }

        const response = await employeeApi.requestFeedback(selectedEmployee, feedbackMessage, deadline);
        if (response?.data?.success) {
            setIsModalOpen(false);
            setSelectedEmployee('');
            setFeedbackMessage('');
            setDeadline('');
            setErrors({ employee: '', message: '', deadline: '' });

            // Refresh table
            const updatedFeedback = await employeeApi.requestedFeedback();
            setFeedbackList(updatedFeedback?.data?.result || []);
        }
    };

    const handleView = async (id: string) => {
        try {
            const response = await employeeApi.getMyRequeste(id);
            if (response?.data?.success) {
                setSelectedFeedback(response.data.result);
                setIsViewModalOpen(true);
            }
        } catch (error: any) {
            console.log(error)
            if (error && error.response?.status === 401) {
                toast.warn(error.response?.data?.message)
            }
        }
    }

    const summarizeFeedback = async () => {
        try {
            setLoading(true);
            const response = await employeeApi.getFeedbackMessages();
            if (response.data.success) {
                //Ai Summarize
                const summarized = await summarizedFeedback(response.data.result);
                setSummary(summarized);
                setIsModalOpen2(true);
            }
        } catch (error: any) {
            console.error(error);
            if (error?.response?.status === 401) {
                toast.warn(error.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const parseSection = (text: string, section: 'Strengths' | 'Areas for improvement') => {
        const regex = new RegExp(`${section}:\\s*([\\s\\S]*?)(\\n\\n|$)`);
        const match = text.match(regex);
        if (match) {
            return match[1].trim().split('\n').filter(Boolean);
        }
        return [];
    };

    return (
        <>
            <div>
                <div className="flex justify-end">
                    <ToastContainer
                        autoClose={2000}
                        pauseOnHover={false}
                        transition={Slide}
                        hideProgressBar={false}
                        closeOnClick={false}
                        pauseOnFocusLoss={true}
                    />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center mr-4 gap-2 bg-white text-black px-4 py-2 rounded"
                    >
                        <FaEnvelope /> Request Feedback
                    </button>

                    <button
                        onClick={summarizeFeedback}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded"
                    >
                        {loading ? 'Summarizing...' : 'Summarise All'}
                    </button>


                    {isModalOpen2 && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                            <div className="bg-zinc-900 text-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
                                <h2 className="text-2xl font-semibold mb-4">Feedback Summary</h2>

                                {summary && (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                 
                                        <div>
                                            <h3 className="text-green-400 font-medium">✅ Strengths</h3>
                                            <ul className="list-disc list-inside">
                                                {parseSection(summary, 'Strengths').map((point, idx) => (
                                                    <li key={idx}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-yellow-400 font-medium">⚠️ Areas for Improvement</h3>
                                            <ul className="list-disc list-inside">
                                                {parseSection(summary, 'Areas for improvement').map((point, idx) => (
                                                    <li key={idx}>{point}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsModalOpen2(false)}
                                    className="absolute top-3 right-4 text-white hover:text-red-400 text-xl"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    )}


                </div>

                <div className="mt-8 bg-[#1e1e1e] p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Feedback I Requested</h2>

                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-[#2c2c2c] border border-[#3a3a3a] text-white px-3 py-1 rounded"
                            >
                                <option value="">All Status</option>
                                {Object.keys(statusColors).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-auto border-collapse">
                            <thead>
                                <tr className="border-b border-[#3a3a3a] text-gray-400 text-left">
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Deadline</th>
                                    <th className="py-3 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, i) => {
                                    const formattedDate = item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                        : 'Invalid Date';

                                    const formattedDeadLine = item.deadline
                                        ? new Date(item.deadline).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })
                                        : 'Invalid Date';

                                    const status = item.status?.charAt(0).toUpperCase() + item.status?.slice(1).toLowerCase();
                                    const statusColor = statusColors[status.toLowerCase()] || 'text-gray-400';

                                    return (
                                        <tr key={i} className="border-b border-[#2a2a2a] hover:bg-[#2e2e2e] transition">
                                            <td className="py-3 px-4 whitespace-nowrap">{formattedDate}</td>
                                            <td className="py-3 px-4">{item.receiverName || 'Unknown'}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">{formattedDeadLine}</td>
                                            {
                                                item.status === 'responded' && (
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            className="text-blue-400 hover:underline hover:text-blue-300 transition duration-150"
                                                            onClick={() => handleView(item._id)}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                )
                                            }

                                        </tr>
                                    );
                                })}


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

            {isViewModalOpen && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto scrollbar-hide">
                    <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-4xl shadow-lg text-white max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-semibold mb-6">Feedback Details</h2>

                        <div className="grid grid-cols-2 gap-6">

                            <div className="col-span-2">
                                <p className="text-gray-400">Request Message</p>
                                <p className="bg-[#2c2c2c] p-3 rounded">{selectedFeedback.requestedMessage}</p>
                            </div>

                            {selectedFeedback.rating && (
                                <div className="col-span-2">
                                    <p className="text-gray-400">Rating</p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className={`text-xl ${i < selectedFeedback.rating ? 'text-yellow-400' : 'text-gray-500'}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedFeedback.repliedMessage && (
                                <div className="col-span-2">
                                    <p className="text-gray-400">Feedback Message</p>
                                    <p className="bg-[#2c2c2c] p-3 rounded">{selectedFeedback.repliedMessage}</p>
                                </div>
                            )}

                            {selectedFeedback.replyCreatedAt && (
                                <div>
                                    <p className="text-gray-400">Responded Date</p>
                                    <p>{new Date(selectedFeedback.replyCreatedAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="bg-gray-500 px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#1e1e1e] p-6 rounded-lg w-full max-w-md shadow-lg text-white">
                        <h2 className="text-xl font-semibold mb-4">Request Feedback</h2>

                        <label className="block mb-2">Select Employee</label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => {
                                setSelectedEmployee(e.target.value);
                                setErrors((prev) => ({ ...prev, employee: '' }));
                            }}
                            className="w-full bg-[#2c2c2c] border border-[#3a3a3a] px-3 py-2 rounded mb-1"
                        >
                            <option value="">Select</option>
                            {employees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.username}
                                </option>
                            ))}
                        </select>
                        {errors.employee && <p className="text-red-400 text-sm mb-3">{errors.employee}</p>}

                        <label className="block mb-2">Message</label>
                        <textarea
                            value={feedbackMessage}
                            onChange={(e) => {
                                setFeedbackMessage(e.target.value);
                                setErrors((prev) => ({ ...prev, message: '' }));
                            }}
                            rows={4}
                            className="w-full bg-[#2c2c2c] border border-[#3a3a3a] px-3 py-2 rounded mb-1"
                            placeholder="Write your message..."
                        />
                        {errors.message && <p className="text-red-400 text-sm mb-3">{errors.message}</p>}

                        <label className="block mb-2">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => {
                                setDeadline(e.target.value);
                                setErrors((prev) => ({ ...prev, deadline: '' }));
                            }}
                            className="w-full bg-[#2c2c2c] border border-[#3a3a3a] px-3 py-2 rounded mb-3"
                        />
                        {errors.deadline && <p className="text-red-400 text-sm mb-3">{errors.deadline}</p>}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedEmployee('');
                                    setFeedbackMessage('');
                                    setDeadline('');
                                    setErrors({ employee: '', message: '', deadline: '' });
                                }}
                                className="bg-gray-500 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
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
