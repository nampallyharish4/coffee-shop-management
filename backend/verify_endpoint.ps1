$maxRetries = 30
$retryDelaySeconds = 2
$url = "http://localhost:8081/api/inventory"

for ($i = 0; $i -lt $maxRetries; $i++) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "Success: Endpoint is up! Status Code: $($response.StatusCode)"
            exit 0
        }
    } catch {
        Write-Host "Waiting found backend... ($($i + 1)/$maxRetries)"
        Start-Sleep -Seconds $retryDelaySeconds
    }
}
Write-Host "Error: Endpoint failed to respond after $maxRetries attempts."
exit 1
