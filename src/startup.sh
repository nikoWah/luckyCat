#!/bin/bash

cd /home/pi/Project/luckyCat
lt --port 3001 --subdomain "luckycat" &
npm start &

exit 0
