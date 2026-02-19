#!/bin/bash

echo "Starting map server..."
echo "This window must remain open while playing."
echo

"./server/pmtiles"  serve ./server --port 8081 --cors="*"

if [ $? -ne 0 ]; then
    echo
    echo "Error: Could not start pmtiles"
    read -p "Press enter to continue"
fi
