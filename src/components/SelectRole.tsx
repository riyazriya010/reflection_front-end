"use client"
import { useRouter } from 'next/navigation'

export default function RoleSelection() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to Tallect Reflection</h1>
        <p className="text-xl text-gray-400">Please select your role to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Employee Card */}
        <div 
          className={`bg-[#1e1e1e] border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:border-blue-500 border-blue-500`}
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#2c2c2c] p-6 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Employee</h2>
            <p className="text-gray-400 text-center">
              Access your personal dashboard, submit feedback, and view your performance metrics.
            </p>
            <button 
              className={`mt-6 px-6 py-2 text-white rounded-lg transition-colors bg-blue-600 text-white'}`}
              onClick={() => router.push('/pages/employee/login')}
            >
              Select as Employee
            </button>
          </div>
        </div>

        {/* Manager Card */}
        <div 
          className={'bg-[#1e1e1e] border-2 rounded-xl p-8 cursor-pointer transition-all duration-300 hover:border-purple-500 border-purple-500'}
        >
          <div className="flex flex-col items-center">
            <div className="bg-[#2c2c2c] p-6 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Manager</h2>
            <p className="text-gray-400 text-center">
              Access team analytics, review feedback, and manage employee performance.
            </p>
            <button 
              className={`mt-6 px-6 py-2 rounded-lg transition-colors bg-purple-600 text-white`}
              onClick={() => router.push('/pages/manager/login')}
            >
              Select as Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}