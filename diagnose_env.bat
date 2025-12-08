@echo off
echo JAVA_VERSION > env_check.log
java -version 2>> env_check.log
echo. >> env_check.log
echo MVN_VERSION >> env_check.log
call mvn -version >> env_check.log 2>&1
echo. >> env_check.log
echo NODE_VERSION >> env_check.log
call node -v >> env_check.log 2>&1
echo. >> env_check.log
echo NPM_VERSION >> env_check.log
call npm -v >> env_check.log 2>&1
