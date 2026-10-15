# CatchBook (vroeger: Vislogboek)

Persoonlijke vislogboek-app (vooral karpervissen) van Nicky. Communiceer in het **Nederlands** (Vlaams/Belgisch), direct en grondig. Nicky werkt stap per stap: bouw wat gevraagd wordt, stel verbeteringen voor, maar begin niet aan grote nieuwe onderdelen zonder dat hij het zegt.

## Vaste gegevens

- App-naam: **CatchBook** · app-ID: **`be.bluntdevs.catchbook`** (nooit meer wijzigen) · repo: **bluntdevs/CatchBook** (publiek).
- Web-app: **https://bluntdevs.github.io/CatchBook/** (workflow `.github/workflows/pages.yml`, publiceert map `www/`).
- Android: workflow `.github/workflows/android.yml` maakt met Capacitor (geïnstalleerd in CI, `android/` wordt niet bewaard) een ondertekende apk en zet die als GitHub-release; vaste downloadlink: https://github.com/bluntdevs/CatchBook/releases/latest/download/CatchBook.apk
- Ondertekening via geheimen `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (= catchbook). De sleutel staat NIET in de repo; Nicky bewaart hem zelf.
- **Versie verhogen bij elke release**: `APP_VERSION` in `www/index.html`, `VERSION` in `www/sw.js` en `version` in `package.json` (zelfde nummer). De service worker toont dan "Nieuwe versie beschikbaar". Voeg ook bovenaan `NEWS` in `www/index.html` een korte regel toe in gewone woorden: die verschijnt na de update als "Wat is er nieuw?". Pas `INTRO` (uitleg bij eerste opstart) aan als de werking verandert.
- In de npm-registry kan deze werkomgeving soms niet; Capacitor wordt daarom pas in GitHub Actions geïnstalleerd.

## Stand van zaken (15 okt 2026)

- Versie 0.4.0 (15 okt): voer als lijst + specificaties, wisknoppen, compacte stokken, lopende sessie met onderdelen, collage, camera/galerij-keuze, achtergrondfoto kopbalk én volledige pagina (beide houden), PR-labels + felicitatie, naam/kenmerken per vis (herkenning), notities in detail, snelle vangst onthoudt soort/stok, back-upherinnering na 7 dagen, thema Automatisch/Licht/Donker/Nacht (rood), scherm aan tijdens sessie. 0.4.2: uitleg bij eerste opstart (Toon uitleg in Back-up), karpervarianten (spiegel, schub, volschub, rijen, leer, graskarper apart); PR = zwaarste karper over alle varianten, "PR spiegel" enz. per variant.
- 0.5.5: "Wat is er nieuw?"-venster na updates (`NEWS`), uitleg bijgewerkt, Analyse en Omstandigheden gemarkeerd als "in opbouw". Promofilmpje voor testers: foto's mogen niet van Nicky zelf zijn; de werkomgeving kan geen foto's van internet downloaden (proxy blokkeert), dus Nicky levert vrije foto's aan.
- 0.5.0: logboek per sessie (`s.events`: misser, bijvoeren (wat + kg), aaswissel → `baitAt()`), watertemp + zicht, weegzak-aftrek (instelling), stokken van vorige sessie op zelfde stek voorstellen, vangst delen als afbeelding (zonder stek), zoeken, ongedaan maken (toast), tab 'Instellingen' als uitklaplijst, sessiedetail met overzicht + uitklapbare onderdelen + tijdlijn. Tijdelijke stijlkeuze bovenaan (Klassiek, Oever = standaard, Karpergear, Nachtwater) via `data-skin`; lettertypes lokaal in `www/fonts/`. 0.5.2: Nicky koos **Nachtwater** (standaard, altijd donker; Licht/Donker verborgen, Nacht rood blijft); stijlbalk weg, stijlkeuze nog in Instellingen → Weergave. Nieuwe sessie (live of achteraf) doorloopt enkel Wanneer, Locatie, Stokken; Logboek/Omstandigheden/Foto's optioneel via Bewerk. Bij Stop sessie opent Omstandigheden (later: automatisch voorstel via Open-Meteo, dan manueel corrigeren); Bevestig = opslaan, 'Later invullen' = overslaan.
- **`www/index.html` is de echte app** (PWA + bron voor Capacitor). `prototype/vislogboek.html` is de oude artifact-versie, enkel ter referentie.
- `prototype/vislogboek.html` was de volledige, werkende app (één HTML-bestand, vanilla JS, geen frameworks). Gebouwd en getest als claude.ai-artifact. Dit is de bron voor de echte app.
- Opslag in het prototype: `localStorage` (sleutel `vislogboek-v1`, `-steks`, `-locs`, `-bak`) en foto's in IndexedDB (`vislogboek`, store `p`). Back-up = JSON met sessies, steks en foto's (base64).
- In het artifact werkten GPS en externe netwerkcalls niet; downloads liepen via de artifact-`downloads`-capability (`claude.use('downloads')`) met een gewone `<a download>` als fallback.

## Doel van deze sessie / volgende stap

Nicky gaat dit weekend vissen met een vriend (Android) en wil daar testen. Plan dat met Nicky is afgesproken:

1. **Eén codebasis** (de web-app) → **PWA via GitHub Pages** (`bluntdevs.github.io/CatchBook`) voor iPhone-testers en snelle ontwerptests, en **apk via Capacitor + GitHub Actions** voor Android. Later dezelfde Capacitor-app naar Play Store (AAB) en App Store (TestFlight; vereist Mac of macOS-runner + Apple Developer-account). Alles moet gratis blijven tot de stores.
2. Repository is **publiek** (nodig voor gratis Pages). Geen gebruikersdata in de repo. Ondertekeningssleutel van de apk **nooit** in de repo: als GitHub Secret. Vanaf versie 1 een **vaste** keystore, anders kunnen updates niet over de oude app en verliezen testers hun data.
3. App-ID en app-naam zijn gekozen (zie Vaste gegevens).
4. Bouwen met tussenlagen zodat de overstap later klein is: opslag-laag (nu IndexedDB/localStorage, later SQLite), GPS/camera-laag (nu browser-API, later Capacitor-plugins).
5. PWA: service worker (offline), manifest, iconen, versienummer in de app + melding "Nieuwe versie beschikbaar, tik om te vernieuwen".
6. GPS-knop echt laten werken (was in het artifact geblokkeerd), foto rechtstreeks met camera (`capture`).
7. Downloads in de PWA/apk via gewone bestanden (de artifact-capability bestaat daar niet; houd fallback).
8. Nicky moet zijn testsessies uit het artifact meenemen via JSON-back-up → importeren in de nieuwe app.

Daarna (na het weekend): sessieoverzicht visueel aantrekkelijker (foto per sessie, achtergrondfoto in de bovenbalk via instelling per gebruiker), Analyse-tab, omstandigheden automatisch ophalen (Open-Meteo, per uur, tijdlijn met slider en vangsten erop).

## App-structuur

Tabs (onderaan): **Vissen** (start/stop, lopende sessie-kaart met Voeg vangst toe, Verplaats stok, Misser, Bijgevoerd, Aas gewisseld, en de onderdelen met Bewerk), **Sessies** (zoeken, mini-overzicht, filters/sorteer/selecteer, lijst met fotocollage, detail met overzicht + uitklapbare onderdelen + tijdlijn + delen), **Analyse** (in opbouw), **Instellingen** (uitklaplijst: back-up/CSV, terugzetten, weergave, weegzak, namen opkuisen, alles wissen, over/updates/uitleg/wat is er nieuw).

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
