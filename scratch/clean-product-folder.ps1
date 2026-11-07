$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path -LiteralPath '.').Path.TrimEnd('\')
if ($workspace -ne 'C:\Users\Utente\Projects\web\delpasqua') { throw 'Unexpected workspace' }
$sourceRoot = [IO.Path]::GetFullPath((Join-Path $workspace 'public\products'))
$archiveRoot = [IO.Path]::GetFullPath((Join-Path $workspace 'archivio\immagini-prodotti\2026-11-07-pulizia'))
foreach ($checkedPath in @($sourceRoot, $archiveRoot)) {
  if (-not $checkedPath.StartsWith($workspace + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Path outside workspace' }
}
if (Test-Path -LiteralPath $archiveRoot) { throw 'Archive destination already exists; inspect before re-running' }

$catalog = Get-Content -LiteralPath (Join-Path $workspace 'src\db\products.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$activePaths = @($catalog | ForEach-Object { $_.imageSrc; $_.variants | ForEach-Object { $_.imageSrc } }) | Sort-Object -Unique
$keepNames = @($activePaths | Where-Object { $_.StartsWith('/products/') } | ForEach-Object { [IO.Path]::GetFileName($_) }) + @('del_pasqua_olive_grove.png')
$archiveNames = @(
  'Foto Grezze', 'prodotti nuovi', 'prodotti nuovi uniformati', 'prova-scontorno',
  'EVO-latta-750ml.webp', 'EVO-latta-1lt.webp', 'EVO-latta-3lt.webp', 'EVO-latta-5lt.webp',
  'EVO-latta-3lt.png', 'EVO-latta-5lt.png',
  'fruttato-medio-bottiglia-500ml.jpg', 'fruttato-medio-bottiglia-750ml.jpg', 'fruttato-medio-bottiglia-1lt.jpg'
)
$items = @(Get-ChildItem -LiteralPath $sourceRoot -Force)
$unknown = @($items | Where-Object { $_.Name -notin $keepNames -and $_.Name -notin $archiveNames })
if ($unknown.Count -gt 0) { throw ('Unclassified files: ' + ($unknown.Name -join ', ')) }
$beforeFiles = @(Get-ChildItem -LiteralPath $sourceRoot -Recurse -File -Force)
$activeChecks = @($items | Where-Object { $_.Name -in $keepNames } | ForEach-Object {
  [pscustomobject]@{ Name = $_.Name; SHA256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash }
})

$plan = @()
foreach ($name in $archiveNames) {
  $source = [IO.Path]::GetFullPath((Join-Path $sourceRoot $name))
  $destination = [IO.Path]::GetFullPath((Join-Path $archiveRoot $name))
  if (-not $source.StartsWith($sourceRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Source outside products' }
  if (-not $destination.StartsWith($archiveRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Destination outside archive' }
  $item = Get-Item -LiteralPath $source -Force
  $files = if ($item.PSIsContainer) { @(Get-ChildItem -LiteralPath $source -Recurse -File -Force) } else { @($item) }
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($sourceRoot.Length + 1)
    $plan += [pscustomobject]@{
      RelativePath = $relative
      Bytes = $file.Length
      SHA256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
    }
  }
}
New-Item -ItemType Directory -Path $archiveRoot | Out-Null
$plan | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $archiveRoot 'manifest-spostamenti.json') -Encoding UTF8
foreach ($name in $archiveNames) {
  $source = [IO.Path]::GetFullPath((Join-Path $sourceRoot $name))
  $destination = [IO.Path]::GetFullPath((Join-Path $archiveRoot $name))
  if (-not $source.StartsWith($sourceRoot + '\', [StringComparison]::OrdinalIgnoreCase) -or -not $destination.StartsWith($archiveRoot + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe move' }
  Move-Item -LiteralPath $source -Destination $destination
}
foreach ($file in $plan) {
  $destination = Join-Path $archiveRoot $file.RelativePath
  if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -ne $file.SHA256) { throw ('Archive hash mismatch: ' + $file.RelativePath) }
}
foreach ($file in $activeChecks) {
  if ((Get-FileHash -LiteralPath (Join-Path $sourceRoot $file.Name) -Algorithm SHA256).Hash -ne $file.SHA256) { throw ('Active asset changed: ' + $file.Name) }
}
$afterFiles = @(Get-ChildItem -LiteralPath $sourceRoot -Recurse -File -Force)
$report = [pscustomobject]@{
  BeforeFiles = $beforeFiles.Count
  AfterFiles = $afterFiles.Count
  ArchivedFiles = $plan.Count
  BeforeBytes = ($beforeFiles | Measure-Object -Property Length -Sum).Sum
  AfterBytes = ($afterFiles | Measure-Object -Property Length -Sum).Sum
  ArchivedBytes = ($plan | Measure-Object -Property Bytes -Sum).Sum
  HashesVerified = $true
  ActiveImagesUnchanged = $true
  Archive = $archiveRoot
}
$report | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $archiveRoot 'riepilogo.json') -Encoding UTF8
$report | ConvertTo-Json
