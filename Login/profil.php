<?php
include('config.inc.php'); 
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./public/css/profil.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
    <title>Let's Cook</title>
</head>
<body>
    <header>
        <nav class="navi">
            <h1 class="firmen_name">Let's Cook</h1>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="../views/rezept.php">Rezepte</a></li>
                <li><a href="../Ueber_uns/ueber_uns.php">Über uns</a></li>
                <li><a href="profil.php">Profil</a></li>
                <li><a class="logout" href="logout.php">Logout</a></li>
            </ul>
        </nav>
        <h1 class="welcome">Willkommen auf Let's Cook, <?php 
		echo($_SESSION['userName']);
		?>
    </header>
    <section class="safe_recept">
        <div class="favorite_icon">
            <a class="recept" href="#"><i class="fas fa-utensils"></i></a>
            <h1>Recept</h1>
        </div>
        <div class="favorite_icon">
            <a class="favorite" href="#"><i class="fas fa-heart"></i></a>
            <h1>Favorite</h1>
        </div>
        <div class="favorite_icon">
            <a class="list" href="#"><i class="fas fa-clipboard-list"></i></a>
            <h1>Shopping list</h1>
        </div>
    </section>
</body>
</html>