$ErrorActionPreference = "Stop"

$branches = @(
  "feature/crear-proyecto",
  "feature/crear-tarea",
  "feature/editar-proyecto",
  "feature/editar-tarea",
  "feature/eliminar-proyecto",
  "feature/eliminar-tarea",
  "feature/filtrar-tareas",
  "feature/listar-proyectos",
  "feature/listar-tareas"
)

foreach ($branch in $branches) {
    Write-Host "Procesando rama: $branch"
    git checkout $branch
    
    $files = Get-ChildItem -Path "src\app\pages", "docs" -Recurse -Include "PROMPT*.md", "SPEC*.md", "prompt*.md", "spec*.md" -ErrorAction SilentlyContinue
    $changed = $false
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match "Claude") {
            Write-Host "Reemplazando en archivo: $($file.Name)"
            $content = $content -replace "Claude \(claude\.ai\)", "Antigravity"
            $content = $content -replace "Claude", "Antigravity"
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $changed = $true
        }
    }
    
    if ($changed) {
        git add .
        git commit -m "docs: reemplazar menciones de Claude por Antigravity"
        git push origin $branch
    } else {
        Write-Host "No hubo cambios en $branch"
    }
}

git checkout develop
Write-Host "¡Proceso terminado!"
