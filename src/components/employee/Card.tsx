"use client"

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type FeedbackStatus = {
    label: string;
    count: number;
    total: number;
    color: string;
};

const feedbackData: FeedbackStatus[] = [
    { label: 'Pending', count: 15, total: 50, color: '#fbbf24' },
    { label: 'Rejected', count: 10, total: 50, color: '#ef4444' },
    { label: 'Expired', count: 5, total: 50, color: '#8b5cf6' },
    { label: 'Responded', count: 20, total: 50, color: '#22c55e' }
];

export default function EmployeeGotRequestedStatus() {
    return (
        <>
            {/* Compact Dark Cards */}
            <div className="flex justify-around gap-4 md:flex-row sm:flex-col sm:gap-4">
                {feedbackData.map((item, index) => {
                    const percentage = Math.round((item.count / item.total) * 100);

                    return (
                        <div
                            key={index}
                            className="flex items-center bg-[#2c2c2c] border border-[#3a3a3a] shadow-lg rounded-2xl p-5 w-72 transition hover:scale-105 mb-4 sm:mb-0"
                        >
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${percentage}%`}
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
            </>
    );
}
