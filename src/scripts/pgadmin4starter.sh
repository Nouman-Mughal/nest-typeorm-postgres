#!/bin/bash






sudo docker run --name pgadmin4 -e PGADMIN_DEFAULT_EMAIL=noman.ahmad@bracketsltd.email -e PGADMIN_DEFAULT_PASSWORD=noman123 -p 5050:80 -d dpage/pgadmin4
