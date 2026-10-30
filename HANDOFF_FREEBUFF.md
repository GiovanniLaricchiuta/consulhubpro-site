# ConsulHub Pro — passaggio tecnico locale del 30 ottobre 2026

Branch: `handoff/freebuff-premium-20261030`. Base pubblicata immutabile: `c696014ce6acf7dc6b9352de35cdd4202c35e0e4`.

## Stato e limiti di autorizzazione

Il pacchetto conserva 45 pagine principali: homepage invariata e 44 sottopagine aggiornate localmente. Comprende i due campioni approvati Per Studi e Servizi, con fotografie e interazioni. Le altre 42 pagine hanno ricevuto l’estensione grafica; non sono state dichiarate definitivamente approvate o interamente collaudate. Non effettuare push, merge o pubblicazione senza successiva autorizzazione del titolare.

La vecchia pipeline `full-premium/` e i materiali storici completi restano nel backup privato. Non sono necessari per visualizzare, ricostruire o verificare questa estensione: i suoi input sono inclusi qui. Non ricompilare i vecchi generatori sopra questi file.

## Avvio e controlli, senza installazioni di pacchetti

Serve Node.js 22 o successivo. Non serve `npm install`; non ci sono dipendenze npm. Git serve soltanto per gestire il branch e la cronologia, non per avviare il sito o ricostruire le pagine.

```text
node design-tools/serve.mjs
```

Anteprima: `http://127.0.0.1:4192/`. Il server è vincolato al computer locale; aggiunge un header noindex solo all’anteprima, senza cambiare le direttive SEO dei file. Nasconde metadati Git e strumenti di sviluppo e supporta le richieste parziali del video originale.

```text
node design-tools/extend.mjs
node release-checks/verify.mjs
node design-tools/http-check.mjs
```

I medesimi comandi sono disponibili come `npm run build`, `npm run check` e `npm run check:http`. La baseline `design-tools/base-c696014.json.gz` contiene gli HTML originali e il manifest del commit pubblico; la sua impronta è verificata da `base.mjs`. Non dipende da directory delivery, checkout esterni, Python o archivi esclusi dal pacchetto.

## File da usare nello sviluppo

- `inner-premium.css` e `inner-premium.js`: linguaggio visivo e interazioni delle 42 pagine estese.
- `design-tools/extend.mjs`: composizioni e trasformazioni reversibili. L’inverso deve restituire il contenuto tecnico originale.
- `samples.css`, `samples.js`, `per-studi.html`, `servizi.html`, `sample-photos/`: campioni approvati, protetti da `approved-samples.json`.
- `inner-media/`: nuove risorse selezionate per l’estensione. `media/`, `assets/` e `film/`: risorse della base pubblicata conservate.
- `design-tools/PHOTOGRAPHY.md` e `photography.json`: fonti e licenze delle immagini.
- `release-checks/`: controlli di produzione, SEO, Form.taxi e congelamento delle risorse.

Le risorse pubbliche storiche e gli alias sono conservati per continuità degli URL. Sono esclusi i vecchi rapporti operativi non necessari. Non importare nel branch profili browser, cookie, sessioni, cache, log, backup, registrazioni grezze, node_modules o credenziali.

## Decisioni da preservare

Homepage, testi, CTA, logo, video originale, rete animata, palette e tipografia approvati. Tutti i contenuti tecnici, i sei ambiti con 25 servizi, i tre pilastri, Blog, collegamenti e metadati. Form.taxi, destinatario, campi e validazione, iubenda e link alle informative restano identici alla base. Non aggiornare le impronte per aggirare un errore.

Macroaree: percorsi tra servizi esistenti, focus da tastiera e attivazione delle connessioni. Servizi: varianti dossier, focus e processo. Articoli e Blog: impaginazione editoriale e copertine. Pilastri: percorsi verso i capitoli e collegamenti coordinati. Perché CHP: fotografia del modello e tab dei ruoli. Contatti: presentazione diretta e modulo invariato. Movimento ridotto supportato; contenuti e link restano disponibili senza JavaScript.

## Collaudo da completare

`design-tools/QA_PENDING.json` conserva soltanto la copertura storica documentata: 25 pagine desktop con scorrimento completo. Mancano il resto del desktop e il ciclo complessivo mobile/tablet. I campioni erano stati verificati separatamente e approvati; ciò non sostituisce il collaudo delle altre pagine.

Completare tastiera, touch, reduced motion, overflow, leggibilità, immagini, menu, tab, diagrammi, percorsi tra competenze, indice mobile e passaggi verso CTA. Annotare pagine, viewport, azioni ed errori effettivamente osservati; non dichiarare verifiche non eseguite.

Non inviare test reali del modulo da localhost: il provider autorizza il dominio pubblico. Per controllare invii e messaggi in sviluppo usare intercettazioni locali/mock senza chiamare il provider. Nessun invio reale è stato eseguito nella preparazione del pacchetto. La ricezione pubblica già confermata dal titolare non equivale a un nuovo test in questo pacchetto.

Non modificare impostazioni iubenda, DNS o GitHub Pages. Il pacchetto mantiene i dati societari, i recapiti, le attribuzioni fotografiche e le recensioni autentiche già pubblici e necessari al sito; non contiene dati dei precedenti test del modulo.

## Archivio e cronologia

La ZIP di consegna contiene solo file versionati, senza .git, cache o profili. Il bundle separato contiene il branch e gli antenati pubblici di c696014: permette di recuperare la cronologia senza il repository locale originario. Entrambi sono corredati da checksum. Il backup integrale privato non fa parte del pacchetto di passaggio e non va caricato su repository remoti.

Nessun trasferimento o pubblicazione è autorizzato da questo documento.
