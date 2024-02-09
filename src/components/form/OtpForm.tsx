"use client";

import { baseUrl } from "@/Utils/PortDetails";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const OtpForm = () => {
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to verify the OTP
    axios
      .post(`${baseUrl}/auth/registerUser`, { otp })
      .then((res) => {
        if (res.status === 201) {
          console.log("User created");
          router.replace("/sign-in");
        } else {
          console.log("User not created from the otp page");
          throw new Error("User not created");
        }
      })
      .catch((err) => {
        console.log(err);
        alert('otp is not valid')
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-gray-700">Enter OTP</h1>
      <form onSubmit={handleSubmit} className="w-64">
        <label className="block mb-4">
          <span className="text-gray-700">OTP:</span>
          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
