#!/bin/bash
mkdir -p target
for F in `find src -name '*.sbl'`
do
  TARGET=`dirname $F | sed -e 's/src/target/'`
  mkdir -p $TARGET
  sibilant $F -o $TARGET
done