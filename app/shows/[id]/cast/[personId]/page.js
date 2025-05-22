// Stranica prikazuje detalje o glumcu na temelju ID-a osobe iz URL-a.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dinamičko generiranje meta podataka za SEO 
export async function generateMetadata({ params }) {
  const { personId } = await params;

  const res = await fetch(`https://api.tvmaze.com/people/${personId}`);
  if (!res.ok) {
    return {
      title: "Osoba nije pronađena",
      description: "Pokušali ste pristupiti nepostojećem glumcu.",
    };
  }

  const person = await res.json();
  const image = person.image?.original || "/default-image.jpg";

  return {
    title: `Glumac │ ${person.name}`,
    description: `Detalji o osobi ${person.name}, ${person.gender || "?"}, rođen(a) ${person.birthday || "nepoznato"}.`,
    openGraph: {
      title: person.name,
      description: `Pogledajte profil osobe ${person.name}.`,
      images: [{ url: image, width: 800, height: 1200, alt: person.name }],
    }
  };
}

// Funkcija za dohvaćanje detalja o osobi putem TVmaze API-ja
// Ako osoba nije pronađena ili dođe do greške, vraća se null, a to uzrokuje prikaz 404 stranice
async function fetchPersonDetails(personId) {
  const response = await fetch(`https://api.tvmaze.com/people/${personId}`);
  if (!response.ok) return null;

  return await response.json(); // Vraćamo podatke kao JSON
}

export default async function PersonDetailPage({ params }) {
  const { personId } = await params;

  const person = await fetchPersonDetails(personId);

  // Ako osoba ne postoji (npr. pogrešan ID), preusmjeravamo korisnika na 404 stranicu
  if (!person) return notFound();

  // Ako slika nije dostupna, prikazujemo zadanu sliku
  const imageUrl = person.image?.original || "/default-image.jpg";

  return (
    <main className="min-h-[80vh] text-white p-2 flex justify-center items-center">
      <div className="max-w-xl w-full bg-gray-600/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-yellow-300 mb-8">
          {person.name}
        </h1>

        {/* Glavni sadržaj: slika i osnovne informacije o glumcu */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-lg border border-gray-600">
            <Image
              src={imageUrl}
              alt={person.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 200px"
              priority
            />
          </div>

          {/* Tekstualni podaci o osobi – prikazuju se samo ako postoje */}
          <div className="flex-1 space-y-4 text-sm text-gray-200">
            {person.gender && (
              <p><span className="font-semibold text-white">Spol:</span> {person.gender}</p>
            )}
            {person.birthday && (
              <p><span className="font-semibold text-white">Datum rođenja:</span> {person.birthday}</p>
            )}
            {person.deathday && (
              <p><span className="font-semibold text-white">Datum smrti:</span> {person.deathday}</p>
            )}
            {person.country?.name && (
              <p><span className="font-semibold text-white">Država:</span> {person.country.name}</p>
            )}
            {person.url && (
              <p>
                <span className="font-semibold text-white">TVmaze profil:</span>{" "}
                <Link
                  href={person.url}
                  target="_blank"
                  className="text-blue-400 underline hover:text-blue-200 transition"
                >
                  Otvori
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
