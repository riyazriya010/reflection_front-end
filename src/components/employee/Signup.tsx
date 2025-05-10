'use client'
import employeeApi from '@/app/api/employee';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'


//Predefining the Signup credentials for typecheking the field
export interface EmployeeSignUpCredentials {
    username: string;
    phone: number;
    email: string;
    password: string;
    confirmPassword?: string
}

export default function EmployeeSignUpForm() {
    const router = useRouter()

    //useForm hook is used for handle the form data and errors
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<EmployeeSignUpCredentials>()

    //This function were use to submit the form data to backend
    const signUpFormSubmit: SubmitHandler<EmployeeSignUpCredentials> = async (data) => {
        try {
            const response = await employeeApi.signup(data)
            console.log('response ', response)
            if(response.data.success){
                router.replace('/pages/employee/dashboard')
            }
        } catch (error: unknown) {
            console.log(error)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1D]">
            <div className="w-full max-w-md bg-[#16213E] rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">Employee SignUp</h2>

                <form onSubmit={handleSubmit(signUpFormSubmit)} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-1">Enter your name</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 rounded-md bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            {...register("username", {
                                required: "Username is required",
                                pattern: {
                                    value: /^[A-Za-z][A-Za-z0-9]*(?:\s[A-Za-z][A-Za-z0-9]*)*$/,
                                    message: "User Name must start with a letter and contain only single spaces",
                                },
                            })}
                        />
                        <p className="text-red-600">{errors.username?.message}</p>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 rounded-md bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address",
                                }
                            })}
                        />
                        <p className="text-red-600">{errors.email?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-1">Enter your phone number</label>
                        <input
                            type="text"
                            id="phone"
                            className="w-full px-4 py-2 rounded-md bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid phone number (10 digits)",
                                },
                            })}
                        />
                        <p className="text-red-600">{errors.phone?.message}</p>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 rounded-md bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                pattern: {
                                    value:
                                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                                    message:
                                        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
                                },
                            })}
                        />
                        <p className="text-red-600">{errors.password?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-1">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 rounded-md bg-[#334155] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            {...register("confirmPassword", {
                                validate: (value) => {
                                    const { password } = getValues();
                                    return password === value || "Passwords should match!";
                                },
                            })}
                        />
                        <p className="text-red-600">{errors.confirmPassword?.message}</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Signup
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Already have an account?
                    <a href="/" className="text-blue-400 hover:underline ml-1">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
