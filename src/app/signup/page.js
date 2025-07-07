'use client';

import {
  FaRegEnvelope,
  FaPhone,
  FaGlobe,
  FaCity,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdLockOutline, MdPerson } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';

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
  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .notRequired(),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
});
// .required()
// .test(
//   'email-or-mobile',
//   'Either email or mobile number is required',
//   function (value) {
//     const { email, mobile } = value || {};
//     return Boolean(email || mobile);
//   }
// );

export default function SignUp() {
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
      // const res = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await res.json();

      // if (!res.ok) throw new Error(result.message || 'Failed to sign up');
      toast.success('Account created successfully!');
      reset();
    } catch (err) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Toaster position="top-right" />
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-500 mb-4">
          Create Account
        </h2>
        <div className="border-2 w-10 border-green-500 inline-block mb-6"></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-4"
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
            type="password"
            placeholder="Password"
            name="password"
            register={register}
            error={errors.password}
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
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <Link
            href="/signin"
            className="text-sm text-blue-500 hover:underline mt-5"
          >
            Back to Login
          </Link>
        </form>
      </div>
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
}) {
  return (
    <div className="w-full">
      <div className="bg-gray-100 w-full p-2 flex items-center rounded">
        <span className="text-gray-400 m-2">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          {...register(name)}
          className="bg-gray-100 outline-none text-sm flex-1"
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs text-left mt-1 ml-2">
          {error.message}
        </p>
      )}
    </div>
  );
}
