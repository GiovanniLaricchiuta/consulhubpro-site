# ConsulHub Pro — design lock

Questo documento registra i vincoli approvati per il sito CHP. La lista deriva dalle richieste del titolare e dalla versione locale del branch `development/premium-completo-2026`; non aggiunge promesse, contenuti o scelte grafiche non documentate.

## Decisioni protette

- **Posizionamento della hero:** `BUSINESS INTEGRATOR` e `PER CONSULENTI DEL LAVORO`, preceduti da `CONSULHUB PRO`. La composizione e il colore del termine principale sono implementati da `full-premium/fine-tuning-01.mjs` e `full-premium/fine-tuning-01.css`.
- **Headline:** `Il cliente ti chiede altro.` La versione visuale è nella hero della homepage generata in `dist/completo/index.html`.
- **Identità grafica:** mantenere l'identità premium approvata presente nella homepage del branch, inclusi i componenti e gli stili esistenti. Le fonti di build sono `premium-home/`, `full-premium/` e i relativi trasformatori.
- **Claim:** `Le connessioni fanno la differenza.` Il concetto è espresso nella rete CHP della hero; il controllo protegge il markup e le risorse approvate della homepage.
- **Video originale CHP:** conservarlo come asset originale e mantenere la presentazione prevista dal sito. Il filmato originale attualmente servito è `dist/completo/film/chp-originale.mp4`; la relativa apertura è gestita da `dist/completo/film-originale.js`.
- **Pagine e contenuti:** preservare l'architettura, gli URL e i contenuti tecnici/editoriali di tutte le 45 pagine. L'inventario canonico è `full-premium/content.json` e la build è `full-premium/build.mjs`.
- **Informazione:** conservare le sei macroaree e i tre pilastri già presenti nel catalogo `src/content.mjs` e nel sito.
- **Partner e recensioni:** conservare i partner e le testimonianze autentici e le relative attribuzioni come risultano dai materiali del titolare e dalla versione approvata. Non inventare nomi, testi, qualifiche, valutazioni o collaborazioni.
- **Ambito delle modifiche:** nessuna modifica non richiesta a testi, CTA, immagini, video, partner, recensioni, sezioni, navigazione, URL o contenuti approvati.
- **Ambiente:** le modifiche autorizzate restano nel branch di sviluppo. Non modificare `main` e non pubblicare senza una richiesta esplicita.

## Controllo automatico

`full-premium/check-design-lock.mjs` confronta il sito generato con `full-premium/design-lock-approved.json`. La baseline registra le 45 pagine canoniche, il testo leggibile, i collegamenti, gli attributi e le risorse, oltre alle impronte SHA-256 dei file protetti e delle sorgenti di build rilevanti.

Il controllo è eseguito all'inizio e alla fine di `full-premium/build.mjs` e `full-premium/qa.mjs`. I comandi normali sono:

```powershell
npm run chp:check-design
npm run chp:build
npm run chp:qa
```

Una divergenza non autorizzata termina il comando con codice non zero e indica il percorso, le categorie coinvolte e, per i testi, un estratto della differenza. Il controllo non aggiorna mai la baseline durante build o QA.

Per accettare in futuro una modifica protetta occorrono un'autorizzazione esplicita del titolare e una revisione della differenza. Solo allora si può aggiornare la baseline con `node full-premium/check-design-lock.mjs --approve-snapshot --authorization "..."`; il motivo viene scritto nella baseline. Non usare questo comando per far passare una modifica non autorizzata.

## Stato al momento del blocco

La hero locale mostra già il posizionamento richiesto e l'headline protetta. La trasformazione `positioning` in `full-premium/fine-tuning-01.mjs` applica il posizionamento anche durante la generazione della homepage. La baseline iniziale è stata acquisita da questa versione locale, senza ricostruire o modificare le pagine interne.
