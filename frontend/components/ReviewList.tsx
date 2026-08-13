"use client";

import Image from "next/image";
import { Host } from "@/types";

interface ReviewListProps {
  rating: number | null;
  reviewCount: number;
  host: Host;
}

export default function ReviewList({ rating, reviewCount }: ReviewListProps) {
  const mockReviews = [
    {
      id: 1,
      author: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      date: "October 2025",
      text: "Awesome stay! The place was super clean, well equipped, and located in a wonderful neighborhood. Would definitely stay here again.",
    },
    {
      id: 2,
      author: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      date: "August 2025",
      text: "The space was beautiful and exactly as described. Communication with the host was quick and seamless.",
    },
  ];

  return (
    <div className="border-t border-gray-200 py-8">
      <div className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <svg className="h-5 w-5 fill-current text-black" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span>
          {rating ? rating.toFixed(2) : "New"} · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mockReviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={review.avatar}
                alt={review.author}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-semibold">{review.author}</h4>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
