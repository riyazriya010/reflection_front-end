import { EmployeeLoginCredentials } from "@/components/employee/Login";
import { EmployeeSignUpCredentials } from "@/components/employee/Signup";
import axiosInstance from "@/utils/axiosInstance";
import { EMPLOYEE_SERVICE } from "@/utils/constance";

const employeeApi = {
    signup: async (signupData: EmployeeSignUpCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/signup`, signupData)
            return response
        }catch(error: unknown){
            throw error
        }
    },

    login: async (loginData: EmployeeLoginCredentials): Promise<any> => {
        try{
            const response = await axiosInstance.post(`${EMPLOYEE_SERVICE}/login`, loginData)
            return response
        }catch(error: unknown){
            throw error
        }
    }
}

export default employeeApi;
