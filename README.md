# English
The mod is compatible with API version 1.0.0.

### DISCLAIMER: BEFORE INSTALLING THE MOD, READ EVERYTHING CAREFULLY.

Includes the Italian cities of:
- Bari
- Bologna
- Cagliari
- Catania
- Florence
- Genoa
- Modena
- Milan
- Naples
- Palermo
- Padua
- Rome
- Turin
- Venice
- Verona

### SOME NOTES:
- The installation of the mod is entirely manual, so follow the instructions to the letter, if you have any problems or doubts do not hesitate to contact me
- I haven’t tested all the cities yet; I hope they perform decently for gameplay. If not, let me know and I will try to regenerate the demand data to make them more playable
- Resident and worker data are entirely procedurally generated and do not reflect real data; they are completely the result of heuristics and various simulation attempts so that they would appear plausible
- The maps do NOT contain the "foundation" layer for any city, so station construction depends only on the road layer (maybe I’ll add it sooner or later)
- The maps do NOT contain the "ocean" layer for any city; in this case as well, water is only a visual element and does not affect gameplay (maybe I’ll add it sooner or later)
- The included cities were chosen solely based on their population (I tried to include cities with more than 500k inhabitants, and for some I artificially increased the population to reach this threshold)
- Generally, except for a few cases, I considered only the main municipality + the first ring of neighboring municipalities and calculated the population accordingly
- In several maps you may see buildings without any pop; this is normal because to generate the data I used a “mask” (main municipality + first ring of neighboring municipalities), so buildings located outside this mask have no residents or workers (the buildings are still present due to the method I used to download the pmtiles)

### KNOWN BUGS:
- If you have already installed the Canadian cities mod, there are conflicts regarding some city file names (Torino and Toronto have the same ids in the game)

### OTHER:
- If you have suggestions on how to improve the maps or if you want to contribute, feel free to contact me
- I was thinking about adding more cities in the future (including groups of cities, for example: Venice + Padua, Parma + Reggio Emilia + Modena, Brescia + Bergamo, etc.). If you have suggestions or wishes about which Italian cities to add, let me know

### HOW TO INSTALL (WINDOWS):
1. Download the files from this [link](https://drive.google.com/drive/folders/1KZAUy6pP4q98Qcqs__dlK2KHWHrGg2Xb?usp=sharing)
2. Unzip the downloaded files and you will find:
    - data (the folder containing the city data)
    - italian-cities (the folder containing the mod files)
    - server (the folder containing the server files)
    - server.bat (the script to start the server on Windows)
    - README.md (this file)
3. Copy <b>THE FOLDER</b> "italian-cities" into the game’s "mods" folder (it is usually located at "C:\Users\[Username]\AppData\Roaming\metro-maker4\mods")
4. Copy <b>THE CONTENTS</b> of the "data" folder into the game’s "data" folder (it is usually located at "C:\Users\[Username]\AppData\Roaming\metro-maker4\cities\data")
5. Start the server using the "server.bat" script (a terminal window should open showing the server logs, and the first time it will ask you to authorize network access—make sure to allow it)
6. Launch the game, go to Settings > Settings > Mod Manager, and make sure the "Italian Cities" mod is enabled
7. Press "Reload Mods"
8. You should now see a new "Italy" tab on the city selection screen Click on it and you should see all the Italian cities included in the mod. Select the one you prefer and enjoy!
9. Every time you want to play with the Italian cities, make sure to start the server first using the "server.bat" script; otherwise, the cities will not be available (the server is necessary to provide the map data to the game)

### HOW TO INSTALL (MAC):
1. Download the files from this [link](https://drive.google.com/drive/folders/1KZAUy6pP4q98Qcqs__dlK2KHWHrGg2Xb?usp=sharing)
2. Unzip the downloaded files and you will find:
    - data (the folder containing the city data)
    - italian-cities (the folder containing the mod files)
    - server (the folder containing the server files)
    - server.sh (the script to start the server on Mac)
    - README.md (this file)
3. Go to this [link](https://github.com/protomaps/go-pmtiles/releases) and download the appropriate version of pmtiles:
    - if you have a Mac M1 or later, download "go-pmtiles-1.30.0_Darwin_arm64.zip"
    - if you have a Mac Intel, download "go-pmtiles-1.30.0_Darwin_x86_64.zip"
4. Unzip the downloaded file and move the "pmtiles" file into the mod folder called "server"
5. Open Finder, press CMD + SHIFT + G, paste "~/Library/Application Support/metro-maker4/mods", and press Enter
6. Copy THE FOLDER "italian-cities" into this folder
7. Press CMD + SHIFT + G, paste "~/Library/Application Support/metro-maker4/cities/data", and press Enter
8. Copy THE CONTENTS of the "data" folder into this folder
9. Open Terminal (you can go to the Applications and type "Terminal" to find it)
10. Navigate to the folder you unzipped at the beginning (if it’s in Downloads, just type "cd 'Downloads/Italy Subway Builder'")
11. Copy "chmod +x ./server.sh" into the terminal and press Enter
12. Copy "./server.sh" into the terminal and press Enter
13. Launch the game, go to Settings > Settings > Mod Manager, and make sure the "Italian Cities" mod is enabled
14. Press "Reload Mods"
15. You should now see a new "Italy" tab on the city selection screen Click on it and you should see all the Italian cities included in the mod. Select the one you prefer and enjoy!
16. Every time you want to play, you will need to open the terminal, navigate to the "Italy Subway Builder" folder, and type "./server.sh"

<br><br>

# Italiano
La mod è compatibile con la versione 1.0.0 dell'API.

### DISCLAIMER: PRIMA DI INSTALLARE LA MOD LEGGETE ATTENTAMENTE TUTTO.

Include le città italiane di:
- Bari
- Bologna
- Cagliari
- Catania
- Firenze
- Genova
- Modena
- Milano
- Napoli
- Padova
- Palermo
- Roma
- Torino
- Venezia
- Verona

### ALCUNE NOTE:
- L'installazione della mod è tutta manuale, quindi seguite le istruzioni alla lettera, se avete problemi o dubbi non esitate a contattarmi
- Non ho ancora testato tutte le città, spero che funzionino decentemente per il gameplay, in caso contrario fatemi sapere e cercherò di rigenerare i dati della domanda in modo da renderle più giocabili
- I dati sui residenti e lavoratori sono interamente generati in modo procedurale e non riflettono dati reali; sono totalmente frutto di euristiche e di vari tentativi di simulazione in modo che sembrassero plausibili
- Le mappe NON contengono il layer "foundation" per nessuna città, quindi la costruzione delle stazioni dipende solo dal layer stradale (forse prima o poi lo aggiungerò)
- Le mappe NON contengono il layer "ocean" per nessuna città, anche in questo caso l'acqua è solo un elemento grafico e non incide sul gameplay (forse prima o poi lo aggiungerò)
- Le citta incluse sono state scelte unicamente in base alla loro popolazione (ho cercato di includere città con più di 500k abitanti e per alcune ho aumentato artificialmente la popolazione per raggiungere questa soglia)
- Generalmente, tranne per alcuni casi, ho considerato solo il comune principale + la prima corona di comuni limitrofi e ho calcolato gli abitanti di conseguenza
- In diverse mappe è possibile vedere edifici senza alcun pop, questo è normale poichè per generare i dati ho usato una "maschera" (comune principale + prima corona di comuni limitrofi) e quindi gli edifici che si trovano fuori da questa maschera non hanno abitanti o lavoratori (gli edifici sono comunque presenti a causa del metodo che ho usato per scaricare le pmtiles)

### BUG NOTI:
- Se avete gia installato la mod delle città canadesi ci sono dei conflitti per quanto riguardano alcuni nomi dei file delle città (Torino e Toronto hanno gli stessi id nel gioco)

### ALTRO:
- Se avete suggerimenti su come migliorare le mappe o se volete contribuire, non esitate a contattarmi
- Stavo pensando di aggiungere altre città in futuro (incluso gruppi di città, per esempio: Venezia + Padova, Parma + Reggio Emilia + Modena, Brescia + Bergamo, ecc...), se avete suggerimenti o desideri su quali città italiane aggiungere, fatemelo sapere

### COME INSTALLARE (WINDOWS):
1. Scaricate i file da questo [link](https://drive.google.com/drive/folders/1KZAUy6pP4q98Qcqs__dlK2KHWHrGg2Xb?usp=sharing)
2. Unzippate la cartella e troverete:
    - data (la cartella con i dati delle città)
    - italian-cities (la cartella con i file della mod)
    - server (la cartella con i file del server)
    - server.bat (lo script per avviare il server su Windows)
    - README.md (questo file)
3. Copiate <b>LA CARTELLA</b> "italian-cities" all'interno della cartella "mods" del gioco 
    - su Windows si trova in "C:\Users\\[NomeUtente]\AppData\Roaming\metro-maker4\mods"
    - su Mac si trova in "~/Library/Application Support/metro-maker4/mods"
4. Copiate <b>IL CONTENUTO</b> della cartella "data" all'interno della cartella "data" del gioco
    - su Windows si trova in "C:\Users\\[NomeUtente]\AppData\Roaming\metro-maker4\cities\data"
    - su Mac si trova in "~/Library/Application Support/metro-maker4/cities/data"
5. Avviate il server usando lo script "server.bat" (dovrebbe aprirsi una finestra del terminale che mostra i log del server e la prima volta vi chiederà di autorizzare l'accesso alla rete, assicuratevi di autorizzarlo)
6. Avviate il gioco, andate in Impostazioni > Settings > Mod Manager e assicuratevi che la mod "Italian Cities" sia abilitata
7. Premete "Reload Mods"
8. Ora dovreste vedere una nuova Tab "Italy" nella schermata di selezione della città, cliccateci sopra e dovreste vedere tutte le città italiane incluse nella mod, selezionate quella che preferite e buon divertimento!
9. Ogni volta che vorrete giocare con le città italiane, assicuratevi di avviare prima il server usando lo script "server.bat", altrimenti le città non saranno disponibili (il server è necessario per fornire i dati delle mappe al gioco)

### COME INSTALLARE (MAC):
1. Scaricate i file da questo [link](https://drive.google.com/drive/folders/1KZAUy6pP4q98Qcqs__dlK2KHWHrGg2Xb?usp=sharing)
2. Unzippate la cartella e troverete:
    - data (la cartella con i dati delle città)
    - italian-cities (la cartella con i file della mod)
    - server (la cartella con i file del server)
    - server.sh (lo script per avviare il server su Mac)
    - README.md (questo file)
3. Andare al [link](https://github.com/protomaps/go-pmtiles/releases) e scaricare la giusta versione di pmtiles:
    - se Mac M1 in avanti "go-pmtiles-1.30.0_Darwin_arm64.zip"
    - se Mac Intel "go-pmtiles-1.30.0_Darwin_x86_64.zip"
4. Unzippare la cartella appena scaricata e spostare il file "pmtiles" dentro alla cartella della mod chiamata server
5. Aprire il finder, premere CMD + SHIFT + G, incollare "~/Library/Application Support/metro-maker4/mods" e premere invio
6. Copiate LA CARTELLA "italian-cities" all'interno di questa cartella
7. Premere CMD + SHIFT + G, incollare "~/Library/Application Support/metro-maker4/cities/data" e premere invio
8. Copiate IL CONTENUTO della cartella "data" all'interno di questa cartella
9. Apri il terminale (basta andare nelle app e digitare "Terminale")
10. Naviga le cartelle fino alla cartella che hai unzippato all'inizio (se è nei download basta scrivere "cd 'Downloads/Italy Subway Builder'")
11. Copia "chmod +x ./server.sh" nel terminale e dai invio
12. Copia "./server.sh" nel terminale e dai invio
13. Avviate il gioco, andate in Impostazioni > Settings > Mod Manager e assicuratevi che la mod "Italian Cities" sia abilitata
14. Premete "Reload Mods"
15. Ora dovreste vedere una nuova Tab "Italy" nella schermata di selezione della città, cliccateci sopra e dovreste vedere tutte le città italiane incluse nella mod, selezionate quella che preferite e buon divertimento!
16. Ogni volta che dovrete giocare dovrete aprire il terminale, navigare fino alla cartella "Italy Subway Builder" e scrivere sul terminale "./server.sh"