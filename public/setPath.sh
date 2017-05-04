#!/bin/bash
# A script to set the template string __BASE_URL__

# Quit if the parameter is empty
[[ -z "$1" ]] && { echo "No path was entered." ; exit 1; }

# If parameter is undo, ask for confirmation and restore backup.
if [ "$1" == "undo" ]; then
    echo "It looks like you want to revert to a clean backup"
    read -p "Are you sure? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp -rf index.html.old index.html
    fi
    exit 1
fi

echo "{$1}"
if [ "$1" == "/" ]
then
   BASEURL=""
   echo 'It looks like you want to add the dashboard to a microservice at root'
   echo 'This is the default behavior, so no change is needed'
   exit 1
else  
    BASEURL=$(printf "%q" "$1")
    echo 'It looks like you want to add the dashboard to a microservice at' $BASEURL
    echo 'This means that the dashboard would be served at' $BASEURL'gmadmin/'
    echo 'and would poll the endpoints at' $BASEURL'admin/metrics.json and' $BASEURL'admin/threads'
fi
# Check to make sure argument exists. Quit otherwise.

read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # If the backup doesn't exist, copy the index just in case
    if [ -f './index.html.old' ]; then
        echo 'Backup already detected.'
    else
        echo 'Backing up clean index.html'
        cp -rf index.html index.html.old
    fi
    # Filter the old index, writing to index.html
    echo 'Changing __BASE_URL__ to' $BASEURL
    cat index.html.old | sed 's%__BASE_URL__%'$BASEURL'%g' >index.html
fi
