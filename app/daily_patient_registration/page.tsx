"use client";
import React from 'react'
import { useState } from "react";

function page()  {
  const [formData, setFormData] = useState({
    no: "",
    name: "",
    fileNo: "",
    age: "",
    sex: "",
    hall: "",
    department: "",
    diagnosis: "",
    first: "",
    subs: "",
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

    alert("Patient details saved successfully!");
  };

  const handleClear = () => {
    setFormData({
      no: "",
      name: "",
      fileNo: "",
      age: "",
      sex: "",
      hall: "",
      department: "",
      diagnosis: "",
      first: "",
      subs: "",
      remarks: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#F7F9FC] px-4 py-10 md:px-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 text-center">

          <h1 className="text-3xl font-semibold tracking-tight text-[#991B1B] sm:text-4xl md:text-5xl">
            UNIVERSITY OF PERADENIYA
          </h1>

          <h2 className="mt-2 text-xl font-medium tracking-wide text-[#374151] sm:text-2xl">
            PATIENTS&apos; REGISTER
          </h2>

          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#B91C1C]" />

          <p className="mt-4 text-sm text-[#6B7280]">
            Enter patient information accurately
          </p>

        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.08)] md:p-10">

          <form onSubmit={handleSubmit}>

            {/* Patient Information */}
            <section>

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-[#B91C1C]">
                  01
                </div>

                <h3 className="text-xl font-semibold text-[#374151]">
                  Patient Information
                </h3>

              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {/* No */}
                <div>
                  <label
                    htmlFor="no"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    No.
                  </label>

                  <input
                    id="no"
                    name="no"
                    type="text"
                    placeholder="Enter number"
                    value={formData.no}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* File No */}
                <div>
                  <label
                    htmlFor="fileNo"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    File No.
                  </label>

                  <input
                    id="fileNo"
                    name="fileNo"
                    type="text"
                    placeholder="Enter file number"
                    value={formData.fileNo}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter patient's full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Age */}
                <div>
                  <label
                    htmlFor="age"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Age
                  </label>

                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="0"
                    max="150"
                    placeholder="Enter age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Sex */}
                <div>
                  <label
                    htmlFor="sex"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Sex
                  </label>

                  <select
                    id="sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Select sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Hall */}
                <div>
                  <label
                    htmlFor="hall"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Hall
                  </label>

                  <input
                    id="hall"
                    name="hall"
                    type="text"
                    placeholder="Enter hall"
                    value={formData.hall}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    type="text"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>

            </section>

            {/* Medical Information */}
            <section className="mt-10">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-[#B91C1C]">
                  02
                </div>

                <h3 className="text-xl font-semibold text-[#374151]">
                  Medical Information
                </h3>

              </div>

              <div className="grid grid-cols-1 gap-6">

                {/* Diagnosis */}
                <div>
                  <label
                    htmlFor="diagnosis"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Diagnosis
                  </label>

                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    rows={4}
                    placeholder="Enter diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                  />
                </div>

                {/* Visits */}
                <div>

                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Visits
                  </label>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                    {/* First */}
                    <div>
                      <label
                        htmlFor="first"
                        className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#6B7280]"
                      >
                        First
                      </label>

                      <input
                        id="first"
                        name="first"
                        type="text"
                        placeholder="Enter first visit"
                        value={formData.first}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    {/* Subs */}
                    <div>
                      <label
                        htmlFor="subs"
                        className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#6B7280]"
                      >
                        Subs
                      </label>

                      <input
                        id="subs"
                        name="subs"
                        type="text"
                        placeholder="Enter subsequent visits"
                        value={formData.subs}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                  </div>

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
                    rows={4}
                    placeholder="Enter additional remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                  />
                </div>

              </div>

            </section>

            {/* Buttons */}
            <div className="mt-10 flex flex-col-reverse gap-4 border-t border-gray-200 pt-7 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl border border-gray-300 bg-white px-7 py-3 font-medium text-[#4B5563] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
              >
                Clear
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#3B82C4] px-8 py-3 font-semibold text-white shadow-[0_5px_0_#2563A6,0_10px_20px_rgba(59,130,196,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_7px_0_#2563A6,0_14px_25px_rgba(59,130,196,0.28)] active:translate-y-0"
              >
                Save Patient
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}

export default page