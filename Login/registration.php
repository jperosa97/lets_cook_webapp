<?php
    //Mit der Datenbank verbinden
    include('config.inc.php'); 
    session_start();
    if(isset($_SESSION['userName'])){
        header("Location:profil.php?reason=Sie sind schon angemeldet");
    }
    if(isset($_POST["submit"])){
        $userName = $_POST['userName'];
        $email = $_POST['email'];
        $pass = $_POST['password'];
        $pass2 = $_POST['confirmpass'];
    
        if(empty($userName) || empty($email) || empty($pass) || empty($pass2)){
            header("Location:registration.php?error=Alle Felder sind leer");
            exit();
        }
        //Email überprüfen, ob sie schon vergebn ist
        $conn_e = "SELECT * FROM users WHERE email='".$email."'";
        $rel_e = mysqli_query($conn, $conn_e);
        if(mysqli_num_rows($rel_e) > 0){
            header("Location:registration.php?error=Diese Email ist schon vergeben");
            exit();
        }
        //Beide Passwörter von ihrer Richtigkeit überprüfen
        if($pass != $pass2){
            header("Location:registration.php?error=Passwörter stimmen nicht überein");
            exit();
        }
        if($pass == $pass2){
            $pass_hash = password_hash($pass, PASSWORD_DEFAULT);

            $sql = "INSERT INTO users(userName, email, password) VALUES ('".$userName."','".$email."','".$pass_hash."')";
            $row = mysqli_query($conn, $sql);
            if($row){
                $_SESSION['userName'] = $userName;
                $_SESSION['password'] = $pass;
                header("Location:login.php?registration=erfolgreich");
            }else {
                header("Location:registration.php?error= Es konnte keine zur Verbindung zur Datenbank gemacht werden");
                exit();
            }
        }
    }
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
                <li><a href="../Ueber_uns/ueber_uns.php">Über uns</a></li>
                <li><a href="login.php">Login</a></li>
            </ul>
        </nav>
        <img class="title_bild" src="./public/img/lg_rg_bild.jpg" alt="">
        <h2>Registriere dich bei let's Cook</h2>
        <form action="" method="POST">
        <?php
					if(isset($_GET['error'])){
                        echo'<div style="color:red; font-size:32px;">';
                        echo $_GET['error'];
                        echo"</div>"; 
        		    }
            	?>
            <div class="usn-style">
                <label for="name">Username</label>
                <input type="text" name="userName" id="userName">
            </div>
            <div class="email-style">
                <input type="email" name="email" id="email">
                <label for="email">Email</label>
            </div>
            <div class="pwd-style">
                <input type="password" name="password" id="password">
                <label for="password">Password</label>
            </div>
            <div class="pwd-style2">
                <input type="password" name="confirmpass" id="password">
                <label for="password">Password wiederholen </label>
            </div>
            <div class="button_regi">
                <button type="submit" name="submit" class="btn">Registrieren</button>
            </div>
        </form>
    </header>
</body>
</html>