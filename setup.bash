#!/bin/bash
echo "Enter mysql user: "
read USERNAME
echo "Enter mysql pass: "
read PASSWORD
echo "Enter mysql database name: "
read DATABASE
echo "What port should api run on: "
read PORT

echo "Setting up database"
mysql -u $USERNAME -p$PASSWORD -e "CREATE DATABASE IF NOT EXISTS ${DATABASE};"
echo "Setting up database and tables"
mysql  $DATABASE -u $USERNAME -p$PASSWORD < ./db/tables.sql;
echo "Setting up views"
mysql $DATABASE -u $USERNAME -p$PASSWORD < ./db/views.sql;
echo "Creating config.json"
echo '{"DB": {"HOST": "localhost", "USER": "'${USERNAME}'", "PASSWORD": "'${PASSWORD}'", "DATABASE_NAME": "'$DATABASE'"}, "PORT": '$PORT'}' > config.json
