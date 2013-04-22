#!/bin/bash

SOURCE=$(cd `dirname $0`; pwd)

# target location
TARGET=$1

if [ x$TARGET = x ]; then

cat <<EOF
Must supply target folder parameter, e.g.:

  deploy.sh ../deploy/ilib/enyo-ilib
EOF
else
	echo enyo-ilib: deploying $SOURCE/ilib/locale to $TARGET
	mkdir -p $TARGET/ilib/locale
	
	# only copy the languages/countries that we need
	cp -r $SOURCE/ilib/locale/* $TARGET/ilib/locale
fi
