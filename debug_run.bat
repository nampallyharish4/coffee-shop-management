cd backend
start /B mvnw.cmd spring-boot:run > ..\backend.log 2>&1
cd ..\frontend
start /B npm start > ..\frontend.log 2>&1
