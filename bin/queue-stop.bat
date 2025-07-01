@echo off

title Stop-Queue-Server

if not "%JAVA8_HOME%" == "" set JAVA_HOME=%JAVA8_HOME%

set JAVA=java
if not "%JAVA_HOME%" == "" set JAVA=%JAVA_HOME%\bin\java

rem This will be the run directory
set RUN_DIR=%cd%

rem Move up 
cd ..

rem This will be the starting base directory
set START_BASE_DIR=%cd%
set START_RUN_DIR=%START_BASE_DIR%\bin

rem This will be the base directory
set APP_DIR=%START_BASE_DIR%\queue
set BASE_DIR=%APP_DIR%
set RUN_DIR=%APP_DIR%\bin


set JAVA_OPT="-Xmx256m -Dosiris.run.dir=%RUN_DIR% -Dosiris.base.dir=%BASE_DIR%"

"%JAVA%" "%JAVA_OPT%" -cp queue/lib/*;. com.rameses.server.Shutdown
pause
