[CmdletBinding()]
param(
    [string[]]$Targets = @('1.1.1.1','8.8.8.8','github.com')
)

$results = foreach ($target in $Targets) {
    $ping = Test-Connection -ComputerName $target -Count 2 -Quiet
    $dns = if ($target -match '[A-Za-z]') {
        try { (Resolve-DnsName $target -ErrorAction Stop | Where-Object Type -eq 'A' | Select-Object -ExpandProperty IPAddress) -join ', ' } catch { 'DNS lookup failed' }
    } else { 'IP target' }
    [pscustomobject]@{
        Target = $target
        Reachable = $ping
        Resolution = $dns
    }
}

$results | Format-Table -AutoSize
