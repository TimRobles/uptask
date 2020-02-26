<?php
    $conn = new mysqli('localhost','root','123456','uptask');
    $conn -> set_charset('utf8');
    if ($conn->connect_error) {
        echo "<pre>";
    /* var_dump ($conn); */
    /* var_dump ($conn->ping()); */
    
        echo $conn->connect_error;
    
        echo "</pre>";
    }
?>