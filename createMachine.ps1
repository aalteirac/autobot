$nm=$env:computername
$me=whoami
$r= Invoke-WebRequest -URI "http://localhost:8081/?machinename=$nm&robotname=bot-$nm&type=Development&user=$me"
$script:exitCode = (Start-Process -FilePath "C:\Program Files (x86)\UiPath\Studio\UiRobot.exe"  -RedirectStandardError "SortError.txt" -ArgumentList "--disconnect" -Passthru -Wait).ExitCode;  
$running = $true;
while( $running -eq $true ) {
    $running = ( ( Get-Process | where ProcessName -eq "UiRobot").Length -gt 0);
    Start-Sleep -s 1
}
$args="--connect -url https://win-hj42t3fg0nu -key $r"
Start-Process -FilePath "C:\Program Files (x86)\UiPath\Studio\UiRobot.exe"  -RedirectStandardError "SortError.txt" -ArgumentList $args