'use client';

import {
  FaRegEnvelope,
  FaPhone,
  FaGlobe,
  FaCity,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdLockOutline, MdPerson } from 'react-icons/md';
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').notRequired(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Min 8 characters')
    .max(18, 'Max 18 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/\d/, 'Must contain a number')
    .matches(/[!@#$%^&*()]/, 'Must contain special character'),
  confirmPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Min 8 characters')
    .max(18, 'Max 18 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[a-z]/, 'Must contain lowercase letter')
    .matches(/\d/, 'Must contain a number')
    .matches(/[!@#$%^&*()]/, 'Must contain special character'),
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .notRequired(),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
});

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.success('Account created successfully!');
      reset();
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => router.push('/'), 100);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-gray-200 overflow-hidden">
      <Toaster position="top-right" />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div
          className={`bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl transform transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {/* Left Side - Form */}
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
                APSN Skilling LLP
              </span>
            </div>
            <div className="py-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8] mb-2">
                Create Your Account
              </h2>
              <div className="border-2 w-10 border-[#1BEBC8] inline-block mb-4"></div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center space-y-3"
              >
                <InputField
                  icon={<MdPerson />}
                  placeholder="Full Name"
                  name="fullName"
                  register={register}
                  error={errors.fullName}
                />
                <InputField
                  icon={<FaRegEnvelope />}
                  placeholder="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                />
                <InputField
                  icon={<MdLockOutline />}
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
                  isPassword={true}
                  show={showPassword}
                  toggleShow={() => setShowPassword((prev) => !prev)}
                />
                <InputField
                  icon={<MdLockOutline />}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  register={register}
                  error={errors.confirmPassword}
                  isPassword={true}
                  show={showConfirmPassword}
                  toggleShow={() => setShowConfirmPassword((prev) => !prev)}
                />
                <InputField
                  icon={<FaPhone />}
                  placeholder="Mobile Number"
                  name="mobile"
                  register={register}
                  error={errors.mobile}
                />
                <InputField
                  icon={<FaGlobe />}
                  placeholder="Country"
                  name="country"
                  register={register}
                  error={errors.country}
                />
                <InputField
                  icon={<FaMapMarkerAlt />}
                  placeholder="State"
                  name="state"
                  register={register}
                  error={errors.state}
                />
                <InputField
                  icon={<FaCity />}
                  placeholder="City"
                  name="city"
                  register={register}
                  error={errors.city}
                />

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className={`mt-4 w-full py-2 rounded-full font-semibold transition-colors duration-300 ${
                    loading || !isValid
                      ? 'bg-gray-300 text-white cursor-not-allowed'
                      : 'bg-[#1BEBC8] text-white hover:bg-[#17c6ad]'
                  }`}
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
                {/* <Link
                  href="/signin"
                  className="text-sm text-blue-500 hover:underline mt-4"
                >
                  Already have an account? Login
                </Link> */}
              </form>
            </div>
          </div>

          {/* Right Side - Welcome Message */}
          <div className="w-2/5 bg-gradient-to-r from-[#01304C] to-[#1BEBC8] text-white rounded-tr-2xl rounded-br-2xl py-36 px-10 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-2">Good to See You!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              Let&apos;s keep building your future, one step at a time.
            </p>
            <Link
              href="/signin"
              className="border-2 border-white rounded-full px-12 py-2 inline-block hover:bg-white hover:text-[#1BEBC8] font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  name,
  type = 'text',
  register,
  error,
  isPassword = false,
  show,
  toggleShow,
}) {
  return (
    <div className="w-full relative">
      <div className="bg-gray-100 w-full p-2 pl-3 pr-10 flex items-center rounded">
        <span className="text-gray-400 mr-2">{icon}</span>
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete="off"
          {...register(name)}
          className="bg-gray-100 outline-none text-sm flex-1"
        />
        {isPassword && (
          <div
            className="absolute right-3 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={toggleShow}
          >
            {show ? <RiEyeLine /> : <RiEyeCloseLine />}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs text-left mt-1 ml-2">
          {error.message}
        </p>
      )}
    </div>
  );
}
