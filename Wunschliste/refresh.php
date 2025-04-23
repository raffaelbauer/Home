<?php
// Aktualisiert die wunschliste.json lokal aus GitHub
$url = "https://raw.githubusercontent.com/DEIN_GITHUBNAME/wunschliste/main/wunschliste.json";
$data = file_get_contents($url);
file_put_contents("wunschliste.json", $data);
echo "Wunschliste wurde aktualisiert.";
?>