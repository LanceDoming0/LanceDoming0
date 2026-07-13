[CmdletBinding()]
param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\reports")
)

$ErrorActionPreference = 'SilentlyContinue'
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$jsonPath = Join-Path $OutputDirectory "PC-Health-$timestamp.json"
$textPath = Join-Path $OutputDirectory "PC-Health-$timestamp.txt"

function Get-SafeCimInstance {
    param([string]$ClassName)
    try { Get-CimInstance -ClassName $ClassName -ErrorAction Stop } catch { $null }
}

$computer = Get-SafeCimInstance Win32_ComputerSystem
$os = Get-SafeCimInstance Win32_OperatingSystem
$bios = Get-SafeCimInstance Win32_BIOS
$cpu = Get-SafeCimInstance Win32_Processor
$gpu = Get-SafeCimInstance Win32_VideoController
$disks = Get-SafeCimInstance Win32_LogicalDisk | Where-Object DriveType -eq 3
$physicalDisks = Get-PhysicalDisk
$adapters = Get-NetAdapter | Where-Object Status -eq 'Up'
$ipConfig = Get-NetIPConfiguration | Where-Object { $_.IPv4Address }
$hotfixes = Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10

$diskData = foreach ($disk in $disks) {
    $freePercent = if ($disk.Size) { [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1) } else { 0 }
    [ordered]@{
        Drive = $disk.DeviceID
        Label = $disk.VolumeName
        SizeGB = [math]::Round($disk.Size / 1GB, 1)
        FreeGB = [math]::Round($disk.FreeSpace / 1GB, 1)
        FreePercent = $freePercent
        LowSpaceWarning = $freePercent -lt 15
    }
}

$report = [ordered]@{
    GeneratedAt = (Get-Date).ToString('o')
    Computer = [ordered]@{
        Name = $env:COMPUTERNAME
        Manufacturer = $computer.Manufacturer
        Model = $computer.Model
        TotalMemoryGB = [math]::Round($computer.TotalPhysicalMemory / 1GB, 1)
    }
    OperatingSystem = [ordered]@{
        Caption = $os.Caption
        Version = $os.Version
        BuildNumber = $os.BuildNumber
        LastBootTime = $os.LastBootUpTime
        FreeMemoryGB = [math]::Round($os.FreePhysicalMemory / 1MB, 1)
    }
    BIOS = [ordered]@{
        Manufacturer = $bios.Manufacturer
        Version = ($bios.SMBIOSBIOSVersion -join ', ')
        ReleaseDate = $bios.ReleaseDate
    }
    Processor = @($cpu | ForEach-Object { [ordered]@{ Name=$_.Name.Trim(); Cores=$_.NumberOfCores; LogicalProcessors=$_.NumberOfLogicalProcessors; MaxClockMHz=$_.MaxClockSpeed } })
    Graphics = @($gpu | ForEach-Object { [ordered]@{ Name=$_.Name; DriverVersion=$_.DriverVersion; VideoMemoryGB=if($_.AdapterRAM){[math]::Round($_.AdapterRAM/1GB,1)}else{$null} } })
    LogicalDisks = @($diskData)
    PhysicalDisks = @($physicalDisks | ForEach-Object { [ordered]@{ FriendlyName=$_.FriendlyName; MediaType=$_.MediaType; HealthStatus=$_.HealthStatus; OperationalStatus=($_.OperationalStatus -join ', '); SizeGB=[math]::Round($_.Size/1GB,1) } })
    NetworkAdapters = @($adapters | ForEach-Object { [ordered]@{ Name=$_.Name; InterfaceDescription=$_.InterfaceDescription; LinkSpeed=$_.LinkSpeed; MacAddress=$_.MacAddress } })
    IPConfiguration = @($ipConfig | ForEach-Object { [ordered]@{ Interface=$_.InterfaceAlias; IPv4=($_.IPv4Address.IPAddress -join ', '); Gateway=($_.IPv4DefaultGateway.NextHop -join ', '); DNS=($_.DNSServer.ServerAddresses -join ', ') } })
    RecentHotfixes = @($hotfixes | ForEach-Object { [ordered]@{ HotFixID=$_.HotFixID; Description=$_.Description; InstalledOn=$_.InstalledOn } })
}

$report | ConvertTo-Json -Depth 8 | Set-Content -Path $jsonPath -Encoding UTF8

$summary = @()
$summary += "PC HEALTH REPORT"
$summary += "Generated: $($report.GeneratedAt)"
$summary += "Computer: $($report.Computer.Manufacturer) $($report.Computer.Model)"
$summary += "OS: $($report.OperatingSystem.Caption) Build $($report.OperatingSystem.BuildNumber)"
$summary += "Memory: $($report.Computer.TotalMemoryGB) GB"
$summary += ""
$summary += "DISK STATUS"
foreach ($disk in $diskData) {
    $warning = if ($disk.LowSpaceWarning) { ' [LOW SPACE]' } else { '' }
    $summary += "$($disk.Drive) $($disk.FreeGB) GB free of $($disk.SizeGB) GB ($($disk.FreePercent)% free)$warning"
}
$summary += ""
$summary += "NETWORK"
foreach ($adapter in $report.NetworkAdapters) { $summary += "$($adapter.Name): $($adapter.LinkSpeed)" }
$summary += ""
$summary += "Full structured report: $jsonPath"
$summary | Set-Content -Path $textPath -Encoding UTF8

Write-Host "Report created:" -ForegroundColor Green
Write-Host $textPath
Write-Host $jsonPath
