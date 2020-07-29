<?php

class cartao extends database {
	
	public function obterTodos() {
		$sql = "SELECT * FROM cartao";
	
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

    public function obterInstituicoes() {
		$sql = "SELECT DISTINCT instituicao FROM cartao";
	
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
		global $_user;

		$this->idcartao = @ $_REQUEST['idcartao'];
		$this->idusuario = $_user->id_usuario;
		$this->instituicao = (@ $_REQUEST['instituicao']);
		$this->nome_cartao = @ $_REQUEST['nome_cartao'];
        $this->limite = (@ $_REQUEST['limite']);
        $this->fechamento = (@ $_REQUEST['fechamento']);
        $this->vencimento = (@ $_REQUEST['vencimento']);
	
		if ( $this->idcartao ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
		} else {
			$this->idcartao = $this->insert();
		}
		
		$this->saveLog('Salvou cartao ID '.$this->idcartao, $_user->id_usuario);
		return array ( 'idcartao' => $this->idcartao);
	}

	public function excluir() {
		if ( @ $_REQUEST['idcartao'] ) {
			$this->idcartao = $_REQUEST['idcartao'];	
			$this->delete();
			
			global $_user;
			$this->saveLog('Excluir cartao ID '.$this->idcartao, $_user->id_usuario);
			return array ( 'idcartao' => $this->idcartao );
		}	
	}
}

?>