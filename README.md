# sakskydd.se

Webbverktyg för att bedöma om en verksamhet bedriver säkerhetskänslig verksamhet enligt säkerhetsskyddslagen (2018:585).

## Funktionalitet

- **Screening i två delar** — Del A (starka indikationer) och Del B (indikatorer) med ja/nej-frågor baserade på Säkerhetspolisens vägledning
- **Nationell skadekonsekvens** — uppföljningsfråga vid behov
- **Verksamhetskategorier** — välj vilka kategorier av säkerhetskänslig verksamhet som är relevanta
- **Skyddsvärden och nivåer** — identifiera skyddsvärden och bedöm konsekvensnivå
- **Skyddsperspektiv** — konfidentialitet, riktighet, tillgänglighet
- **Resultat med bedömning** — sammanställning med Femstegsmetoden, skyldigheter enligt lagen (i lydelse t.o.m. SFS 2026:764) och sanktionsavgifter
- **Markdown-export** — ladda ner bedömningen som Markdown-fil
- **Utskriftsvänlig** — anpassad för print via webbläsaren
- **Offlineversion** — hela guiden som en enda HTML-fil (`/sakskydd-offline`) som kan öppnas i webbläsaren utan internetuppkoppling

## Teknikstack

- React + TypeScript
- Vite
- Inga externa beroenden utöver React — all styling är inline

## Bygga

`pnpm build` bygger både webbplatsen och offlinefilen `dist/client/sakskydd-offline.html` (via `vite build --mode offline`, med JavaScript, CSS och typsnitt inbäddade). Typsnitten levereras från egen server i båda versionerna, så inga anrop görs till Google Fonts.

## Dataskydd

Ingen data samlas in, lagras eller skickas till någon server. All information stannar lokalt i webbläsaren och försvinner när sidan stängs.

## Disclaimer

Guiden är inte affilierad med Säkerhetspolisen eller Riksdagen och är baserad på öppen data. Den ska användas som stöd och vägledning, ej som ersättning för en korrekt säkerhetsskyddsanalys.

## Källor

- [Säkerhetsskyddslagen (2018:585)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/sakerhetsskyddslag-2018585_sfs-2018-585/)
- [SÄPO PM – Vad är säkerhetskänslig verksamhet?](https://www.sakerhetspolisen.se/download/18.725e108e18dd2b2650a85/1775821485477/Vad%20%C3%A4r%20s%C3%A4kerhetsk%C3%A4nslig%20verksamhet.pdf)
- [SÄPO Vägledning – Säkerhetsskyddsanalys](https://sakerhetspolisen.se/download/18.3baf70bf187108c7cf04b7/1681802201089/Sa%CC%88kerhetskyddsanalys_anpassad.pdf)

## Licens

Erik Eliasson — erikeliasson (a) protonmail.com
