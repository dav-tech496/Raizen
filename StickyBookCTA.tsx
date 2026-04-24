"use client";

import Link from "next/link";

type Props = {
  title: string;
  price: number;
  bookingHref: string;
};

export function StickyBookCTA({ title, price, bookingHref }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="text-xl font-bold text-primary">
            ${price.toLocaleString()}
          </p>
        </div>
        <Link
          href={bookingHref}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Book {title}
        </Link>
      </div>
    </div>
  );
}
