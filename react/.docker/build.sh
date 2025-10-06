#!/bin/sh
RUN_DIR=`pwd`
cd ..
BASE_DIR=`pwd`
echo ""
echo "building..."
docker rmi -f ramesesinc/queue-server:2.5.03.01
echo ""
docker build --no-cache -f $BASE_DIR/Dockerfile -t ramesesinc/queue-server:2.5.03.01 .
echo ""
echo "done."
cd $RUN_DIR
