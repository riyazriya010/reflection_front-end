import { EmployeeLoginCredentials } from "@/components/employee/Login";
import { EmployeeSignUpCredentials } from "@/components/employee/Signup";
import axiosInstance from "@/utils/axiosInstance";
import { EMPLOYEE_SERVICE } from "@/utils/constance";

const employeeApi = {
    signup: async (signupData: EmployeeSignUpCredentials): Promise<any> => {

        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/signup`, signupData)

            return response
        } catch (error: unknown) {
            throw error
        }
    },

    login: async (loginData: EmployeeLoginCredentials): Promise<any> => {

        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/login`, loginData)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    logout: async (): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/logout`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getEmployees: async (): Promise<any> => {
        try {
            console.log('EMP SERV ', EMPLOYEE_SERVICE)
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/details`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    requestFeedback: async (peerId: string, message: string, deadline: any): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/send/request`, { peerId, message, deadline })
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    requestedFeedback: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/requestedFeedback`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    // This is for get Requested of others to me
    getRequestedFeedbackData: async (status?: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/others/requested?status=${status}`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getAllRquestGot: async (): Promise<any> => {
        try{
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/others-all/requested`)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    getAllForms: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/allforms`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    submitFeedback: async (data: any): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/submit/feedback`, data)
            return response
        } catch (error: unknown) {
            throw error
        }
    },


    rejectRequest: async (id: string): Promise<any> => {
        try{
            const response = await axiosInstance.patch(`${EMPLOYEE_SERVICE}/reject/request?id=${id}`)
            return response
        }catch(error: unknown) {
            throw error
        }
    },

    getMyRequeste: async (id: string): Promise<any> => {
        try{
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/my/requeste?id=${id}`)
            return response
        }catch(error: unknown){
            throw error
        }
    },


    getFeedbackMessages: async (): Promise<any> => {
        try{
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/get/feedback/messages`)
            return response
        }catch(error: unknown){
            throw error
        }
    }

}

export default employeeApi;
