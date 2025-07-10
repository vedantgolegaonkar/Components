'use client';

import {
  FaFacebookF,
  FaLinkedinIn,
  FaGoogle,
  FaRegEnvelope,
} from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import loginSVG from '../../../public/login-svg.svg'
// import Image from 'next/image';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(18, 'Password must be at most 18 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/\d/, 'Must contain a number')
    .matches(/[!@#$%^&*()]/, 'Must contain a special character (!@#$%^&*())'),
});

export default function Home() {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // enables real-time validation
  });

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
      toast.success('Login Successful', { duration: 3000 }); // mock response
    } catch (error) {
      toast.error('Something went wrong!', { duration: 3000 });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => router.push('/'),100);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200 overflow-hidden">
      {/* <Image src={loginSVG} alt='Login' className="absolute top-[200px] left-[80px] w-130 h-130 z-0 opacity-100 pointer-events-none" priority/> */}
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8]">APSN Skilling LLP</span>
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8] mb-2">
                Sign in to Account
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
              <p className="text-gray-400 my-3">or use your email account</p>
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 m-2" />
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    name="email"
                    autoComplete="off"
                    {...register('email')}
                    className="bg-gray-100 outline-none text-sm flex-1"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.email.message}
                  </p>
                )}
                <div className="bg-gray-100 w-64 p-2 flex items-center relative">
                  <MdLockOutline className="text-gray-400 m-2" />
                  <input
                    type={showPassword ? "text": "password"}
                    placeholder="Enter your Password"
                    name="password"
                    autoComplete="off"
                    {...register('password')}
                    className="bg-gray-100 outline-none text-sm flex-1 pr-8"
                  />
                  <div className='absolute right-2 cursor-pointer text-gray-400' onClick={togglePassword}>
                    {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-2">
                    {errors.password.message}
                  </p>
                )}
                <div className="flex justify-between w-64 mb-5 mt-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-1" name="remember" />
                    Remember Me
                  </label>
                  <Link
                    href="/forget-password"
                    className="text-sm hover:underline"
                  >
                    Forgot Password
                  </Link>
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
            <p className="mb-10">
              We&apos;re excited to walk this journey with you!
            </p>
            <Link
              href="/signup"
              className="border-2 border-white rounded-full px-12 py-2 inline-block hover:bg-white hover:text-[#1BEBC8] font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
