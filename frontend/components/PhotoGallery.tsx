"use client";

import { useState } from "react";
import Image from "next/image";
import { ListingImage } from "@/types";

interface PhotoGalleryProps {
  images: ListingImage[];
  title: string;
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [showModal, setShowModal] = useState(false);

  const displayImages = images.slice(0, 5);
  const mainImage =
    displayImages[0]?.url ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";

  return (
    <>
      <div className="relative mt-4">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:hidden"
        >
          <Image src={mainImage} alt={title} fill className="object-cover" sizes="100vw" />
        </button>

        <div className="hidden aspect-[2.15/1] max-h-[520px] grid-cols-4 gap-2 overflow-hidden rounded-2xl md:grid">
          <button
            type="button"
            className="group relative col-span-2 row-span-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Image
              src={mainImage}
              alt={title}
              fill
              className="object-cover transition duration-300 group-hover:brightness-95"
              sizes="50vw"
            />
          </button>
          {displayImages.slice(1, 5).map((image, index) => (
            <button
              type="button"
              key={image.id || index}
              className="group relative cursor-pointer overflow-hidden"
              onClick={() => setShowModal(true)}
            >
              <Image
                src={image.url}
                alt={`${title} photo ${index + 2}`}
                fill
                className="object-cover transition duration-300 group-hover:brightness-95"
                sizes="25vw"
              />
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-1.5 text-sm font-medium text-black shadow-sm hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Show all photos
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
            <button
              onClick={() => setShowModal(false)}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-sm font-semibold">{title}</span>
            <div className="w-8" />
          </div>

          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
            {(images.length ? images : displayImages).map((image, index) => (
              <div key={image.id || index} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={`${title} full photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
