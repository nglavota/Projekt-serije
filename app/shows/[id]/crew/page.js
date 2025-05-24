// Stranica koja prikazuje produkcijsku ekipu serije dohvaćenu s TVmaze API-ja.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dohvaćanje članova ekipe
async function fetchCrew(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/crew`);
  if (!response.ok) throw new Error("Pogreška pri dohvaćanju ekipe!");

  const data = await response.json();

  if (!data || data.length === 0) {
    notFound();
  }

  return data;
}

export default async function CrewPage({ params }) {
  const { id } = await params;

  let crew;

  try {
    crew = await fetchCrew(id);
  } catch (error) {
    console.error("Greška:", error);
    notFound();
  }

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-300">Produkcijska ekipa</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {crew.map(({ person, type }, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl text-center"
          >
            {/* Slika osobe – ako nije dostupna, prikazuje se default */}
            <div className="relative w-full aspect-[3/4] mb-3 rounded-lg overflow-hidden">
              <Image
                src={person.image?.medium || "/default-image.jpg"}
                alt={person.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 150px"
                priority
              />
            </div>

            {/* Ime i funkcija (npr. Director, Producer) */}
            <h2 className="font-semibold text-yellow-200">{person.name}</h2>
            <p className="text-sm text-gray-300">{type}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
