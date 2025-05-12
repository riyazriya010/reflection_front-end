"use client"

import employeeApi from '@/app/api/employee';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FeedbackStatus = {
    label: string;
    count: number;
    total: number;
    color: string;
};

export default function EmployeeGotRequestedStatus() {
    const router = useRouter();
    const [feedbackStats, setFeedbackStats] = useState<FeedbackStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await employeeApi.getAllRquestGot();
                console.log('API response:', response);

                if (response.data?.success && response.data?.result) {
                    const feedbacks = response.data.result;

                    // Calculate counts for each status
                    const statusCounts = feedbacks.reduce((acc: Record<string, number>, feedback: { status: string | number; }) => {
                        acc[feedback.status] = (acc[feedback.status] || 0) + 1;
                        return acc;
                    }, {});

                    // Create stats array
                    const stats: FeedbackStatus[] = [
                        {
                            label: 'Pending',
                            count: statusCounts['pending'] || 0,
                            total: feedbacks.length,
                            color: '#fbbf24'
                        },
                        {
                            label: 'Rejected',
                            count: statusCounts['rejected'] || 0,
                            total: feedbacks.length,
                            color: '#ef4444'
                        },
                        {
                            label: 'Expired',
                            count: statusCounts['expired'] || 0,
                            total: feedbacks.length,
                            color: '#8b5cf6'
                        },
                        {
                            label: 'Responded',
                            count: statusCounts['responded'] || 0,
                            total: feedbacks.length,
                            color: '#22c55e'
                        }
                    ];

                    setFeedbackStats(stats);
                }
            } catch (error: any) {
                console.log(error)
                if (error && error.response?.status === 401) {
                    toast.warn(error.response?.data?.message)
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCard = (status: string) => {
        router.push(`/pages/employee/feedback?status=${status.toLowerCase()}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] p-10 text-white flex justify-center items-center">
                <p>Loading feedback statistics...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <ToastContainer
                autoClose={2000}
                pauseOnHover={false}
                transition={Slide}
                hideProgressBar={false}
                closeOnClick={false}
                pauseOnFocusLoss={true}
            />
            {/* Compact Dark Cards */}
            <div className="flex justify-around gap-4 md:flex-row sm:flex-col sm:gap-4">
                {feedbackStats.map((item, index) => {
                    const percentage = Math.round((item.count / item.total) * 100);

                    return (
                        <div
                            key={index}
                            className="flex items-center bg-[#2c2c2c] border border-[#3a3a3a] shadow-lg rounded-2xl p-5 w-72 transition hover:scale-105 mb-4 sm:mb-0 cursor-pointer"
                            onClick={() => handleCard(item.label)}
                        >
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${percentage || 0}%`}
                                    styles={buildStyles({
                                        pathColor: item.color,
                                        trailColor: '#444',
                                        textColor: '#ffffff',
                                        textSize: '26px',
                                    })}
                                />
                            </div>

                            <div className="ml-4">
                                <p className="text-base font-semibold text-white">{item.label}</p>
                                <p className="text-sm text-gray-300">
                                    {item.count} of {item.total}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}