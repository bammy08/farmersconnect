/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSeller } from '@/services/auth/registerSeller';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Define validation schema
const schema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function RegisterSellerForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await registerSeller(data.name, data.email, data.password);
      toast.success(res.message); // Success Toast
    } catch (err) {
      toast.error('Registration failed, please try again'); // Error Toast
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-white text-gray-600 rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-600 mb-2">Welcome</h1>
          <p className="text-slate-600">Register your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Name</label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                type="text"
                placeholder="Full Name"
                {...register('name')}
                className={cn(
                  'pl-10 bg-white/5 border-black/20 text-gray-600',
                  errors.name && 'border-red-500/50'
                )}
              />
            </div>
            {errors.name?.message && (
              <p className="text-red-400 text-sm">
                {String(errors.name.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={cn(
                  'pl-10 bg-white/5 border-black/20 text-gray-600',
                  errors.email && 'border-red-500/50'
                )}
              />
            </div>
            {errors.email?.message && (
              <p className="text-red-400 text-sm">
                {String(errors.email.message)}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className={cn(
                  'pl-10 bg-white/5 border-black/20 text-gray-600',
                  errors.password && 'border-red-500/50'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-red-400 text-sm">
                {String(errors.password.message)}
              </p>
            )}
          </div>

          {/* Forgot Password */}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white rounded-lg py-6 text-base font-medium transition-all"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up as Seller'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          {/* Registration Link */}
          <div className="text-center text-slate-600 text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-gray-600 hover:text-green-500 transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Social Login Divider */}
          {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-slate-300">
              Or continue with
            </span>
          </div>
        </div> */}

          {/* Social Login */}
          {/* <Button
          variant="outline"
          className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.835 0 3.456.705 4.691 1.942l3.149-3.104A10.113 10.113 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a9.96 9.96 0 00-1.676-5.553l-4.829 4.729z"
            />
          </svg>
          Google
        </Button> */}
        </form>
      </div>
    </div>
  );
}
