#!/bin/sh

npm start &

sleep 10

npm run migrate:dev

wait %1
