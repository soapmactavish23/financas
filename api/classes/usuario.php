<?php

class usuario extends database {
	public function autenticar ($login, $password) {
		$sql = "SELECT *
		FROM usuario
		WHERE binary email='$login' AND binary senha='".md5($password)."' AND ativado = 'S'
		LIMIT 1";
		if ( $rs = parent::fetch_all($sql) ) {
			$row = array_shift($rs);
			$this->saveLog('Entrou',$row['id_usuario']);
			$rows['token'] = createJWT ($row);
			return $rows;
		} 
	}
	
	public function obterTodos() {
		$sql = "SELECT id_usuario, nome, email, permissao, ativado, dt_update FROM usuario";
	
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$col = array();
				foreach ( $row as $k=>$v ) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array( 'data' => $rows );
		}
	}

	public function salvar() {
		$this->id_usuario = @ $_REQUEST['id_usuario'];
		$this->nome = (@ $_REQUEST['nome']);
		$this->email = @ $_REQUEST['email'];
		$this->permissao = implode(',', @$_REQUEST['permissao']);
		if ( @ $_REQUEST['ativado'] ) $this->ativado = 'S';
		else $this->ativado = 'N';

		if ( $this->id_usuario ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
			
			global $_user;
			$this->saveLog('alterou usuario ID '.$this->id_usuario, $_user->id_usuario);
		} else {
			$this->senha = md5($this->email);
			$this->id_usuario = $this->insert();
			
			global $_user;
			$this->saveLog('inserir usuario ID '.$this->id_usuario, $_user->id_usuario);
		}
		
		return array ( 'id_usuario' => $this->id_usuario );
	}

	public function excluir() {
		if ( @ $_REQUEST['id_usuario'] ) {
			$this->id_usuario = $_REQUEST['id_usuario'];	
			$this->delete();
			global $_user;
			$this->saveLog('excluiu usuario ID '.$_REQUEST['id_usuario'], $_user->id_usuario);
			return array ( 'id_usuario' => $this->id_usuario );
		}
	}

	public function renovarSenha() {
		if ( @ $_REQUEST['id_usuario'] && @ $_REQUEST['email'] ) {
			$this->id_usuario = $_REQUEST['id_usuario'];
			$this->senha = md5($_REQUEST['email']);
			$this->update();
			global $_user;
			$this->saveLog('renovou senha do usuario ID '.$_REQUEST['id_usuario'], $_user->id_usuario);
			return array ('id_usuario' => $this->id_usuario );
		}
	}

	public function mudarSenha() {		
		global $_user;
		$sql = "SELECT id_usuario FROM usuario
		WHERE binary id_usuario='".$_user->id_usuario."' and binary senha='".md5($_REQUEST['senha'])."' 
		LIMIT 1";
		if ( $rs = parent::fetch_all($sql) ) {
			$vet = array_shift($rs);
			$this->id_usuario = $vet['id_usuario'];
			$this->senha = md5($_REQUEST['novasenha']);
			$this->update();
			$this->saveLog('mudou senha', $_user->id_usuario);
			return array ('success' => 'Sua senha foi alterada com sucesso' );
		} else {
			return array ('error' => 'Senha atual inválida');
		}
	}
}
?>
