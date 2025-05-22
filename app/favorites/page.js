'use client';

// Stranica za prikaz i upravljanje listom omiljenih serija korisnika.
// Dohvaća favorite s lokalnog API-ja, prikazuje ih i omogućuje uklanjanje.

import Image from "next/image";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";

 

export default function FavoritesPage() {
  // Trenutno stanje favorita koji su dohvaćeni s API-ja
  const [favorites, setFavorites] = useState([]);

  // Nakon učitavanja komponente dohvaćamo favorite iz lokalnog API-ja
  // Koristimo useEffect da se fetch pozove samo jednom prilikom inicijalnog rendera
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
      body: JSON.stringify({ id }), // Šaljemo ID koji želimo ukloniti
    });

    // Ako je zahtjev uspješan, filtriramo i ažuriramo stanje da uklonimo obrisani favorit 
    if (res.ok) {
      setFavorites(prev => prev.filter(f => f.id !== id));
    }
  };

  // Prikazujemo poruku i gumb za povratak ako nema spremljenih favorita
  if (favorites.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <BackButton />
        <p className="text-xl mt-6">Nema spremljenih favorita.</p>
      </div>
    );

  return (
    <main className="min-h-screen p-6 text-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-4">⭐ Moji favoriti ⭐</h1>
        <div className="mt-8">
          <BackButton />
        </div>
      </div>

      {/* Grid za prikaz svih favorita, sa slikom, nazivom i gumbom za brisanje */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-4 hover:bg-white/20 transition"
          >
            <Image
              src={fav.poster_path || "/default-image.jpg"} 
              alt={fav.title || "Serija"}
              width={200}
              height={300}
              className="w-full aspect-[2/3] object-cover rounded"
            />
            <p className="mt-4 text-lg font-semibold text-center">{fav.title}</p>
            <button
              onClick={() => handleDelete(fav.id)}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              aria-label={`Ukloni ${fav.title} iz favorita`}
            >
              Ukloni iz favorita
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
