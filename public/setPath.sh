#!/bin/bash
# A script to set the template string __BASE_URL__

# Quit if the parameter is empty
[[ -z "$1" ]] && { echo "No path was entered." ; exit 1; }
[[ "${1: -1}" == "/" ]] && { echo "Trailing slash detected. " ; exit 1; }
# First arg is the base url
BASEURL=$(printf "%q" "$1")
# Check to make sure argument exists. Quit otherwise.
echo 'It looks like you want to change __BASE_URL__ to' $BASEURL
echo 'Please check to make sure that you are expressing your path in the format /my/awesome/path'
echo 'with no trailing slash.'
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo 'Changing __BASE_URL__ to' $BASEURL
    # Copy the index just in case
    cp -rf index.html index.html.old
    # Filter the old index, writing to index.html
    cat index.html.old | sed 's%__BASE_URL__%'$BASEURL'%g' >index.html
    # Since the JS Bundle has a randome hash, use find to pattern match
    JSBUNDLE="$(find ./static/js -name 'main.*.js')"
    # Copy the JS bundle just in case
    cp -rf  $JSBUNDLE $JSBUNDLE.old
    # Filter the old JS bundle, writing to the normal JS bundle
    cat $JSBUNDLE.old | sed 's%__BASE_URL__%'$BASEURL'%g' >$JSBUNDLE
fi
