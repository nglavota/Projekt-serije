'use client';

import Link from "next/link";
import BackButton from "./BackButton";

// Navigacijska traka koja se koristi unutar stranica pojedine serije
export default function ShowNav({ id }) {
  // Popis stavki koje se prikazuju u izborniku
  const menuItems = [
    { label: "🏠 Početna", href: "/" },
    { label: "📺 Epizode", href: `/shows/${id}/episodes` },
    { label: "🎭 Glumci", href: `/shows/${id}/cast` },
    { label: "⭐ Favoriti", href: "/favorites" },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-800 to-purple-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 gap-4">
        
        <h2 className="text-2xl font-bold tracking-wide">🎬 Izbornik</h2>

        <nav className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-yellow-300 transition font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Gumb za povratak na prethodnu stranicu */}
        <div className="flex justify-center sm:justify-end">
          <BackButton />
        </div>
      </div>
    </header>
  );
}
