'use client';
// Imports
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
import { MdLockOutline } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaRegEnvelope,
} from 'react-icons/fa';
import {
  companyName,
  forgotPassword,
  logging,
  policy,
  remember,
  signIn,
  signUpButton,
  signUpTitle,
  terms,
  useEmail,
} from '../constants/signin';


// Define a Yup validation schema for the sign-in form
const schema = yup.object().shape({
  identifier: yup
    .string()
    .required('Email or Mobile Number is required')
    .test(
      'is-valid',
      'Must be a valid email or 10-digit mobile number',
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^\d{10}$/;
        return emailRegex.test(value) || mobileRegex.test(value);
      },
    ),
  password: yup.string().when('identifier', {
    is: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), // If it's an email
    then: (schema) =>
      schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(18, 'Password must be at most 18 characters')
        .matches(/[A-Z]/, 'Must contain an uppercase letter')
        .matches(/[a-z]/, 'Must contain a lowercase letter')
        .matches(/\d/, 'Must contain a number')
        .matches(
          /[!@#$%^&*()]/,
          'Must contain a special character (!@#$%^&*())',
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  otp: yup.string().when('identifier', {
    is: (val) => /^\d{10}$/.test(val), // If it's a mobile number
    then: (schema) =>
      schema
        .required('OTP is required')
        .matches(/^\d{6}$/, 'OTP must be a 6-digit number'),
    otherwise: (schema) => schema.notRequired(),
  }),
});



export default function Home() {

  // Constants
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // enables real-time validation
  });

  
  const identifier = watch('identifier');
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier || '');
  const isMobile = /^\d{10}$/.test(identifier || '');

  const onSubmit = async (data) => {
    try {
      await new Promise((r) => setTimeout(r, 1000));
      // const res = await fetch('/api/signin', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await res.json();

      // if (!res.ok) throw new Error(result.message || 'Failed to sign up');
      reset();
      router.push('/dashboard');
      toast.success('Login Successful', { duration: 3000 });
    } catch (error) {
      toast.error('Something went wrong!', { duration: 3000 });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => router.push('/'), 100);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200 overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div
          className={`bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl transform transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          <div className="w-3/5 p-5">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-red-500 text-2xl transform transition-transform duration-200 hover:scale-125"
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="text-left font-bold text-xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8]">
                {companyName}
              </span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8] mb-2">
                {signIn}
              </h2>
              <div className="border-2 w-10 border-[#1BEBC8] inline-block mb-2"></div>
              <div className="flex justify-center my-2">
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
                <a
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <FaGoogle className="text-sm" />
                </a>
              </div>
              <p className="text-gray-400 my-3">{useEmail}</p>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    type="text"
                    placeholder="Email or Mobile Number"
                    name="identifier"
                    autoComplete="off"
                    {...register('identifier')}
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.identifier.message}
                  </p>
                )}

                {isEmail && (
                  <div>
                    <div className="bg-gray-100 w-64 p-2 flex items-center relative mb-3">
                      <MdLockOutline className="text-gray-400 mr-2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        {...register('password')}
                        className="bg-gray-100 outline-none text-sm flex-1 pr-8"
                        autoComplete="off"
                      />
                      <div
                        className="absolute right-2 cursor-pointer text-gray-400"
                        onClick={togglePassword}
                      >
                        {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}

                {isMobile && (
                  <div>
                    <div className="bg-gray-100 w-64 p-2 flex items-center relative mb-3">
                      <MdLockOutline className="text-gray-400 mr-2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter 6-digit OTP"
                        {...register('otp')}
                        className="bg-gray-100 outline-none text-sm flex-1 pr-8"
                        autoComplete="off"
                      />
                      <div
                        className="absolute right-2 cursor-pointer text-gray-400"
                        onClick={togglePassword}
                      >
                        {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
                      </div>
                    </div>
                    {errors.otp && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.otp.message}
                      </p>
                    )}
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.password.message}
                  </p>
                )}
                <div className="flex justify-between w-64 mb-5 mt-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-1" name="remember" />
                    {remember}
                  </label>
                  <Link
                    href="/forget-password"
                    className="text-sm hover:underline"
                  >
                    {forgotPassword}
                  </Link>
                </div>
                <div className="w-64 text-sm text-gray-500 mb-4">
                  {logging}{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#01304C] hover:underline"
                  >
                    {terms}
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#01304C] hover:underline"
                  >
                    {policy}
                  </Link>
                  .
                </div>

                <button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`border-2 ${
                    isValid
                      ? 'border-[#1BEBC8] text-[#1BEBC8] hover:bg-[#1BEBC8] hover:text-white'
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  } rounded-full px-12 py-2 inline-block font-semibold transition-colors duration-300`}
                >
                  {isSubmitting ? 'Loading...' : 'Sign In'}
                </button>
              </div>
            </div>
          </div>
          <div className="w-2/5 bg-gradient-to-r from-[#01304C] to-[#1BEBC8] text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Create. Learn. Succeed.</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">{signUpTitle}</p>
            <Link
              href="/signup"
              className="border-2 border-white rounded-full px-12 py-2 inline-block hover:bg-white hover:text-[#1BEBC8] font-semibold"
            >
              {signUpButton}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
