import { ManagerLoginCredentials } from "@/components/manager/login";
import { ManagerSignUpCredentials } from "@/components/manager/signup";
import axiosInstance from "@/utils/axiosInstance";
import { MANAGER_SERVICE } from "@/utils/constance";

const managerApi = {
    signup: async (signupData: ManagerSignUpCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${MANAGER_SERVICE}/manager/signup`, signupData)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    login: async (loginData: ManagerLoginCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${MANAGER_SERVICE}/manager/login`, loginData)
            return response
        }catch(error: unknown){
            throw error
        }
    }
}

export default managerApi;
