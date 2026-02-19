# Scotland Cities – Subway Builder Mod
The mod is compatible with API version 1.0.0.

### DISCLAIMER: BEFORE INSTALLING THE MOD, READ EVERYTHING CAREFULLY.

Includes the Scottish cities of:
- Dundee

### SOME NOTES:
- The installation of the mod is entirely manual, so follow the instructions to the letter, if you have any problems or doubts do not hesitate to contact me
- I haven't fully tested the city yet; I hope it performs decently for gameplay. If not, let me know and I will try to regenerate the demand data to make it more playable
- Resident and worker data are entirely procedurally generated and do not reflect real data; they are completely the result of heuristics and various simulation attempts so that they would appear plausible
- The maps do NOT contain the "foundation" layer for any city, so station construction depends only on the road layer (maybe I'll add it sooner or later)
- The maps do NOT contain the "ocean" layer for any city; in this case as well, water is only a visual element and does not affect gameplay (maybe I'll add it sooner or later)
- In the map you may see buildings without any pop; this is normal because to generate the data I used a "mask", so buildings located outside this mask have no residents or workers (the buildings are still present due to the method I used to download the pmtiles)

### OTHER:
- If you have suggestions on how to improve the maps or if you want to contribute, feel free to contact me
- I was thinking about adding more Scottish cities in the future. If you have suggestions or wishes about which cities to add, let me know

### HOW TO INSTALL (WINDOWS):
1. Download the files from this repository
2. Unzip the downloaded files and you will find:
    - data (the folder containing the city data)
    - scotland-cities (the folder containing the mod files)
    - server (the folder containing the server files)
    - server.bat (the script to start the server on Windows)
    - README.md (this file)
3. Copy <b>THE FOLDER</b> "scotland-cities" into the game's "mods" folder (it is usually located at "C:\Users\[Username]\AppData\Roaming\metro-maker4\mods")
4. Copy <b>THE CONTENTS</b> of the "data" folder into the game's "data" folder (it is usually located at "C:\Users\[Username]\AppData\Roaming\metro-maker4\cities\data")
5. Start the server using the "server.bat" script (a terminal window should open showing the server logs, and the first time it will ask you to authorize network access—make sure to allow it)
6. Launch the game, go to Settings > Settings > Mod Manager, and make sure the "Scotland Cities" mod is enabled
7. Press "Reload Mods"
8. You should now see a new "Scotland" tab on the city selection screen. Click on it and you should see the Scottish cities included in the mod. Select the one you prefer and enjoy!
9. Every time you want to play with the Scottish cities, make sure to start the server first using the "server.bat" script; otherwise, the cities will not be available (the server is necessary to provide the map data to the game)

### HOW TO INSTALL (MAC):
1. Download the files from this repository
2. Unzip the downloaded files and you will find:
    - data (the folder containing the city data)
    - scotland-cities (the folder containing the mod files)
    - server (the folder containing the server files)
    - server.sh (the script to start the server on Mac)
    - README.md (this file)
3. Go to this [link](https://github.com/protomaps/go-pmtiles/releases) and download the appropriate version of pmtiles:
    - if you have a Mac M1 or later, download "go-pmtiles-1.30.0_Darwin_arm64.zip"
    - if you have a Mac Intel, download "go-pmtiles-1.30.0_Darwin_x86_64.zip"
4. Unzip the downloaded file and move the "pmtiles" file into the mod folder called "server"
5. Open Finder, press CMD + SHIFT + G, paste "~/Library/Application Support/metro-maker4/mods", and press Enter
6. Copy THE FOLDER "scotland-cities" into this folder
7. Press CMD + SHIFT + G, paste "~/Library/Application Support/metro-maker4/cities/data", and press Enter
8. Copy THE CONTENTS of the "data" folder into this folder
9. Open Terminal (you can go to the Applications and type "Terminal" to find it)
10. Navigate to the folder you unzipped at the beginning (if it's in Downloads, just type "cd 'Downloads/Scotland Subway Builder'")
11. Copy "chmod +x ./server.sh" into the terminal and press Enter
12. Copy "./server.sh" into the terminal and press Enter
13. Launch the game, go to Settings > Settings > Mod Manager, and make sure the "Scotland Cities" mod is enabled
14. Press "Reload Mods"
15. You should now see a new "Scotland" tab on the city selection screen. Click on it and you should see the Scottish cities included in the mod. Select the one you prefer and enjoy!
16. Every time you want to play, you will need to open the terminal, navigate to the "Scotland Subway Builder" folder, and type "./server.sh"
