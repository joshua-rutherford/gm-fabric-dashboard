#!/bin/bash
# A script to set the template string __BASE_URL__

# Capture path of JS Bundle
pattern="static/js/main.*.js"
JS_BUNDLE=( $pattern )
echo $JS_BUNDLE

# Quit if the parameter is empty
[[ -z "$1" ]] && { echo "No path was entered." ; exit 1; }


# If parameter is undo, ask for confirmation and restore backup.
if [ "$1" == "undo" ]; then
    echo "It looks like you want to revert to a clean backup"
    read -p "Are you sure? " -n 1 -r
    echo    # (optional) move to a new line
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp -rf index.html.old index.html
        cp -rf $JS_BUNDLE.old $JS_BUNDLE
    fi
    exit 1
fi

echo "{$1}"
if [[ $1 != */gmadmin/ ]]
then
  echo 'Your path does not terminate in /gmadmin/'
  echo 'This path MUST terminate in /gmadmin/ to properly infer the absolute paths'
  echo 'of the metrics to scrape. The app uses a RegExp to replace /gmadmin/ with the following:'
  echo 'For JVM, /admin/metrics.json and /admin/threads'
  echo 'For Golang, /admin/metrics'
  exit 1
else  
  BASEURL=$(printf "%q" "$1")
  echo 'It looks like you want to deploy the dashboard to' $BASEURL
  echo 'The app uses a RegExp to replace /gmadmin/ with the following:'
  echo 'For JVM, /admin/metrics.json and /admin/threads'
  echo 'For Golang, /admin/metrics'
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
        cp -rf $JS_BUNDLE $JS_BUNDLE.old
    fi
    # Filter the old index, writing to index.html
    echo 'Changing __BASE_URL__ to' $BASEURL
    cat index.html.old | sed -E 's%__BASE_URL__[/]?%'$BASEURL'%g' >index.html
    cat $JS_BUNDLE.old | sed -E 's%__BASE_URL__[/]?%'$BASEURL'%g' >$JS_BUNDLE
fi
