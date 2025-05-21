"use client";

import Image from "next/image";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  // Stanje koje čuva listu favorita
  const [favorites, setFavorites] = useState([]);

  // Dohvaćamo favorite iz lokalnog API-ja nakon što se komponenta učita
  useEffect(() => {
    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => setFavorites(data));
  }, []);

  // Funkcija za uklanjanje favorita
  const handleDelete = async (id) => {
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // Šaljemo id koji želimo izbrisati
    });

    // Ako je brisanje uspješno, ažuriramo lokalno stanje
    if (res.ok) {
      setFavorites(prev => prev.filter(f => f.id !== id));
    }
  };

  // Ako nema favorita, prikazujemo poruku i gumb za povratak
  if (favorites.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <BackButton />
        <p className="text-xl mt-6">Nema spremljenih favorita.</p>
      </div>
    );


  return (
    <main className="min-h-screen p-6 text-white">
      {/* Naslov i gumb za povratak */}
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-4">⭐ Moji favoriti ⭐</h1>
        <div className="mt-8">
          <BackButton />
        </div>
      </div>

      {/* Prikaz svih spremljenih favorita */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-4 hover:bg-white/20 transition"
          >
            {/* Prikaz slike serije */}
            <Image
              src={fav.poster_path || "/default-image.jpg"} // Ako nema slike, koristimo zadanu
              alt={fav.title || "Serija"}
              width={200}
              height={300}
              className="w-full aspect-[2/3] object-cover rounded"
            />

            {/* Naziv serije */}
            <p className="mt-4 text-lg font-semibold text-center">{fav.title}</p>

            {/* Gumb za brisanje iz favorita */}
            <button
              onClick={() => handleDelete(fav.id)}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Ukloni iz favorita
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
