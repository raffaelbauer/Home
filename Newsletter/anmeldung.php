<?php
// E-Mail validieren
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if (!$email) {
    die("Ungültige E-Mail-Adresse.");
}

// Einmaliger Code zur Bestätigung generieren
$code = md5(uniqid($email, true));

// E-Mail temporär speichern
file_put_contents("anmeldungen/pending/$code.txt", $email);

// Bestätigungslink vorbereiten
$link = "https://raffaelbauer.ch/newsletter/bestaetigen.php?code=$code";

// Mail vorbereiten
$betreff = "🟢 Bitte bestätige deine Newsletter-Anmeldung";
$nachricht = "Hallo!\n\nBitte bestätige deine Anmeldung zum Newsletter mit einem Klick auf diesen Link:\n$link\n\nFalls du dich nicht angemeldet hast, ignoriere diese Nachricht.\n\nLiebe Grüsse,\nRaffael";
$header = "From: newsletter@raffaelbauer.ch";

// Mail versenden
mail($email, $betreff, $nachricht, $header);

// Rückmeldung
echo "✅ Bitte prüfe deine E-Mail und bestätige die Anmeldung über den Link.";
?>
