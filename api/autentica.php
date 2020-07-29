<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');

# inclui as configuraçoes iniciais
require "config.php";

# inclui a classe de usuario
require "classes/usuario.php";

# instancia o objeto usuario
$_usuario = new usuario();

# define o retorno
$result = $_usuario->autenticar(@ $_REQUEST['login'], @ $_REQUEST['password']);

# retorno no formato json
header("Content-Type: application/json; charset=UTF-8");
print json_encode( $result );

?>