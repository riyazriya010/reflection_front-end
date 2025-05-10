import { EmployeeLoginCredentials } from "@/components/employee/Login";
import { EmployeeSignUpCredentials } from "@/components/employee/Signup";
import axiosInstance from "@/utils/axiosInstance";
import { EMPLOYEE_SERVICE } from "@/utils/constance";

const employeeApi = {
    signup: async (signupData: EmployeeSignUpCredentials): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/employee/signup`, signupData)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    login: async (loginData: EmployeeLoginCredentials): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/employee/login`, loginData)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    logout: async (): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/employee/logout`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getEmployees: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get(`${EMPLOYEE_SERVICE}/employee/get/details`)
            return response
        } catch (error: unknown) {
            throw error
        }
    }

}

export default employeeApi;
