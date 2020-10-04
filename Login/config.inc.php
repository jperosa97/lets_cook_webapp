<?php
define("DB_SERVER", "localhost");
define("DB_USER", "root");
define("DB_PASSWORD", "");
define("DB_DATABASE", "lets_cook");

$conn = mysqli_connect(DB_SERVER , DB_USER, DB_PASSWORD, DB_DATABASE);

if($conn === false){
	// abbrechen bei Verbindungsfehler, und wenn man die SQL Fehlermeldung sehen möchte, kann diese noch ausgegeben werden
	die('Verbindung zur Datenbank fehlgeschlagen: '.mysqli_connect_error());
}
?>