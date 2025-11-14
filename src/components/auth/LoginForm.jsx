// src/components/auth/LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FcGoogle } from "react-icons/fc";

const LoginForm = ({ onToggleForm }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    try {
      setError("");
      setLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      setError("Failed to log in with Google.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In to Your Wardrobe</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          {...register("email", { 
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password", { 
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          error={errors.password?.message}
        />
        
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-4 flex items-center justify-center"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle className="mr-2 text-xl" />
          Google
        </Button>
      </div>
      
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          className="font-medium text-indigo-600 hover:text-indigo-500"
          onClick={onToggleForm}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;