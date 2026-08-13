"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

export default function AboutPage() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guest";
    // In our mock, userName might be full name, let's grab first name
    setUserName(name.split(" ")[0]);
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-12 lg:pl-10">
      <div className="flex-1 space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="text-[32px] font-semibold text-gray-900">About me</h2>
          <button className="rounded-full border px-4 py-1 text-sm font-semibold hover:border-gray-900 transition">
            Edit
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ID Card */}
          <div className="flex flex-col items-center justify-center rounded-[32px] border bg-white p-8 shadow-[0_6px_16px_rgba(0,0,0,0.12)] min-w-[280px]">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-semibold text-green-800">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold">{userName}</h3>
            <p className="text-sm font-semibold text-gray-500">Guest</p>
          </div>

          {/* Profile Completion CTA */}
          <div className="flex-1 space-y-3 py-4">
            <h3 className="text-[22px] font-semibold">Complete your profile</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
            </p>
            <button className="mt-2 rounded-lg bg-[#FF385C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E31C5F]">
              Get started
            </button>
          </div>
        </div>

        <div className="border-t pt-8">
          <button className="flex items-center gap-3 text-sm font-semibold hover:bg-gray-50 p-2 -ml-2 rounded-xl transition">
            <MessageSquare className="h-5 w-5 text-gray-700" />
            Show reviews I&apos;ve written
          </button>
        </div>
      </div>
    </div>
  );
}
