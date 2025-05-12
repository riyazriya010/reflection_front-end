"use client"

import managerApi from "@/app/api/manager"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { FaStar, FaEnvelope } from 'react-icons/fa'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Feedback {
    _id: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    receiverName?: string;
    rating?: number;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export default function ManagerDashBoard() {
    const [department, setDepartment] = useState('')
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const itemsPerPage = 5
    const router = useRouter()

    const [username, setUsername] = useState('')


     useEffect(() => {
        const getUserName = localStorage.getItem('username')
        const getDepartment = localStorage.getItem('department')
        if (getUserName && getDepartment) {
            setUsername(getUserName)
            setDepartment(getDepartment)
        }
    })

    useEffect(() => {
        const dep = localStorage.getItem('department')
        if (dep) {
            setDepartment(dep)
            const fetchData = async () => {
            try{
                const response = await managerApi.getEmployeesFeedback(String(dep))
                if (response?.data?.success) {
                    setFeedbacks(response.data.result)
                }
            }catch(error: any){
            console.log(error)
             if (error && error.response?.status === 401) {
            toast.warn(error.response?.data?.message)
            }
            }
            }
            fetchData()
        }
    }, [department])

    // Get top 2 rated employees
    const topRated = [...feedbacks]
        .filter(f => f.rating !== undefined)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 2)

    // Pagination logic
    const totalPages = Math.ceil(feedbacks.length / itemsPerPage)
    const currentItems = feedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const sendMailToReceiver = (id: string) => {
        console.log('reciverId ',id)
    }

    const sendMailToSender = (id: string) => {
        console.log('senderId ',id)
    }

    const handleLogout = async () => {
    const response = await managerApi.logout()
    if(response.data.success){
        router.replace('/pages/manager/login')
    }
  }

    return (
        <div className="min-h-screen bg-[#121212] p-6 text-white">
            <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />
            
            <div className='flex justify-between mb-4'>
          <h1 className="text-2xl font-bold mb-8">Manager Dashboard</h1>

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
            className='bg-red-600 border-8 border-red-700 rounded-[22px] h-12 w-20 text-white'
            onClick={() => handleLogout()}
          >Logout</button>
        </div>

            {/* Top Rated Employees Section */}
            {topRated.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Top Rated Employees</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topRated.map((feedback, index) => (
                            <div key={index} className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium">{feedback.receiverName}</h3>
                                        {/* <p className="text-gray-400 text-sm">{feedback.receiverName || 'Unknown'}</p> */}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-yellow-400 mr-1">
                                            <FaStar />
                                        </span>
                                        <span>{feedback.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Feedback Table */}
            <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#2c2c2c]">
                            <tr>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Requested By</th>
                                <th className="px-6 py-3 text-left">Responded By</th>
                                <th className="px-6 py-3 text-left">Rating</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((feedback) => (
                                <tr key={feedback._id} className="border-b border-[#3a3a3a] hover:bg-[#2c2c2c]">
                                    <td className="px-6 py-4">{formatDate(feedback.createdAt)}</td>
                                    <td className="px-6 py-4">{feedback.receiverName}</td>
                                    <td className="px-6 py-4">{feedback.senderName || 'Unknown'}</td>
                                    <td className="px-6 py-4">
                                        {feedback.rating ? (
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 mr-1">
                                                    <FaStar />
                                                </span>
                                                {feedback.rating}
                                            </div>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setSelectedFeedback(feedback)
                                                setIsModalOpen(true)
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 border-t border-[#3a3a3a]">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="bg-[#2c2c2c] hover:bg-[#3a3a3a] px-4 py-2 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="bg-[#2c2c2c] hover:bg-[#3a3a3a] px-4 py-2 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Feedback Detail Modal */}
            {isModalOpen && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Feedback Details</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-400">Date</p>
                                    <p>{formatDate(selectedFeedback.createdAt)}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400">Requested By</p>
                                    <p>{selectedFeedback.senderName}</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400">Responded By</p>
                                    <p>{selectedFeedback.receiverName || 'Unknown'}</p>
                                </div>
                                
                                {selectedFeedback.rating && (
                                    <div>
                                        <p className="text-gray-400">Rating</p>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar 
                                                    key={i} 
                                                    className={`text-xl ${i < (selectedFeedback.rating || 0) ? 'text-yellow-400' : 'text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-gray-400">Message</p>
                                    <div className="bg-[#2c2c2c] p-4 rounded">
                                        <p>{selectedFeedback.message}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => sendMailToSender(selectedFeedback.senderId)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                                >
                                    <FaEnvelope /> Email Sender
                                </button>
                                <button
                                    onClick={() => sendMailToReceiver(selectedFeedback.receiverId)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                                >
                                    <FaEnvelope /> Email Receiver
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}





// "use client"

// import managerApi from "@/app/api/manager"
// import { useEffect, useState } from "react"

// interface EmployeesFeedbacks {
//     _id: string;
//     senderId: string;
//     receiverId: string;
//     senderName: string;
//     receiverName: string;
//     ratind?: number;
//     message: string;
// }

// export default function ManagerDashBoard() {
//     const [department, setDepartment] = useState('')
//     const [employees, setEmployees] = useState<EmployeesFeedbacks[] | []>([])

//     useEffect(() => {
//         const dep = localStorage.getItem('department')
//         if (dep) {
//             setDepartment(dep)
            
//         }
//         const fetchData = async () => {
//                 const response = await managerApi.getEmployeesFeedback('development')
//                 console.log('manager get Emp: ', response)
//                 if (response) {
//                     setEmployees(response.data.result)
//                 }
//             }
//             fetchData()
//     }, [department])



//     return (
//         <>
//             <h1>Manager Dashboard</h1>
//         </>
//     )
// }
