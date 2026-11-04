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
- **Offlineversion** — hela guiden som en enda HTML-fil som kan öppnas i webbläsaren utan internetuppkoppling, se [Offlineversion](#offlineversion)

## Teknikstack

- React + TypeScript
- Vite
- Inga körberoenden utöver React — all styling är inline
- Typsnitt (EB Garamond, DM Mono) via [Fontsource](https://fontsource.org), levererade från egen server
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) för offlinefilen
- Cloudflare Workers för hosting

## Offlineversion

För verksamheter som hanterar känsliga uppgifter finns hela guiden som en enda HTML-fil. Den kan användas på en dator utan internetuppkoppling. Webbversionen sparar eller skickar ingen data, men offlinefilen gör det möjligt att arbeta helt utan nätverk.

**Ladda ner:** via länken i sidfoten på [sakskydd.se](https://sakskydd.se), eller direkt från <https://sakskydd.se/sakskydd-offline> (sparas som `sakskydd-offline.html`, cirka 600 kB).

**Använda:** öppna filen i valfri modern webbläsare (dubbelklicka eller dra in den i ett webbläsarfönster). Allt fungerar som på webbplatsen, inklusive Markdown-export och utskrift.

**Innehåll:** JavaScript, CSS, typsnitt och ikon är inbäddade i filen. Den hämtar inget från internet. Externa länkar i sidfoten, till lagtext och Säkerhetspolisens vägledningar, öppnas bara om man klickar på dem.

**Uppdateringar:** filen uppdateras inte automatiskt. Ladda ner en ny kopia när guiden har ändrats, t.ex. efter lagändringar. Offlinefilen visar i sidfoten att det är en nedladdad kopia.

**Bygga själv:** den som vill granska koden kan bygga filen från källkoden i detta repo (se nedan) i stället för att ladda ner den.

## Bygga

```sh
pnpm install
pnpm dev      # utvecklingsserver
pnpm build    # bygger webbplatsen och offlinefilen
pnpm run deploy  # bygger och publicerar till Cloudflare
```

`pnpm build` kör `vite build` för webbplatsen och sedan `vite build --mode offline`. Det andra steget bygger offlinefilen `dist/client/sakskydd-offline.html` med allt inbäddat, och den publiceras tillsammans med webbplatsen. I koden avgör `import.meta.env.MODE === "offline"` vad som visas i sidfoten. Typsnitten levereras från egen server i båda versionerna, så inga anrop görs till Google Fonts.

## Dataskydd

Ingen data samlas in, lagras eller skickas till någon server. All information stannar lokalt i webbläsaren och försvinner när sidan stängs. För arbete helt utan nätverk, se [Offlineversion](#offlineversion).

## Disclaimer

Guiden är inte affilierad med Säkerhetspolisen eller Riksdagen och är baserad på öppen data. Den ska användas som stöd och vägledning, ej som ersättning för en korrekt säkerhetsskyddsanalys.

## Källor

- [Säkerhetsskyddslagen (2018:585)](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/sakerhetsskyddslag-2018585_sfs-2018-585/)
- [SÄPO PM – Vad är säkerhetskänslig verksamhet?](https://www.sakerhetspolisen.se/download/18.725e108e18dd2b2650a85/1775821485477/Vad%20%C3%A4r%20s%C3%A4kerhetsk%C3%A4nslig%20verksamhet.pdf)
- [SÄPO Vägledning – Säkerhetsskyddsanalys](https://sakerhetspolisen.se/download/18.3baf70bf187108c7cf04b7/1681802201089/Sa%CC%88kerhetskyddsanalys_anpassad.pdf)

## Licens

Erik Eliasson — erikeliasson (a) protonmail.com
