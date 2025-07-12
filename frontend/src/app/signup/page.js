'use client';

// imports
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
import {accountCreate, companyName, loginButton, signing, signInTitle, subTitle} from '../constants/signup'
import { policy, terms } from '../constants/signin';

const schema = yup
  .object()
  .shape({
    fullName: yup.string().required('Full name is required'),
    email: yup
      .string()
      .email('Invalid email')
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value,
      ),
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
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
    mobile: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Invalid mobile number')
      .nullable()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value,
      ),
    country: yup.string().required('Country is required'),
    state: yup.string().required('State is required'),
    city: yup.string().required('City is required'),
  })
  .test(
    'email-or-mobile-required',
    'Either Email or Mobile number is required',
    function (value) {
      const { email, mobile } = value;
      return !!(email || mobile);
    },
  );

export default function SignUp() {

  // constants
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
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

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
  <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-[linear-gradient(to_right,_#0A6586,_#1B93B4,_#0D81A1,_#0DB1F2)] overflow-hidden">
    <Toaster position="top-right" />
    <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-8 md:px-12 lg:px-20 text-center">
      <div
        className={`bg-white rounded-4xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {/* Left Form Section */}
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
            {accountCreate}
          </h2>

          <div className="border-2 w-10 border-[#1BEBC8] inline-block mb-4"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center space-y-2"
          >
            <InputField
                  icon={<MdPerson />}
                  placeholder="Full Name"
                  name="fullName"
                  register={register}
                  error={errors.fullName}
                  required={true}
                />
                <InputField
                  icon={<FaRegEnvelope />}
                  placeholder="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                  required={true}
                />
                <p className="pt-3">Or</p>
                <InputField
                  icon={<FaPhone />}
                  placeholder="Mobile Number"
                  name="mobile"
                  register={register}
                  error={errors.mobile}
                  required={true}
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
                  required={true}
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
                  required={true}
                />
                {confirmPassword && !errors.confirmPassword && (
                  <p
                    className={`text-sm mt-1 ml-1 ${
                      passwordsMatch ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {passwordsMatch
                      ? '✓ Passwords match'
                      : '✗ Passwords do not match'}
                  </p>
                )}

                <InputField
                  icon={<FaGlobe />}
                  placeholder="Country"
                  name="country"
                  register={register}
                  error={errors.country}
                  required={true}
                />
                <InputField
                  icon={<FaMapMarkerAlt />}
                  placeholder="State"
                  name="state"
                  register={register}
                  error={errors.state}
                  required={true}
                />
                <InputField
                  icon={<FaCity />}
                  placeholder="City"
                  name="city"
                  register={register}
                  error={errors.city}
                  required={true}
                />
            <div className="w-full sm:w-64 text-sm text-gray-500 mb-4 mt-5">
              {signing}{' '}
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
              type="submit"
              disabled={!isValid || loading}
              className={`mt-4 w-full sm:w-64 py-2 rounded-full font-semibold transition-colors duration-300 ${
                loading || !isValid
                  ? 'bg-gray-300 text-white cursor-not-allowed'
                  : 'bg-[#1BEBC8] text-white hover:bg-[#17c6ad]'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Right Panel - Hidden on small screens */}
        <div className="hidden md:flex w-full md:w-2/5 bg-[#90DAFF] text-[#0A6586] rounded-b-4xl md:rounded-bl-none md:rounded-tr-4xl md:rounded-br-4xl py-24 px-8 shadow-2xl flex-col items-center justify-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{signInTitle}</h2>
          <div className="border-2 w-10 border-white inline-block mb-2"></div>
          <p className="mb-10 text-sm sm:text-base">{subTitle}</p>
          <Link
            href="/signin"
            className="border-2 border-white rounded-full px-10 py-2 inline-block hover:bg-white hover:text-[#1BEBC8] font-semibold transition"
          >
            {loginButton}
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
  required = false,
}) {
  return (
    <div className="w-full relative">
      <label className="block text-left text-sm font-medium text-gray-700 mb-1 ml-1">
        {placeholder} {required && <span className="text-red-500">*</span>}
      </label>
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




