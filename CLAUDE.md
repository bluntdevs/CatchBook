# TrackFishCatches – Vislogboek

Persoonlijke vislogboek-app (vooral karpervissen) van Nicky. Communiceer in het **Nederlands** (Vlaams/Belgisch), direct en grondig. Nicky werkt stap per stap: bouw wat gevraagd wordt, stel verbeteringen voor, maar begin niet aan grote nieuwe onderdelen zonder dat hij het zegt.

## Stand van zaken (15 okt 2026)

- `prototype/vislogboek.html` is de volledige, werkende app (één HTML-bestand, vanilla JS, geen frameworks). Gebouwd en getest als claude.ai-artifact. Dit is de bron voor de echte app.
- Opslag in het prototype: `localStorage` (sleutel `vislogboek-v1`, `-steks`, `-locs`, `-bak`) en foto's in IndexedDB (`vislogboek`, store `p`). Back-up = JSON met sessies, steks en foto's (base64).
- In het artifact werkten GPS en externe netwerkcalls niet; downloads liepen via de artifact-`downloads`-capability (`claude.use('downloads')`) met een gewone `<a download>` als fallback.

## Doel van deze sessie / volgende stap

Nicky gaat dit weekend vissen met een vriend (Android) en wil daar testen. Plan dat met Nicky is afgesproken:

1. **Eén codebasis** (de web-app) → **PWA via GitHub Pages** (`bluntdevs.github.io/TrackFishCatches`) voor iPhone-testers en snelle ontwerptests, en **apk via Capacitor + GitHub Actions** voor Android. Later dezelfde Capacitor-app naar Play Store (AAB) en App Store (TestFlight; vereist Mac of macOS-runner + Apple Developer-account). Alles moet gratis blijven tot de stores.
2. Repository is **publiek** (nodig voor gratis Pages). Geen gebruikersdata in de repo. Ondertekeningssleutel van de apk **nooit** in de repo: als GitHub Secret. Vanaf versie 1 een **vaste** keystore, anders kunnen updates niet over de oude app en verliezen testers hun data.
3. **Vaste app-ID** kiezen vóór de eerste build (los van de GitHub-naam, bv. `be.vislogboek.app`) en de **app-naam** aan Nicky vragen (nog niet beslist; kandidaten: "Vislogboek", "TrackFishCatches").
4. Bouwen met tussenlagen zodat de overstap later klein is: opslag-laag (nu IndexedDB/localStorage, later SQLite), GPS/camera-laag (nu browser-API, later Capacitor-plugins).
5. PWA: service worker (offline), manifest, iconen, versienummer in de app + melding "Nieuwe versie beschikbaar, tik om te vernieuwen".
6. GPS-knop echt laten werken (was in het artifact geblokkeerd), foto rechtstreeks met camera (`capture`).
7. Downloads in de PWA/apk via gewone bestanden (de artifact-capability bestaat daar niet; houd fallback).
8. Nicky moet zijn testsessies uit het artifact meenemen via JSON-back-up → importeren in de nieuwe app.

Daarna (na het weekend): sessieoverzicht visueel aantrekkelijker (foto per sessie, achtergrondfoto in de bovenbalk via instelling per gebruiker), Analyse-tab, omstandigheden automatisch ophalen (Open-Meteo, per uur, tijdlijn met slider en vangsten erop).

## App-structuur (prototype)

Tabs: **Vissen** (start/stop, lopende sessie-kaart, snelknoppen Voeg vangst toe / Verplaats stok enkel tijdens lopende sessie), **Sessies** (mini-overzicht, filters/sorteer/selecteer, lijst, detail), **Analyse** (nog leeg), **Back-up** (back-up/CSV/import, namen opkuisen, alles wissen).

Sessieformulier in stappen met **Bevestig** per onderdeel, één onderdeel tegelijk zichtbaar:
- Wanneer: start/eind datum + uur.
- Locatie en water: GPS of coördinaten eerst → stek binnen 50 m wordt herkend en vult naam water/toegang/watertype in, anders nieuwe stek; waternamen-database (België, uit Wikipedia-lijsten) + eigen namen, canonieke schrijfwijze; rivier/kanaal → standaard Openbaar; stekfoto per sessie (laatste foto van de stek voorgesteld, wijzigbaar).
- Stokken: per stok montage, haakaas, voeraas, diepte, afstand, kenmerken, aanduiding op stekfoto, vangsten per stok (soort, kg, cm, uur, foto's). Stok verplaatsen = nieuwe positie met eigen start/einde (blanke plekken grijs, vangst-plekken groen op de stekfoto).
- Omstandigheden (handmatig voorlopig), Foto's (vangstfoto's + sfeerfoto's, achteraf toewijsbaar).
- Tijdcontrole: posities/vangsten worden automatisch op de juiste dag geplaatst (nachtsessies, "+1"), fouten/waarschuwingen bij opslaan.
- Komma als decimaalteken, Enter slaat niet op, waarschuwing bij niet-opgeslagen wijzigingen.

## Werkwijze

- Test wijzigingen met Playwright (Chromium staat klaar, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) voor je ze oplevert.
- Leg resultaten kort en in gewone woorden uit; geen technische jargon tenzij Nicky erom vraagt.
