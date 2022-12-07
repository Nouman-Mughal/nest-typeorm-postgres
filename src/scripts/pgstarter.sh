#!/bin/bash
set -e

SERVER="postgres-nest";
PW="noman123";
DB="postgres";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(sudo docker kill $SERVER || :) && \
  (sudo docker rm $SERVER || :) && \
  sudo docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5431:5432 \
  -d postgres

sleep 3

# create the db 
sudo docker exec -i $SERVER psql -U postgres
echo "\l" | sudo docker exec -i $SERVER psql -U postgres


