"use client"

import employeeApi from "@/app/api/employee"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import isConstructiveFeedback from "@/lib/security/openAi"
import Swal from 'sweetalert2';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FeedbackRequest {
  _id: string
  createdAt: string
  deadline: string
  message: string
  receiverId: string
  receiverName: string
  senderId: string
  senderName?: string
  status: 'pending' | 'responded' | 'rejected' | 'expired'
  updatedAt: string
  feedbackResponse?: string
}

interface Form {
  _id: string
  title: string
  description: string
  fields: Array<{
    type: string
    label: string
    required: boolean
    anonymous: boolean
    options?: string[]
    min?: number
    max?: number
    step?: number
  }>
}

const statusColors = {
  pending: '#fbbf24',
  rejected: '#ef4444',
  expired: '#8b5cf6',
  responded: '#22c55e'
}

export default function Feedback() {
  const searchParams = useSearchParams()
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState<Form[]>([])
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequest | null>(null)
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [formResponses, setFormResponses] = useState<Record<string, any>>({})
  const [hoveredRating, setHoveredRating] = useState<Record<string, number>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const status = searchParams.get('status')

    const fetchData = async () => {
      try {
        const [feedbackResponse, formsResponse] = await Promise.all([
          employeeApi.getRequestedFeedbackData(String(status)),
          employeeApi.getAllForms()
        ])

        if (feedbackResponse.data.success && feedbackResponse.data.result) {
          setFeedbackRequests(feedbackResponse.data.result)
        }

        if (formsResponse.data.success && formsResponse.data.result) {
          setForms(formsResponse.data.result)
        }
      } catch (error: any) {
        console.log(error)
        if (error && error.response?.status === 401) {
          toast.warn(error.response?.data?.message)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams])

  const handleGiveFeedback = (request: FeedbackRequest) => {
    setSelectedRequest(request)
    setShowFormModal(true)
  }

  const handleFormSelect = (form: Form) => {
    setSelectedForm(form)
  }

  const handleRatingChange = (fieldId: string, value: number) => {
    setFormResponses(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormResponses(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmitFeedback = async () => {
    if (!selectedRequest || !selectedForm) return;

    // Separate text and rating responses
    const textResponses: Record<string, string> = {};
    const ratingResponses: Record<string, number> = {};

    selectedForm.fields.forEach((field, index) => {
      const fieldId = `${field.type}-${index}`;
      const response = formResponses[fieldId];

      if (field.type === 'rating' && typeof response === 'number') {
        ratingResponses[field.label] = response;
      } else if (typeof response === 'string') {
        textResponses[field.label] = response;
      }
    });

    const submissionData = {
      requestId: selectedRequest._id,
      formId: selectedForm._id,
      textResponses,
      ratingResponses,
      submittedAt: new Date().toISOString()
    };

    const message = Object.values(submissionData.textResponses)[0] || "";
    const rating = Object.values(submissionData.ratingResponses)[0] || 0;

    const data = {
      formId: selectedForm._id,
      requestedId: submissionData.requestId,
      rating: Number(rating),
      message: String(message)
    };


    // Check if feedback is constructive
    const isConstructive = await isConstructiveFeedback(message);

    if (!isConstructive) {
      const result = await Swal.fire({
        title: 'Feedback Quality Check',
        html: `Your feedback may not be polite or constructive. <br/><br/> 
             Do you want to update it before submitting?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, let me edit',
        cancelButtonText: 'No, submit anyway',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      });

      if (result.isConfirmed) {
        // User wants to edit - return without submitting
        return;
      }
      // If user clicks "No, submit anyway", continue to submission
    }

    try {
      const response = await employeeApi.submitFeedback(data)
      console.log('submited form: ', response)

      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: 'Feedback submitted successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setShowFormModal(false);
      setSelectedForm(null);
      setSelectedRequest(null);
      setFormResponses({});
    } catch (error: unknown) {
      console.log(error)
    }

  }

  const handleReject = async (id: string) => {
    try {
      const response = await employeeApi.rejectRequest(id)
      console.log('rejected ', response)
    } catch (error: any) {
      console.log(error)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Pagination logic
  const totalPages = Math.ceil(feedbackRequests.length / itemsPerPage)
  const currentItems = feedbackRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] p-10 text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] p-4 text-white">
      <div className="max-w-6xl mx-auto">
        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />
        <h1 className="text-2xl font-semibold mb-8 text-center">Feedback Requests</h1>

        {feedbackRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No feedback requests found
          </div>
        ) : (
          <>
            <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-[#2c2c2c]">
                  <tr>
                    <th className="p-3 text-left">From</th>
                    <th className="p-3 text-left">Requested On</th>
                    <th className="p-3 text-left">Deadline</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((request) => (
                    <tr key={request._id} className="border-b border-[#3a3a3a] hover:bg-[#2c2c2c]">
                      <td className="p-3">{request.senderName || 'Unknown'}</td>
                      <td className="p-3">{formatDate(request.createdAt)}</td>
                      <td className="p-3">{formatDate(request.deadline)}</td>
                      <td className="p-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs capitalize"
                          style={{ backgroundColor: `${statusColors[request.status]}20`, color: statusColors[request.status] }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleGiveFeedback(request)}
                              className="bg-white text-black py-1  rounded-lg hover:bg-gray-200 transition text-sm w-28"
                            >
                              Give Feedback
                            </button>
                            <button
                              className="bg-red-700 text-white py-1 px-3 rounded-lg hover:bg-red-800 transition text-sm w-28"
                              onClick={() => handleReject(request._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {
                          request.status === 'responded' &&
                          new Date().getTime() - new Date(request.createdAt).getTime() < 24 * 60 * 60 * 1000 && (
                            <button
                              className="bg-blue-400 text-white py-1 rounded-lg hover:bg-blue-500 transition text-sm w-28"
                            >
                              Edit
                            </button>
                          )
                        }

                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-[#2c2c2c] border border-[#3a3a3a] py-1 px-3 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-[#2c2c2c] border border-[#3a3a3a] py-1 px-3 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Form Selection Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Select Feedback Form</h2>
                  <button
                    onClick={() => {
                      setShowFormModal(false)
                      setSelectedForm(null)
                    }}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                {/* Request Details */}
                {selectedRequest && (
                  <div className="mb-6 bg-[#2c2c2c] p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Request Details:</h3>
                    <p className="text-sm text-gray-400">From: {selectedRequest.senderName || 'Unknown'}</p>
                    <p className="text-sm text-gray-400">Message: {selectedRequest.message}</p>
                    <p className="text-sm text-gray-400">Deadline: {formatDate(selectedRequest.deadline)}</p>
                  </div>
                )}

                {/* Form Selection */}
                <div className="space-y-3 mb-6">
                  {forms.map(form => (
                    <div
                      key={form._id}
                      onClick={() => handleFormSelect(form)}
                      className={`p-4 border rounded-lg cursor-pointer hover:border-[#fbbf24] transition ${selectedForm?._id === form._id ? 'border-[#fbbf24] bg-[#2c2c2c]' : 'border-[#3a3a3a]'}`}
                    >
                      <h3 className="font-medium">{form.title}</h3>
                      <p className="text-sm text-gray-400">{form.description}</p>
                    </div>
                  ))}
                </div>

                {/* Selected Form Preview */}
                {selectedForm && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Form Preview:</h3>
                    <div className="bg-[#2c2c2c] p-4 rounded-lg">
                      <h4 className="text-lg mb-2">{selectedForm.title}</h4>
                      <p className="text-sm text-gray-400 mb-4">{selectedForm.description}</p>

                      <div className="space-y-4">
                        {selectedForm.fields.map((field, index) => (
                          <div key={index} className="mb-3">
                            <label className="block text-gray-300 mb-1">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            {renderFieldPreview(field, index)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!selectedForm}
                  className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-600 disabled:text-gray-400"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )


  function renderFieldPreview(field: any, fieldIndex: number) {
    const fieldId = `${field.type}-${fieldIndex}`

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="w-full p-2 border border-[#3a3a3a] bg-[#1e1e1e] rounded text-white"
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
          />
        )
      case 'textarea':
        return (
          <textarea
            className="w-full p-2 border border-[#3a3a3a] bg-[#1e1e1e] rounded text-white"
            rows={3}
            onChange={(e) => handleFieldChange(fieldId, e.target.value)}
          />
        )
      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${star <= (hoveredRating[fieldId] || formResponses[fieldId] || 0) ? 'text-yellow-400' : 'text-gray-500'}`}
                onClick={() => handleRatingChange(fieldId, star)}
                onMouseEnter={() => setHoveredRating(prev => ({ ...prev, [fieldId]: star }))}
                onMouseLeave={() => setHoveredRating(prev => ({ ...prev, [fieldId]: 0 }))}
              >
                ★
              </button>
            ))}
          </div>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, i: number) => (
              <div key={i} className="flex items-center">
                <input type="radio" id={`${field.label}-${i}`} name={field.label} className="mr-2" />
                <label htmlFor={`${field.label}-${i}`} className="text-gray-300">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: string, i: number) => (
              <div key={i} className="flex items-center">
                <input type="checkbox" id={`${field.label}-${i}`} className="mr-2" />
                <label htmlFor={`${field.label}-${i}`} className="text-gray-300">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'select':
        return (
          <select className="w-full p-2 border border-[#3a3a3a] bg-[#1e1e1e] rounded text-white">
            <option value="">Select an option</option>
            {field.options?.map((option: string, i: number) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-2xl text-yellow-400">★</button>
            ))}
          </div>
        );
      case 'scale':
        return (
          <div className="flex items-center justify-between text-gray-300">
            <span>{field.min || 1}</span>
            <input
              type="range"
              min={field.min || 1}
              max={field.max || 5}
              step={field.step || 1}
              className="mx-2 flex-grow"
            />
            <span>{field.max || 5}</span>
          </div>
        );
      default:
        return null;
    }
  }

}

