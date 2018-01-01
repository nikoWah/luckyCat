#!/bin/bash

PATH="/home/pi/.nvm/versions/node/v4.8.7/bin:$PATH"
ps aux | grep -ie "3001 --subdomain luckycat" | awk '{print $2}' | xargs kill -9
fuser -k 3001/tcp
cd /home/pi/Project/luckyCat
lt --port 3001 --subdomain "luckycat66" &
npm start &

exit 0
