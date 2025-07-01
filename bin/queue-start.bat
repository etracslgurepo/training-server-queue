@echo off
if exist env.conf (
	for /f "delims=" %%x in (env.conf) do (
		set str=%%x
		if not "!str:~0,1!" == "#" set "%%x" 
	) 
) 

title Training-Queue-Server

if not "%JAVA8_HOME%" == "" set JAVA_HOME=%JAVA8_HOME%

set JAVA=java
if not "%JAVA_HOME%" == "" set JAVA=%JAVA_HOME%\bin\java

rem Move up 
cd ..

rem This will be the starting base directory
set START_BASE_DIR=%cd%
set START_RUN_DIR=%START_BASE_DIR%\bin

rem This will be the base directory
set REPO_DIR=%START_BASE_DIR%
set APP_DIR=%START_BASE_DIR%\queue
set BASE_DIR=%APP_DIR%
set RUN_DIR=%APP_DIR%\bin


set JAVA_OPT_XMX=1500
if not "%JAVA_XMX%" == "" set JAVA_OPT_XMX=%JAVA_XMX%

set JAVA_OPT="-Xms512m -Xmx%JAVA_OPT_XMX%m -Dosiris.run.dir=%RUN_DIR% -Dosiris.base.dir=%BASE_DIR% -Dosiris.repo.dir=%REPO_DIR%"

echo .=================================================================
echo .
echo . Training Server (Queue)
echo .
echo . JAVA      : %JAVA% 
echo . JAVA_HOME : %JAVA_HOME% 
echo . JAVA_OPTS : %JAVA_OPT% 
echo .
echo .=================================================================
echo .


"%JAVA%" "%JAVA_OPT%" -cp queue/lib/*;. com.rameses.main.bootloader.MainBootLoader
pause