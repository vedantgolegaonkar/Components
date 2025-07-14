'use client';
// Imports
import { useState, useEffect } from 'react';
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
  signUpSubTitle,
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
    is: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
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
  otp: yup.string().when(['identifier'], {
    is: (val) => /^\d{10}$/.test(val),
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

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
      const loginType = isEmail ? 'email' : 'mobile';
      const payload = {
        ...data,
        login_type: loginType, 
      };

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

  const otpSubmit = () => {
    if (isMobile) {
      toast.success('OTP sent to your mobile', { duration: 3000 });
      setIsOtpSent(true);
      setCanResend(false);
      setTimer(60);
    }
  };

  useEffect(() => {
    let countdown;

    if (isOtpSent && !canResend) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isOtpSent, canResend]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[linear-gradient(to_right,_#0A6586,_#1B93B4,_#0D81A1,_#0DB1F2)] py-4 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/background.jpg')",
          opacity: 1,
        }}
      ></div> */}
      <Toaster position="top-right" reverseOrder={false} />
      <main className="flex flex-col items-center justify-center w-full text-center">
        <div
          className={`bg-white rounded-4xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {/* Left Section (Form) */}
          <div className="w-full md:w-3/5 p-6 sm:p-10 lg:p-14">
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-red-500 text-2xl transform transition-transform duration-200 hover:scale-125"
                aria-label="Close"
              >
                <IoMdClose />
              </button>
            </div>

            <div className="text-center font-bold text-xl sm:text-2xl mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8]">
                {companyName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8] mb-2">
              {signIn}
            </h2>

            <div className="border-2 w-10 border-[#1BEBC8] inline-block mb-4"></div>

            <div className="flex justify-center my-2">
              {[FaFacebookF, FaLinkedinIn, FaGoogle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="border-2 border-gray-200 rounded-full p-3 mx-1"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>

            <p className="text-gray-400 my-3 text-sm">{useEmail}</p>

            <div className="flex flex-col items-center">
              {/* Identifier */}
              <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
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

              {/* Password */}
              {isEmail && (
                <div className="w-full sm:w-64">
                  <div className="bg-gray-100 p-2 flex items-center relative mb-3">
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

              {/* OTP Input + Resend Timer */}
              {isMobile && isOtpSent && (
                <div className="w-full sm:w-64">
                  <div className="bg-gray-100 p-2 flex items-center relative mb-3">
                    <MdLockOutline className="text-gray-400 mr-2" />
                    <input
                      type="password"
                      placeholder="Enter 6-digit OTP"
                      {...register('otp')}
                      className="bg-gray-100 outline-none text-sm flex-1 pr-8"
                      autoComplete="off"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.otp.message}
                    </p>
                  )}

                  <div className="text-sm mt-5 text-gray-500">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={otpSubmit}
                        className="text-blue-600 hover:underline"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span>Resend available in {timer}s</span>
                    )}
                  </div>
                </div>
              )}

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between w-full sm:w-64 mb-5 mt-8 text-sm">
                <label className="flex items-center">
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

              {/* Terms */}
              <div className="w-full sm:w-64 text-sm text-gray-500 mb-4">
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

              {/* Buttons */}
              {isMobile && !isOtpSent ? (
                <button
                  onClick={otpSubmit}
                  type="button"
                  disabled={identifier.length !== 10}
                  className={`border-2 ${
                    identifier.length === 10
                      ? 'border-[#1BEBC8] text-[#1BEBC8] hover:bg-[#1BEBC8] hover:text-white'
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  } rounded-full px-12 py-2 inline-block font-semibold transition-colors duration-300`}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`border-2 ${
                    isValid
                      ? 'border-[#1BEBC8] text-[#1BEBC8] hover:bg-[#1BEBC8] hover:text-white'
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  } rounded-full px-12 py-2 inline-block font-semibold transition-colors duration-300`}
                >
                  {isSubmitting ? 'Loading...' : 'Sign In'}
                </button>
              )}
            </div>
          </div>

          {/* Right Section (SignUp Panel) – Hidden on small screens */}
          <div className="hidden md:flex w-2/5 bg-[#90DAFF] text-[#0A6586] rounded-tr-4xl rounded-br-4xl py-24 px-8 shadow-2xl flex-col items-center justify-center text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {signUpTitle}
            </h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10 text-sm sm:text-base">{signUpSubTitle}</p>
            <Link
              href="/signup"
              className="border-2 border-white rounded-full px-10 py-2 inline-block hover:bg-white hover:text-[#1BEBC8] font-semibold"
            >
              {signUpButton}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
