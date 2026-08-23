"use client";
import React from 'react'
import { useState } from "react";

function page() {
      const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    regNo: "",
    hall: "",
    faculty: "",
    reason: "",
    hos: "",
    ward: "",
    telephone: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);

    alert("Transfer details saved successfully!");
  };
    
  return (
     <div className="min-h-screen bg-[#F7F9FC] px-4 py-10 md:px-8">

      {/* Main Container */}
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#991B1B] md:text-5xl">
            Transfer
          </h1>

          <p className="mt-3 text-base text-[#6B7280]">
            Enter the student transfer details below
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.08)] md:p-10">

          <form onSubmit={handleSubmit}>

            {/* Date & Time */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-[#374151]"
                >
                  Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#374151] outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                />
              </div>

              {/* Time */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium text-[#374151]"
                >
                  Time
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 text-[#374151] outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                />
              </div>

            </div>

            {/* Student Information */}
            <div className="mb-8">

              <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-semibold text-[#374151]">
                Student Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter student's full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Registration Number */}
                <div>
                  <label
                    htmlFor="regNo"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Registration Number
                  </label>

                  <input
                    id="regNo"
                    name="regNo"
                    type="text"
                    placeholder="Enter registration number"
                    value={formData.regNo}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 uppercase outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Hall */}
                <div>
                  <label
                    htmlFor="hall"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Hall
                  </label>

                  <input
                    id="hall"
                    name="hall"
                    type="text"
                    placeholder="Enter hall name"
                    value={formData.hall}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Faculty */}
                <div>
                  <label
                    htmlFor="faculty"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Faculty
                  </label>

                  <input
                    id="faculty"
                    name="faculty"
                    type="text"
                    placeholder="Enter faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

              </div>
            </div>

            {/* Transfer Information */}
            <div className="mb-8">

              <h2 className="mb-5 border-b border-gray-200 pb-3 text-xl font-semibold text-[#374151]">
                Transfer Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* Reason */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="reason"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Reason
                  </label>

                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    placeholder="Enter reason for transfer"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* HOS */}
                <div>
                  <label
                    htmlFor="hos"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    HOS
                  </label>

                  <input
                    id="hos"
                    name="hos"
                    type="text"
                    placeholder="Enter HOS"
                    value={formData.hos}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Ward */}
                <div>
                  <label
                    htmlFor="ward"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Ward
                  </label>

                  <input
                    id="ward"
                    name="ward"
                    type="text"
                    placeholder="Enter ward"
                    value={formData.ward}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Telephone */}
                <div>
                  <label
                    htmlFor="telephone"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Telephone Number
                  </label>

                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    placeholder="Enter telephone number"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label
                    htmlFor="remarks"
                    className="mb-2 block text-sm font-medium text-[#374151]"
                  >
                    Remarks
                  </label>

                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={3}
                    placeholder="Additional remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-[#F9FAFB] px-4 py-3 outline-none transition focus:border-[#B91C1C] focus:ring-2 focus:ring-red-100"
                  />
                </div>

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-4 border-t border-gray-200 pt-7 sm:flex-row sm:justify-end">

              <button
                type="reset"
                onClick={() =>
                  setFormData({
                    date: "",
                    time: "",
                    name: "",
                    regNo: "",
                    hall: "",
                    faculty: "",
                    reason: "",
                    hos: "",
                    ward: "",
                    telephone: "",
                    remarks: "",
                  })
                }
                className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-medium text-[#4B5563] transition hover:bg-gray-50"
              >
                Clear
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#3B82C4] px-8 py-3 font-semibold text-white shadow-[0_5px_0_#2563A6,0_10px_20px_rgba(59,130,196,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_7px_0_#2563A6,0_14px_25px_rgba(59,130,196,0.28)] active:translate-y-0"
              >
                Save Transfer
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default page
