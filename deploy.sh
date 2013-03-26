#!/bin/bash

SOURCE=$(cd `dirname $0`; pwd)

# target location
TARGET=$1

if [ x$TARGET = x ]; then

cat <<EOF
Must supply target folder parameter, e.g.:

  deploy.sh /usr/palm/ilib
EOF
else
	mkdir -p $TARGET
	cp -r $SOURCE/ilib/locale/* $TARGET
fi
