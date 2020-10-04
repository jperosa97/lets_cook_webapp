<?php
    ob_start();
    session_start();
    $_SESSION['userName'] = null;
    header("Location: login.php");
?>