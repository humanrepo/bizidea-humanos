# ==============================================
# SCRIPTS DE DÉVELOPPEMENT BIZIDEA - POWERSHELL
# ==============================================
# Scripts utilitaires pour faciliter le développement
# Exécuter avec: .\scripts-dev.ps1 [commande]

param(
    [Parameter(Position=0)]
    [string]$Action = "help"
)

# Couleurs pour l'affichage
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Show-Header {
    Write-ColorOutput Green "🚀 BIZIDEA - Scripts de Développement PowerShell"
    Write-ColorOutput Green "=================================================="
    Write-Output ""
}

function Show-Help {
    Show-Header
    Write-ColorOutput Yellow "Commandes disponibles:"
    Write-Output ""
    Write-ColorOutput Cyan "  setup           - Configuration initiale complète"
    Write-ColorOutput Cyan "  install         - Installer toutes les dépendances"
    Write-ColorOutput Cyan "  dev             - Démarrer les serveurs de développement"
    Write-ColorOutput Cyan "  backend         - Démarrer seulement le backend"
    Write-ColorOutput Cyan "  frontend        - Démarrer seulement le frontend"
    Write-ColorOutput Cyan "  clean           - Nettoyer et réinstaller les dépendances"
    Write-ColorOutput Cyan "  check           - Vérifier l'environnement"
    Write-ColorOutput Cyan "  ports           - Vérifier les ports utilisés"
    Write-ColorOutput Cyan "  kill-ports      - Arrêter les processus sur les ports 3000 et 5000"
    Write-ColorOutput Cyan "  logs            - Afficher les logs du serveur"
    Write-ColorOutput Cyan "  test            - Exécuter tous les tests"
    Write-ColorOutput Cyan "  build           - Construire pour la production"
    Write-ColorOutput Cyan "  help            - Afficher cette aide"
    Write-Output ""
    Write-ColorOutput Yellow "Exemples:"
    Write-ColorOutput White "  .\scripts-dev.ps1 setup"
    Write-ColorOutput White "  .\scripts-dev.ps1 dev"
    Write-ColorOutput White "  .\scripts-dev.ps1 clean"
    Write-Output ""
}

function Test-Prerequisites {
    Write-ColorOutput Yellow "🔍 Vérification des prérequis..."
    
    $prerequisites = @(
        @{Name="Node.js"; Command="node --version"; Required=$true},
        @{Name="npm"; Command="npm --version"; Required=$true},
        @{Name="Git"; Command="git --version"; Required=$true},
        @{Name="PostgreSQL"; Command="psql --version"; Required=$false},
        @{Name="MongoDB"; Command="mongod --version"; Required=$false}
    )
    
    $allGood = $true
    
    foreach ($prereq in $prerequisites) {
        try {
            $version = Invoke-Expression $prereq.Command 2>$null
            if ($version) {
                Write-ColorOutput Green "✅ $($prereq.Name): $version"
            } else {
                throw "Non trouvé"
            }
        } catch {
            if ($prereq.Required) {
                Write-ColorOutput Red "❌ $($prereq.Name): Non installé (REQUIS)"
                $allGood = $false
            } else {
                Write-ColorOutput Yellow "⚠️  $($prereq.Name): Non installé (optionnel)"
            }
        }
    }
    
    return $allGood
}

function Install-Dependencies {
    Write-ColorOutput Yellow "📦 Installation des dépendances..."
    
    # Backend
    Write-ColorOutput Cyan "Installation des dépendances backend..."
    Set-Location src
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Erreur lors de l'installation des dépendances backend"
        return $false
    }
    
    # Frontend
    Write-ColorOutput Cyan "Installation des dépendances frontend..."
    Set-Location ..\frontend
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Erreur lors de l'installation des dépendances frontend"
        return $false
    }
    
    Set-Location ..
    Write-ColorOutput Green "✅ Toutes les dépendances installées avec succès"
    return $true
}

function Setup-Environment {
    Write-ColorOutput Yellow "⚙️  Configuration de l'environnement..."
    
    # Copier les fichiers .env si ils n'existent pas
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-ColorOutput Green "✅ Fichier .env créé à la racine"
    }
    
    if (-not (Test-Path "src\.env")) {
        Copy-Item "src\.env.example" "src\.env"
        Write-ColorOutput Green "✅ Fichier .env créé dans src/"
    }
    
    Write-ColorOutput Yellow "⚠️  N'oubliez pas de configurer vos fichiers .env avec vos paramètres"
}

function Start-Development {
    Write-ColorOutput Yellow "🚀 Démarrage des serveurs de développement..."
    
    # Démarrer le backend en arrière-plan
    Write-ColorOutput Cyan "Démarrage du backend..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\src'; npm run dev" -WindowStyle Normal
    
    Start-Sleep -Seconds 3
    
    # Démarrer le frontend en arrière-plan
    Write-ColorOutput Cyan "Démarrage du frontend..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\frontend'; npm start" -WindowStyle Normal
    
    Write-ColorOutput Green "✅ Serveurs démarrés!"
    Write-ColorOutput Yellow "Backend: http://localhost:5000"
    Write-ColorOutput Yellow "Frontend: http://localhost:3000"
    Write-ColorOutput Yellow "API Santé: http://localhost:5000/api/sante"
}

function Start-Backend {
    Write-ColorOutput Yellow "🔧 Démarrage du backend seulement..."
    Set-Location src
    npm run dev
}

function Start-Frontend {
    Write-ColorOutput Yellow "🎨 Démarrage du frontend seulement..."
    Set-Location frontend
    npm start
}

function Clean-Dependencies {
    Write-ColorOutput Yellow "🧹 Nettoyage et réinstallation des dépendances..."
    
    # Backend
    Write-ColorOutput Cyan "Nettoyage backend..."
    Set-Location src
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force node_modules }
    if (Test-Path "package-lock.json") { Remove-Item package-lock.json }
    npm install
    
    # Frontend
    Write-ColorOutput Cyan "Nettoyage frontend..."
    Set-Location ..\frontend
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force node_modules }
    if (Test-Path "package-lock.json") { Remove-Item package-lock.json }
    npm install
    
    Set-Location ..
    Write-ColorOutput Green "✅ Nettoyage terminé"
}

function Check-Ports {
    Write-ColorOutput Yellow "🔍 Vérification des ports..."
    
    $ports = @(3000, 5000)
    foreach ($port in $ports) {
        $process = netstat -ano | Select-String ":$port "
        if ($process) {
            Write-ColorOutput Red "❌ Port $port utilisé:"
            Write-Output $process
        } else {
            Write-ColorOutput Green "✅ Port $port libre"
        }
    }
}

function Kill-Ports {
    Write-ColorOutput Yellow "🔪 Arrêt des processus sur les ports 3000 et 5000..."
    
    $ports = @(3000, 5000)
    foreach ($port in $ports) {
        $processes = netstat -ano | Select-String ":$port " | ForEach-Object {
            $_.ToString().Split()[-1]
        }
        
        foreach ($pid in $processes) {
            if ($pid -and $pid -ne "0") {
                try {
                    Stop-Process -Id $pid -Force
                    Write-ColorOutput Green "✅ Processus $pid arrêté (port $port)"
                } catch {
                    Write-ColorOutput Red "❌ Impossible d'arrêter le processus $pid"
                }
            }
        }
    }
}

function Run-Tests {
    Write-ColorOutput Yellow "🧪 Exécution des tests..."
    
    # Tests backend
    Write-ColorOutput Cyan "Tests backend..."
    Set-Location src
    npm test
    
    # Tests frontend
    Write-ColorOutput Cyan "Tests frontend..."
    Set-Location ..\frontend
    npm test -- --watchAll=false
    
    Set-Location ..
    Write-ColorOutput Green "✅ Tests terminés"
}

function Build-Production {
    Write-ColorOutput Yellow "🏗️  Construction pour la production..."
    
    Set-Location frontend
    npm run build
    
    Set-Location ..
    Write-ColorOutput Green "✅ Build terminé - fichiers dans frontend/build/"
}

# Exécution de l'action demandée
switch ($Action.ToLower()) {
    "setup" {
        Show-Header
        if (Test-Prerequisites) {
            Setup-Environment
            Install-Dependencies
            Write-ColorOutput Green "🎉 Configuration terminée! Vous pouvez maintenant exécuter: .\scripts-dev.ps1 dev"
        }
    }
    "install" {
        Show-Header
        Install-Dependencies
    }
    "dev" {
        Show-Header
        Start-Development
    }
    "backend" {
        Show-Header
        Start-Backend
    }
    "frontend" {
        Show-Header
        Start-Frontend
    }
    "clean" {
        Show-Header
        Clean-Dependencies
    }
    "check" {
        Show-Header
        Test-Prerequisites
        Check-Ports
    }
    "ports" {
        Show-Header
        Check-Ports
    }
    "kill-ports" {
        Show-Header
        Kill-Ports
    }
    "test" {
        Show-Header
        Run-Tests
    }
    "build" {
        Show-Header
        Build-Production
    }
    "help" {
        Show-Help
    }
    default {
        Show-Help
    }
}