"use client";

import { useEffect, useState } from "react";

export default function PersonalInfoPage() {
  const [userName, setUserName] = useState("Sekar Kumaran M");
  const [email, setEmail] = useState("s***7@gmail.com");

  useEffect(() => {
    // Attempt to pull real values if available, else stick to defaults
    const name = localStorage.getItem("userName");
    const mail = localStorage.getItem("userEmail");
    if (name) setUserName(name);
    if (mail) setEmail(mail);
  }, []);

  const infoFields = [
    { label: "Legal name", value: userName, action: "Edit" },
    { label: "Preferred first name", value: "Not provided", action: "Add" },
    { label: "Email address", value: email, action: "Edit" },
    { label: "Phone numbers", value: "Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they're used.", action: "Add" },
    { label: "Identity verification", value: "Not started", action: "Start" },
    { label: "Residential address", value: "Not provided", action: "Add" },
    { label: "Postal address", value: "Not provided", action: "Add" },
    { label: "Emergency contact", value: "Not provided", action: "Add" },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-12 lg:pl-10">
      <div className="flex-1">
        <h2 className="mb-8 text-[32px] font-semibold text-gray-900">Personal information</h2>
        
        <div className="flex flex-col">
          {infoFields.map((field, idx) => (
            <div key={idx} className="flex justify-between gap-4 border-b border-gray-200 py-6 last:border-0">
              <div className="flex flex-col pr-8">
                <span className="text-[17px] font-semibold">{field.label}</span>
                <span className="mt-1 text-[15px] text-gray-500">{field.value}</span>
              </div>
              <button className="h-fit font-semibold underline shrink-0 hover:text-gray-600 transition">
                {field.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
