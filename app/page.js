'use client'; 

import { useState, useEffect } from 'react';
import ShowSearch from './components/ShowSearch';
import GenreFilter from './components/GenreFilter';
import ShowPreview from './components/ShowPreview';

const itemsLoad = 12; // Broj serija koji imamo inicijalno te koji dodajemo kasnije pri svakom kliku na gumb "Učitaj još"

export default function HomePage() {
  const [allShows, setAllShows] = useState([]);  // Sve serije dohvaćene s API-ja
  const [visibleShows, setVisibleShows] = useState([]); // Trenutno prikazane serije
  const [searchQuery, setSearchQuery] = useState(''); // Upit za pretragu
  const [selectedGenres, setSelectedGenres] = useState([]); // Odabrani žanrovi
  const [filteredShows, setFilteredShows] = useState([]); // Rezultat filtriranja (pretraga + žanrovi)
  const [loading, setLoading] = useState(false); // Status učitavanja
  const [error, setError] = useState(null);  // Poruka o greški ako fetch ne uspije
  const [apiPage, setApiPage] = useState(0);  // Broj trenutne stranice s API-ja
  const [loadedCount, setLoadedCount] = useState(0); // Broj trenutno prikazanih serija

  // useEffect koji dohvaća podatke s vanjskog API-ja (TVmaze)
  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.tvmaze.com/shows?page=${apiPage}`, {
          cache: 'force-cache',
        });

        if (!res.ok) throw new Error('Pogreška prilikom dohvaćanja podataka!');

        const data = await res.json();
        if (data.length === 0) return; // Ako nema više serija zasustavljamo se

        // Sprječavamo duplikate provjerom po id-u
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
  }, [apiPage]); 

  // Filtriranje serija na temelju pretrage i žanrova
  useEffect(() => {
    let filtered = [...allShows];

    // Sortiranje po datumu premijere (da dobijemo serije po kriteriju koje su najnovije)
    filtered.sort((a, b) => new Date(b.premiered) - new Date(a.premiered));

    // Ako korisnik unese bar 2 slova, filtriramo po imenu
    if (searchQuery.length >= 2) {
      filtered = filtered.filter(show =>
        show.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Ako su odabrani žanrovi, filtriramo serije koje ih sadrže
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(show =>
        selectedGenres.every(genre => show.genres.includes(genre))
      );
    }

    setFilteredShows(filtered); // Ažuriramo filtrirani popis
    setLoadedCount(itemsLoad); // Resetiramo broj prikazanih
    setVisibleShows(filtered.slice(0, itemsLoad)); 
  }, [searchQuery, selectedGenres, allShows]); 

  // Funkcija koja učitava još serija
  const loadMore = () => {
    const nextCount = loadedCount + itemsLoad;

    // Ako trebamo više serija nego što ih imamo, dohvaćamo novu stranicu s API-ja
    if (nextCount > filteredShows.length && allShows.length < 10000) {
      setApiPage(prev => prev + 1);
    }

    setVisibleShows(filteredShows.slice(0, nextCount)); // Ažuriramo prikazane
    setLoadedCount(nextCount); // Ažuriramo broj prikazanih
  };

  return (
    <>
      {/* Poruka o grešci ako nešto ne uspije */}
      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {/* Komponente za pretragu i filtriranje žanrova*/}
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
              priority={index === 0} // Prva slika dobiva priority
            />
          ))
        )}
      </div>

      {/* Gumb za učitavanje više serija */}
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
