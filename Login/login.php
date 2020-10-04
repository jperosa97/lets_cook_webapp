<?php
//Verbindung zur Datenbank herstellen 
include('config.inc.php'); 
session_start();
if(isset($_SESSION['userName'])){
    header("Location:profil.php?reason=Sie sind bereits angemeldet");
}
if(isset($_GET['reason'])){
    echo"<script>alert('".$_GET['reason']."')</script>";
}
if(isset($_POST['submit'])){
    $userName = $_POST['userName'];
    $pass = $_POST['password'];
    
    $conn_e = "SELECT * FROM users WHERE userName ='".$userName."'";
    $rel_e = $conn->query($conn_e);
    
    if(empty($userName) || empty($pass)){
        header("Location:login.php?error=Alle Felder sind leer");
        exit();
    }else if (!mysqli_num_rows($rel_e) > 0 ){
        header("Location:login.php?errorRegistrieren Sie sich zuerst");
        exit();
    }
    else{
		while ($row = mysqli_fetch_array($rel_e)) {
			$pass1 = password_verify($pass, $row['pass']);
			if($pass){
				$_SESSION['userName'] = $row['userName'];
				$_SESSION['password'] = $pass;
				header("Location:profil.php?login=erfolgreich&userName=$userName");
			}
			else{
				header("Location:login.php?error=Falsches Passwort");
			exit();
			}	
		}
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./public/css/login.css">
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
                <li><a href="login.html">Login</a></li>
            </ul>
        </nav>
        <img class="title_bild" src="./public/img/lg_rg_bild.jpg" alt="">
        <h2>Willkomen bei let's Cook</h2>
        <form action="" method="POST">
            <?php
			    if(isset($_GET['error'])){
                    echo'<div style="color: red;">';
                    echo $_GET['error'];
                    echo"</div>"; 
        	    }
            ?>
            <div class="usn-style">
                <label for="name">Username</label>
                <input type="text" name="userName" id="userName">
                
            </div>
            <div class="pwd1-style">  
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>
            <div class="button">
                <button type="submit" name="submit" class="btn">Login</button>
                <a class="btn_regi" href="registration.php">Registrieren</a> 
            </div>
            
        </form>
    </header>
</body>
</html>