#!/bin/bash
USERNAME="root";
PASSWORD="joida2018"
echo "Setting database"
mysql -u $USERNAME -p$PASSWORD < ./db/setup.sql;
echo "Setting up tables"
mysql -u $USERNAME -p$PASSWORD < ./db/tables.sql;
echo "Setting up views"
mysql -u $USERNAME -p$PASSWORD < ./db/views.sql;
