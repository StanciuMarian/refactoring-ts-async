rmdir swagger-api-generator\output\api /Q /S
mkdir swagger-api-generator\output\api 
mkdir swagger-api-generator\output\api\dto
xcopy refactoring-ts-async\src\app\api\** swagger-api-generator\output\api /E /Y
cd swagger-api-generator
call  npm start
timeout /T 10
xcopy output\api\** ..\refactoring-ts-async\src\app\api /E /Y
rmdir output\api /Q /S
cd .. 