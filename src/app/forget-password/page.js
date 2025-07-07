'use client';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      toast.success('If your account exists, a reset link has been sent.');
      reset();
    } catch (error) {
      toast.error('Something went wrong. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-10 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-500">
          Forgot Password
        </h2>
        <div className="border-2 w-10 border-green-500 mx-auto mb-4" />
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Enter your registered email and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-left">
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              {...register('email')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${
              loading || !isValid
                ? 'bg-gray-300 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <Link href="/signin" className="block text-sm text-blue-500 hover:underline mt-3">
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
