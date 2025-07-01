@echo off

title Set-LGU-Data Script

mysql -u root -p -P 3306  -D training_etracs_2_5_05_03  <  script.sql

pause