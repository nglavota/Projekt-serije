// Stranica prikazuje glumačku postavu za pojedinu TV seriju, dohvaćenu s TVmaze API-ja.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Funkcija za dohvaćanje glumačke postave serije preko TVMaze API-ja
// Ako serija ne postoji ili nema glumaca, baca se greška ili se prikazuje 404
async function fetchCast(showId) {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/cast`);

  // Ako dohvaćanje ne uspije, bacamo grešku 
  if (!response.ok) throw new Error("Pogreška pri dohvaćanju glumaca!");

  const data = await response.json();

  // Ako ne dobijemo nijednog glumca (npr. nepostojeći show ID),  not-found stranica
  if (!data || data.length === 0) {
    notFound();
  }

  return data;
}

export default async function CastPage({ params }) {
  const { id } = await params; 

  let cast;

  try {
    cast = await fetchCast(id); // Dohvaćanje glumačke postave
  } catch (error) {
    console.error("Greška:", error);
    notFound();
  }

  return (
    <main className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-300">Glumačka postava</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cast.map(({ person, character }, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl text-center"
          >
            {/* Slika glumca – ako nije dostupna, prikazuje se default slika */}
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

            {/* Ime glumca i ime lika kojeg glumi */}
            <h2 className="font-semibold text-yellow-200">{person.name}</h2>
            <p className="text-sm text-gray-300">Kao: {character.name}</p>

            {/* Link na detalje o glumcu unutar TVmaze API-ja */}
            <Link
              href={`/shows/${id}/cast/${person.id}`}
              className="mt-2 inline-block text-blue-300 underline hover:text-white"
            >
              Detalji
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
