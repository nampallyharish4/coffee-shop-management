@echo off
cd backend
echo STARTING BUILD
call mvn clean package -DskipTests
echo BUILD FINISHED
