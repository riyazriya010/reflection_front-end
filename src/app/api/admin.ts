import { AdminLoginCredentials } from "@/components/admin/login"
import axiosInstance from "@/utils/axiosInstance"
import { ADMIN_SERVICE } from "@/utils/constance"

const adminApi = {

    login: async (data: AdminLoginCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${ADMIN_SERVICE}/login`, data)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    dynamicForm: async (form: any): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${ADMIN_SERVICE}/create/form`,form)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    logout: async (): Promise<any> => {
        try {
            const response = await axiosInstance.post(`${ADMIN_SERVICE}/logout`)
            return response
        } catch (error: unknown) {
            throw error
        }
    }
}

export default adminApi;
