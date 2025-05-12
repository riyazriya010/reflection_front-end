import { ManagerLoginCredentials } from "@/components/manager/login";
import { ManagerSignUpCredentials } from "@/components/manager/signup";
import axiosInstance from "@/utils/axiosInstance";
import { MANAGER_SERVICE } from "@/utils/constance";

const managerApi = {
    signup: async (signupData: ManagerSignUpCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${MANAGER_SERVICE}/signup`, signupData)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    login: async (loginData: ManagerLoginCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${MANAGER_SERVICE}/login`, loginData)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    logout: async (): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${MANAGER_SERVICE}/logout`)
            return response
        } catch (error: unknown) {
            throw error
        }
    },

    getEmployeesFeedback: async (department: string): Promise<any> => {
        try{
            const response = await axiosInstance.get(`${MANAGER_SERVICE}/get/employees/feedbacks?department=${department}`)
            return response
        }catch(error: unknown){
            throw error
        }
    }
}

export default managerApi;
