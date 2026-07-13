# Windows PC Health Toolkit

Read-only PowerShell utilities for collecting a basic Windows PC health report and checking network connectivity.

## Tools

### `Get-PCHealthReport.ps1`

Collects:

- Windows version and last boot time
- Computer manufacturer, model, and memory
- CPU and graphics information
- Logical disk capacity and low-space warnings
- Physical disk health status when available
- Active network adapters, IP, gateway, and DNS information
- Recent Windows hotfixes

Outputs a readable text summary and a structured JSON report.

### `Test-NetworkBasics.ps1`

Performs simple reachability and DNS-resolution checks against configurable targets.

## Usage

Open PowerShell and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\Get-PCHealthReport.ps1
.\scripts\Test-NetworkBasics.ps1
```

Reports are created locally in a `reports` directory, which is excluded from Git.

## Safety

- Scripts are read-only and do not modify Windows settings.
- Review any script before running it.
- Reports may contain device names, IP addresses, MAC addresses, or hardware details. Do not upload generated reports publicly without reviewing and removing sensitive information.

## Skills Demonstrated

- Windows troubleshooting workflow
- PowerShell scripting
- Hardware and storage reporting
- Basic networking diagnostics
- Structured JSON output

## Author

Lance Albert D. Aganon — IT Support Technician and Computer Technician
