# Azure Setup Script for Cloud Cafe
# Usage: .\azure-setup.ps1 -UniqueSuffix "yourname"

param (
    [Parameter(Mandatory=$true)]
    [string]$UniqueSuffix
)

$ResourceGroup = "CloudCafe-RG-$UniqueSuffix"
$Location = "westus2"
$MySqlServer = "cloudcafe-db-$UniqueSuffix"
$WebAppName = "cloudcafe-$UniqueSuffix"
$AppServicePlan = "CloudCafePlan"
$DBName = "coffee_shop"
$AdminUser = "coffee_admin"
$AdminPassword = "Coffee@Password123" # In production, change this or use a secret

Write-Host "1. Creating Resource Group: $ResourceGroup..."
az group create --name $ResourceGroup --location $Location

Write-Host "2. Creating MySQL Flexible Server: $MySqlServer..."
# Note: Creating a flexible server with public access for simplicity, restricted by firewall
az mysql flexible-server create --resource-group $ResourceGroup --name $MySqlServer --location $Location --admin-user $AdminUser --admin-password $AdminPassword --sku-name Standard_B1ms --tier Burstable --public-access 0.0.0.0 --storage-size 32

Write-Host "3. Creating database: $DBName..."
az mysql flexible-server db create --resource-group $ResourceGroup --server-name $MySqlServer --database-name $DBName

Write-Host "4. Creating App Service Plan..."
az appservice plan create --name $AppServicePlan --resource-group $ResourceGroup --is-linux --sku B1 --location $Location

Write-Host "5. Creating Web App (Java 17)..."
az webapp create --resource-group $ResourceGroup --plan $AppServicePlan --name $WebAppName --runtime "JAVA:17-java17"

Write-Host "6. Configuring App Settings..."
$ConnString = "jdbc:mysql://$MySqlServer.mysql.database.azure.com:3306/$DBName?useSSL=true`&requireSSL=false`&serverTimezone=UTC"

az webapp config appsettings set --resource-group $ResourceGroup --name $WebAppName --settings `
    "SPRING_DATASOURCE_URL=$ConnString" `
    "SPRING_DATASOURCE_USERNAME=$AdminUser" `
    "SPRING_DATASOURCE_PASSWORD=$AdminPassword" `
    "JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437" `
    "SPRING_JPA_HIBERNATE_DDL_AUTO=update"

Write-Host "=========================================================="
Write-Host "Azure Resources Provisioned Successfully!"
Write-Host "App URL: https://$WebAppName.azurewebsites.net"
Write-Host "=========================================================="
