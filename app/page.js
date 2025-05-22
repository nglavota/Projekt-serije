'use client';

 //Početna stranica moje aplikacije.
 //Prikazuje listu popularnih serija dohvaćenih s TVmaze API-ja po kriteriju da su to najnovije serije, uz mogućnost 
 //pretrage, filtriranje po žanrovima i dodatno učitavanje klikom na gumb Učitaj još.
 

import { useState, useEffect } from 'react';
import ShowSearch from './components/ShowSearch';
import GenreFilter from './components/GenreFilter';
import ShowPreview from './components/ShowPreview';

const itemsLoad = 12; // Početni broj prikazanih serija i broj za učitavanje dodatnih

export default function HomePage() {
  // Svi dohvaćeni podaci
  const [allShows, setAllShows] = useState([]);

  // Serije koje su trenutno prikazane korisniku
  const [visibleShows, setVisibleShows] = useState([]);

  // Tekstualni upit za pretragu
  const [searchQuery, setSearchQuery] = useState('');

  // Odabrani žanrovi za filtriranje
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Serije filtrirane po pretrazi i žanru
  const [filteredShows, setFilteredShows] = useState([]);

  // Status učitavanja API-ja
  const [loading, setLoading] = useState(false);

  // Poruka o grešci pri dohvaćanju podataka
  const [error, setError] = useState(null);

  // Broj trenutno dohvaćene stranice s API-ja 
  const [apiPage, setApiPage] = useState(0);

  // Broj trenutno prikazanih 
  const [loadedCount, setLoadedCount] = useState(0);

  // Dohvaćanje podataka iz TVmaze API-ja
  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.tvmaze.com/shows?page=${apiPage}`, {
          cache: 'force-cache', // Koristimo cache jer se podaci ne mijenjaju često
        });

        if (!res.ok) throw new Error('Pogreška prilikom dohvaćanja podataka!');

        const data = await res.json();
        if (data.length === 0) return; // Ako nema više serija, prekidamo

        // Sprječavamo duplikate pomoću ID-a
        setAllShows(prev => {
          const existingIds = new Set(prev.map(show => show.id));
          const uniqueNewShows = data.filter(show => !existingIds.has(show.id));
          return [...prev, ...uniqueNewShows];
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchShows();
  }, [apiPage]); // Svaka promjena stranice pokreće novo dohvaćanje

  // Filtriranje prema pretrazi i odabranim žanrovima
  useEffect(() => {
    let filtered = [...allShows];

    // Sortiranje: serije s novijim datumom premijere dolaze prve
    filtered.sort((a, b) => new Date(b.premiered) - new Date(a.premiered));

    // Pretraga: ignorira se ako su manje od 2 slova unesena
    if (searchQuery.length >= 2) {
      filtered = filtered.filter(show =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtriranje: serija mora sadržavati sve odabrane žanrove 
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(show =>
        selectedGenres.every(genre => show.genres.includes(genre))
      );
    }

    // Ažuriramo prikaz i resetiramo brojač prikazanih
    setFilteredShows(filtered);
    setLoadedCount(itemsLoad);
    setVisibleShows(filtered.slice(0, itemsLoad));
  }, [searchQuery, selectedGenres, allShows]);

  // Funkcija za učitavanje dodatnih serija 
  const loadMore = () => {
    const nextCount = loadedCount + itemsLoad;

    // Ako nemamo dovoljno podataka, dohvaćamo novu stranicu
    if (nextCount > filteredShows.length && allShows.length < 10000) {
      setApiPage(prev => prev + 1);
    }

    // Ažuriramo prikaz
    setVisibleShows(filteredShows.slice(0, nextCount));
    setLoadedCount(nextCount);
  };

  return (
    <>
      {/* Prikaz greške ako dohvaćanje nije uspjelo */}
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* Komponente za pretragu i filtriranje */}
      <ShowSearch query={searchQuery} onQueryChange={setSearchQuery} />
      <GenreFilter selectedGenres={selectedGenres} onChange={setSelectedGenres} />

      {loading && <p className="text-center mb-4">Učitavanje...</p>}

      {/* Prikaz serija */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 mb-12">
        {visibleShows.length === 0 && !loading ? (
          <p className="text-center col-span-full">Nema rezultata.</p>
        ) : (
          visibleShows.map((show, index) => (
            <ShowPreview
              key={`${show.id}-${index}`}
              show={show}
              priority={index === 0} // Prva serija dobiva priority za bolji SEO/LCP
            />
          ))
        )}
      </div>

      {/* Gumb za dodatno učitavanje serija */}
      {visibleShows.length < filteredShows.length && (
        <div className="flex justify-center mb-10">
          <button
            onClick={loadMore}
            className="bg-white text-indigo-700 px-6 py-2 rounded hover:bg-gray-200 font-bold shadow-md transition"
          >
            Učitaj još...
          </button>
        </div>
      )}
    </>
  );
}
