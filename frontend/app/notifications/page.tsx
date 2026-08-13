"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10 min-h-[60vh]">
      <h1 className="mb-12 text-3xl font-semibold tracking-tight text-gray-900">Notifications</h1>

      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="mb-2 text-[17px] font-semibold text-gray-900">No notifications yet</h2>
        <p className="text-[15px] text-gray-500">
          You&apos;ve got a blank slate (for now). We&apos;ll let you know when updates arrive.
        </p>
      </div>
    </div>
  );
}
