$sourceRoot = "E:\Source\gh\angular\angular\dist\all\@angular"
$destinationRoot = "E:\Source\gh\liquidboy\GameOn\trunk\RipThatPic_Core\node_modules"
$destinationRootAngular = $destinationRoot + "\@angular"

# Remove-Item -Path $destinationRootAngular -Force -Recurse
Copy-Item -Path $sourceRoot -Filter "*.*" -Recurse -Destination $destinationRoot -Container -Force