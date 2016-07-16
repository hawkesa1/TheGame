@echo off
ECHO Started Audio Convert Script

SET AUDIO_CONVERT_EXECUTABLE="C:\Program Files (x86)\NCH Software\Switch\switch.exe"
SET TARGET_FOLDER="C:\Users\Hawkes\Desktop\TestConvFolder"
SET SOURCE_AUDIO_FILE="C:\Users\Hawkes\Desktop\04 Zombie.m4a"

CALL audioConvert1.bat %AUDIO_CONVERT_EXECUTABLE% %TARGET_FOLDER% %SOURCE_AUDIO_FILE%

ECHO Finished Audio Convert Script