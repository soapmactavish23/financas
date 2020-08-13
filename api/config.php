<?php

# seta o PHP.INI
ini_set("default_charset", "UTF-8");
ini_set("date.timezone", "America/Belem");
ini_set("display_errors", true);
ini_set("memory_limit", "1024M");
ini_set("upload_max_filesize", "2048M");
ini_set("post_max_size", "2048M");
ini_set("max_execution_time", "600");
ini_set("max_input_time", "600");

# define os parametros de conexão com o banco de dados
define("DB_HOST", "localhost");
define("DB_USER", "finan267_admin");
define("DB_PASSWORD", "senh@d0@dmin"); //senh@d0admin
define("DB_DB", "finan267_db");
define("CHARSET", "utf8");

# carrega a classe MYSQLi
require "classes/database.php";

# define a chave privada para Json Web Token - JWT
define("PRIVATE_KEY", "chavePrivadaParaJsonWebToken");

# carrega as funções Json Web Token
require "classes/jwt.php";

?>
