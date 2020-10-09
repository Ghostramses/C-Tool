<?php
$user = $_POST["adminUser"];
$pass = $_POST["adminPassword"];

if($user == "admin" && $pass=="admin"){
    $out = new stdClass();
    $out->nombre = "Administador";
    $out->rol = "Administrador";
    echo json_encode($out);

} else {
    $out = array(
        "mensaje" => "Usuario y/o contraseña son incorrectos",
        "error" => 2
    );
    echo json_encode($out);
}