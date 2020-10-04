<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./public/css/style.css">
    <title>Let's Cook</title>
</head>
<body>
    <header>
        <nav class="navi">
            <h1 class="firmen_name">Let's Cook</h1>
            <ul>
                <li><a href="../index.php">Home</a></li>
                <li><a href="../views/rezept.php">Rezepte</a></li>
                <li><a href="ueber_uns.php">Über uns</a></li>
                <li><a href="../Login/login.php">Login</a></li>
            </ul>
        </nav>
    </header>
    <section class="ueberUns">
    <h1 class="title">
        Über uns
    </h1>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum cumque beatae pariatur a fugit, 
        id magnam optio eaque ipsam repellat distinctio mollitia quaerat. Maxime neque quis quos iste totam repudiandae!
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et laudantium inventore fuga provident corporis ut debitis alias. 
        Ullam sapiente dignissimos praesentium animi id quae eveniet ipsam, totam, cumque nisi error?
    
    </p>
    <main>
        <div id="icons">
            <a href="#">
                <img class="icon" src="./public/img/apple-android-store-icons.png" alt="Download Link">
            </a>
        </div>
        <img class="logo" src="./public/img/logo.png" alt="Logo">
    </main>
    </section>
</body>
</html>