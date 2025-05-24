# Projekt - 📺 Istraživanje TV serija

## Opis projekta

Moja aplikacija za istraživanje TV serija je Next.js projekt koji koristi [TVmaze API](https://www.tvmaze.com/api) za prikazivanje informacija o najnovijim TV serijama uključujući detalje o svakoj pojedinačnoj seriji, prikaz i detalje njenih epizoda, pregled produkcijske ekipe te pregled i pojedinosti o glumcima. Korisnici putem ove aplikacije mogu pregledavati serije, pretraživati ih po nazivu te filtrirati rezultate po žanrovima. Svaka serija ima svoju zasebnu stranicu s detaljnim informacijama koje obuhvaćaju opis, žanrove, prosječnu ocjenu te se putem izbornika može pristupiti listi epizoda i glumačkoj postavi.

Aplikacija korisnicima omogućuje i upravljanje listom omiljenih serija (favorita). Dodavanje, dohvaćanje i brisanje favorita se odvija kroz vlastiti API, a podatci se pohranjuju u memoriji servera tijekom trajanja sesije. To znači da favoriti nisu trajno spremljeni, odnosno brišu se nakon restart-a, ali planirana je nadogradnja koja će omogućiti trajnu pohranu.

## Pregled funkcionalnosti

- **Početna stranica** (/app/page.js) prikazuje listu od 12 TV serija sa slikama, žanrovima kojima pripadaju i prosječnim ocjenama. Izgled kartice za pojedinačnu seriju je definiran u komponenti ShowPreview.js koja se nalazi unutar mape components. Serije su sortirane prema datumu premijere (one s novijim datumom premijere dolaze prve). Dodana je mogućnost učitavanja više serija (točnije još po 12) klikom na gumb *Učitaj još*. Stranica također ima:
  
  - Mogućnost pretraživanja serija po nazivu.
  - Mogućnost filtriranja serija po žanrovima korištenjem checkbox filtera.

- **Dinamičke rute**
  
  - /shows/[id] - detalji pojedinačne serije
  - /shows/[id]/episodes - prikaz svih epizoda odabrane serije
  - /shows/[id]/episodes/[episodeId] - prikaz detalja odabrane epizode
  - /shows/[id]/crew - prikaz produkcijske ekipe odabrane serije
  - /shows/[id]/cast - prikaz glumačke postave odabrane serije
  - /shows/[id]/cast/[personId] - prikaz pojedinosti o odabranom glumcu
  
- **Favoriti** - koristim lokalnu API rutu (/api/favorites) kreiranu unutar moje aplikacije koja omogućuje dodavanje, dohvaćanje i brisanje favorita tijekom trajanja sesije. Stranica /app/favorites/page.js prikazuje sve spremljene favorite s mogućnošću njihova uklanjanja. Na stranici sa prikazom detalja odabrane serije imam dodanu *FavoriteButton* komponentu za dodavanje serije u favorite. Tu sam koristila i useTransition – hook koji nam služi kako bi izbjegli blokiranje sučelja dok čekamo odgovor na POST zahtjev.

- **Podrška za 404 stranicu** - koristim kada tražena serija, epizoda ili glumac ne postoje. Kada pozovem notFound() iz modula next/navigation, automatski se preusmjerava korisnika na moju prilagođenu 404 stranicu - /app/not-found.js.

- **Stranica za učitavanje** - imam globalnu /app/loading.js komponentu koja omogućuje prikaz informacija o učitavanju.

- **Deploy** - postavljeno u produkcijsko okruženje Vercel.

## Lokalno pokretanje aplikacije

- **Kloniraj repozitorij** - git clone https://github.com/nglavota/Projekt-serije
- **Instaliraj potrebne pakete** - npm install
- **Pokreni aplikaciju** - npm run dev

## Build & deploy

- **Pokretanje next build-a** - npm run build
- **Lokalno testiranje aplikacije** - npm start
- **Link na Vercel** - https://projekt-serije.vercel.app/
 
## Planirane nadogradnje
Favoriti mi se trenutno pohranjuju samo u memoriji servera, što znači da se brišu nakon restart-a aplikacije. Planiram dodati podršku za trajnu pohranu, koristeći localStorage ili bazu. Također, plan mi je omogućiti korisniku dodavanje epizoda i glumaca u favorite.
