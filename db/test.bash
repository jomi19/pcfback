#!/bin/bash
USERNAME="root";
PASSWORD="joida2018"
mysql -u $USERNAME -p$PASSWORD < ./db/test.sql;

echo "TEST"