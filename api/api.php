<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

# inclui as configuraçoes iniciais
require "config.php";

if ( $classe = @ $_REQUEST['classe'] ) {
	# inclui a classe
	require "classes/$classe.php";

	# instancia o objeto
	$_object = new $classe();

	if ( $_token = validateJWT( @ $_REQUEST['token'] ) ) {
		if ( $_token->exp > time() ) {
			if ( $metodo = @ $_REQUEST['metodo'] ) {
				$_user = json_decode($_token->data);
				if ( $rs = @ $_object->$metodo() ) {
					$result = $rs;
				} else {
					$result['error'] = 'Nenhum resultado encontrado';
				}
			} else {
				$result['error'] = 'Nenhum METODO requerido';
			}
		} else {
			$result['error'] = 'Token expirado';
		}
	} else {
		$result['error'] = 'Token invalido';
	}
} else {
	$result['error'] = 'Nenhuma CLASSE requerida';
}

header("Content-Type: application/json; charset=UTF-8");
print json_encode( @ $result );

?>