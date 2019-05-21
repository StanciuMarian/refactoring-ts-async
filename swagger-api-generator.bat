rmdir swagger-api-generator\output\api /Q /S
mkdir swagger-api-generator\output\api 
mkdir swagger-api-generator\output\api\dto
xcopy coupon-ts\src\app\api\** swagger-api-generator\output\api /E /Y
cd swagger-api-generator
call  npm start
rem timeout /T 10
xcopy output\api\** ..\coupon-ts\src\app\api /E /Y
rmdir output\api /Q /S
cd .. 