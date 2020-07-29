<?php

/**
 * cria o token JWT.
 *
 * @param array      $vet
 *
 * @constant string  PRIVATE_KEY
 *
 * @return string    The token JWT
 */
function createJWT ( $vet=array() ) {
	$header = [
	   'alg' => 'HS256',
	   'typ' => 'JWT'
	];
	$header = json_encode($header);
	$header = base64_encode($header);

	$tokenId    = base64_encode(random_bytes(32));
    $issuedAt   = time();
    $notBefore  = $issuedAt + 60; //Adding 1 minute
    $expire     = $notBefore + 3600; // Adding 1 hour
    $serverName = $_SERVER["SERVER_NAME"];
	foreach ( $vet as $k=>$v ) {
		$data[$k] = utf8_encode($v);
	}
	$data = json_encode($data);
	
	$payload = [
        'iat'  => $issuedAt,         // Issued at: time when the token was generated
        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,       // Issuer
        'nbf'  => $notBefore,        // Not before
        'exp'  => $expire,           // Expire
        'data' => $data
    ];
	$payload = json_encode($payload);
	$payload = base64_encode($payload);

	$signature = hash_hmac('sha256',"$header.$payload",PRIVATE_KEY,true);
	$signature = base64_encode($signature);

	return "$header.$payload.$signature";
}

/**
 * valida um token JWT.
 *
 * @param string       $token JWT
 * @param bool         $assoc, quando TRUE, o object retornado será convertido em array associativo
 *
 * @constant string    PRIVATE_KEY
 *
 * @return object      The JWT's payload as a PHP object or array
 * 'iat'               Issued at: time when the token was generated
 * 'jti'               Json Token Id: an unique identifier for the token
 * 'iss'               Issuer
 * 'nbf'               Not before
 * 'exp'               Expire
 * 'data'              Data Json
 */
function validateJWT ( $token=null, $assoc=false ) {
	if ( ! $token ) return false;
	$parts = explode('.',$token);

	if (count($parts) != 3) return false;
	list($header, $payload, $signature) = $parts;

	$valid = hash_hmac('sha256', "$header.$payload", PRIVATE_KEY, true);
	$valid = base64_encode($valid);

	if($signature == $valid) {
		if ( $remainder = strlen($payload) % 4 ) {
			$padlen = 4 - $remainder;
			$payload .= str_repeat('=', $padlen);
		}
		$payload_decode = base64_decode(strtr($payload, '-_', '+/'));
		return json_decode($payload_decode, $assoc);
	} else {
		return false;
	}
}

?>