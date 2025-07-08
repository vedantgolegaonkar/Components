'use client';

import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Min 8 characters')
    .max(18, 'Max 18 characters')
    .matches(/[A-Z]/, 'Must include uppercase letter')
    .matches(/[a-z]/, 'Must include lowercase letter')
    .matches(/\d/, 'Must include number')
    .matches(/[!@#$%^&*()]/, 'Must include special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!token) {
      setValidToken(false);
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Reset failed');
      }

      toast.success('Password reset successful!');
      reset();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-10 rounded-2xl shadow-lg text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-500">
          Reset Password
        </h2>
        <div className="border-2 w-10 border-green-500 mx-auto mb-6" />

        {!validToken ? (
          <p className="text-red-500 text-sm sm:text-base">
            Invalid or missing token.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="text-left">
              <input
                type="password"
                placeholder="New Password"
                autoComplete="off"
                {...register('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="text-left">
              <input
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
                {...register('confirmPassword')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                loading || !isValid
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
