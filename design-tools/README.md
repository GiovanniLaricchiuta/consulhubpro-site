# CHP — estensione delle pagine interne

Branch di passaggio locale: `handoff/freebuff-premium-20261030`. Provenienza dell’estensione: `design/internal-premium-2026-10-30`. Base pubblicata: `c696014ce6acf7dc6b9352de35cdd4202c35e0e4`. Istruzioni complete in `../HANDOFF_FREEBUFF.md`.

Autorizzazione: capitolato del titolare del 30 ottobre 2026. Le due pagine campione Per Studi e Servizi, incluse fotografie e interazioni, sono approvate e congelate; estensione autorizzata alle altre sottopagine, senza autorizzazione a merge o pubblicazione.

## Confini

- Homepage, relative sezioni FAQ, recensioni e partner, immagini, video e risorse originali restano identici alla base pubblicata. Nessuna duplicazione di queste sezioni in nuove pagine.
- Due campioni approvati mantenuti identici, protetti da SHA-256 in `approved-samples.json`.
- 42 altre pagine principali aggiornate. Informativa del modulo e alias storici mantenuti. Totale architettura principale: 45 pagine, di cui 44 sottopagine aggiornate.
- Metadati, canonical, sitemap, robots, contenuti tecnici, collegamenti originali, CTA, modulo e codice Form.taxi, Calendly, WhatsApp, social e iubenda conservati.
- Unica variazione di credito fotografico rispetto agli originali: Lead generation usa uno scatto marketing distinto, per eliminare il duplicato con Marketing e digitale. Il relativo collegamento al fotografo segue la nuova immagine.

## Varianti

Macroaree: composizione fotografica con percorso tra le competenze, ricavato esclusivamente dai servizi esistenti. Due composizioni coordinate, con grafi diversi per numero di servizi e macroarea.

Servizi: dossier a due colonne, apertura centrata sul processo con percorsi verso i capitoli, oppure composizione con immagine in primo piano a sinistra. Fotografie pertinenti già disponibili, senza riquadri con logo.

Pilastri: immagini, segni e percorsi verso i capitoli; indice dei tre pilastri con tre componenti di pari rilievo. Nessuna nuova condizione tecnica o prestazione attribuita ai pilastri.

Blog e articoli: indice editoriale navigabile, copertine originali, articolo in evidenza; aperture editoriali larghe o con immagine verticale, tipografia di lettura e indice compatto su mobile.

Perché CHP: fotografia documentata a Milano, sistema dei ruoli esistente conservato e trattato diversamente dal campione Per Studi.

Contatti: apertura più immediata, connessioni leggere e opzioni leggibili; modulo intatto. Nessuna fotografia aggiunta senza utilità narrativa.

## Movimento e accessibilità

SVG nativi, CSS e JavaScript locale: attivazione dei collegamenti al focus e al puntatore; comparsa delle sezioni; profondità leggera delle immagini sui dispositivi compatibili; progressione del percorso di lettura; indice mobile apribile da tastiera. Nessun nuovo servizio remoto, autoplay o libreria pesante. `prefers-reduced-motion` disattiva movimento e profondità; il contenuto è disponibile senza JavaScript.

## Controlli riproducibili

```powershell
node design-tools/extend.mjs
node design-tools/check.mjs
node release-checks/verify.mjs
```

Il builder legge la base immutabile compressa inclusa nel pacchetto, verificata da `base.mjs`, applica le sole trasformazioni autorizzate e verifica che, eliminandole, si riottenga esattamente il contenuto di origine. Non richiede Git, Python o checkout esterni per la ricostruzione. Non aggiorna automaticamente i blocchi delle due pagine campione. Il controllo verifica tutti i file originali protetti, i 45 head SEO, il modulo, le immagini, i riferimenti locali e gli elementi già approvati. Il report generato `check-results.json` è locale e ignorato da Git; `QA_PENDING.json` documenta la copertura storica del browser e i controlli ancora da completare.

Le impronte nel manifest di rilascio identificano la candidata di questo branch; non equivalgono all’approvazione finale del titolare né autorizzano la pubblicazione.
