'use client';

// Ova komponenta prikazuje tekstualno polje za pretraživanje serija, a korisnički unos se prosljeđuje 
// roditeljskoj komponenti putem onQueryChange callback funkcije kako bi se ažuriralo stanje pretrage.

export default function ShowSearch({ query, onQueryChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔎 Pretraži serije..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="p-2 w-full border border-gray-300 rounded mb-4 text-black"
        autoFocus
      />
    </div>
  );
}
