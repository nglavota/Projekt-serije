'use client'; 

// Komponenta koja korisnicima omogućuje dodavanje određene serije u favorite.
// Ova komponenta se izvršava na klijentu, koristi hook-ove poput useState i useEffect.

import { useState, useEffect, useTransition } from "react";

// Prilikom učitavanja provjerava se je li trenutna serija već u favoritima,
// a prilikom dodavanja koristimo useTransition kako bi korisničko sučelje ostalo brzo i responzivno
export default function FavoriteButton({ id, title, poster_path }) {
  const [isFavorite, setIsFavorite] = useState(false); 
  const [isPending, startTransition] = useTransition(); 

  useEffect(() => {
    // Kada se komponenta učita, dohvaćamo sve favorite i provjeravamo je li serija već dodana
    fetch("/api/favorites")
      .then(res => res.json())
      .then(data => {
        setIsFavorite(data.some(f => f.id === id)); // Provjera postoji li već taj ID među favoritima
      });
  }, [id]);

  const handleAddFavorite = () => {
    // Dodavanje u favorite se izvodi unutar transition-a kako bi se UI(korisničko sučelje) mogao prikazati kao "pending" bez blokiranja
    startTransition(() => {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title, poster_path }),
      }).then(() => setIsFavorite(true)); // Nakon uspješnog dodavanja serija postaje favorit
    });
  };

  return (
    <button
      onClick={handleAddFavorite}
      disabled={isFavorite || isPending} // Disable ako je već dodan ili se trenutno sprema
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 
        ${
          isFavorite
            ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
    >
      {isFavorite ? (
        <>
          ✅ U favoritima
        </>
      ) : isPending ? (
        "⏳ Spremanje..."
      ) : (
        <>
          ❤️ Dodaj u favorite
        </>
      )}
    </button>
  );
}
