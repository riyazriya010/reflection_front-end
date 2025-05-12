'use client'
import managerApi from '@/app/api/manager';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//Predefining the login credentials for typecheking the field
export interface ManagerLoginCredentials {
  email: string;
  password: string;
}

export default function ManagerLoginForm() {
  const router = useRouter()

  //useForm hook is used for handle the form data and errors
  const { register, handleSubmit, formState: { errors } } = useForm<ManagerLoginCredentials>()

  //This function were use to submit the form data to backend
  const loginFormSubmit: SubmitHandler<ManagerLoginCredentials> = async (data) => {
    try {
      const response = await managerApi.login(data)
      console.log('response ', response)
      if (response.data.success) {
        toast.success('Manager Logged')
        localStorage.setItem('username', response.data.result.username);
        localStorage.setItem('department', response.data.result.department);
        setTimeout(() => {
          router.replace('/pages/manager/dashboard')
        }, 2000)

      }
    } catch (error: any) {
      console.log(error)
      if (error && error.response?.status === 401) {
        toast.warn(error.response?.data?.message)
      }
      if (error && error.response?.status === 403) {
        toast.warn(error.response?.data?.message)
      }
      if (error && error.response?.status === 409) {
        toast.warn(error.response?.data?.message)
      }
      if (error && error.response?.status === 404) {
        toast.warn(error.response?.data?.message)
      }
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1D]">
      <div className="w-full max-w-md bg-[#16213E] rounded-2xl shadow-lg p-8 space-y-6">
        <ToastContainer
          autoClose={2000}
          pauseOnHover={false}
          transition={Slide}
          hideProgressBar={false}
          closeOnClick={false}
          pauseOnFocusLoss={true}
        />
        <h2 className="text-2xl font-bold text-white text-center">Manager Login</h2>

        <form onSubmit={handleSubmit(loginFormSubmit)} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Don't have an account?
          <a href="/pages/manager/signup" className="text-blue-400 hover:underline ml-1">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
