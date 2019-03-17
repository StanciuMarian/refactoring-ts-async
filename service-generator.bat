rmdir service-generator\output\api /Q /S
mkdir service-generator\output\api 
mkdir service-generator\output\api\dto
xcopy refactoring-ts-async\src\app\api\** service-generator\output\api /E /Y
cd service-generator
call  npm start
timeout /T 10
xcopy output\api\** ..\refactoring-ts-async\src\app\api /E /Y
rmdir output\api /Q /S
