<?php

class conta extends database {
	
	public function obterTodos() {
        global $_user;
		$sql = "SELECT * FROM conta WHERE idusuario = $_user->id_usuario";
	
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
		$sql = "SELECT DISTINCT instituicao FROM conta";
	
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

    public function obterTiposDeContas() {
		$sql = "SELECT DISTINCT tipo_conta FROM conta";
	
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

		$this->idconta = @ $_REQUEST['idconta'];
		$this->idusuario = $_user->id_usuario;
		$this->instituicao = (@ $_REQUEST['instituicao']);
		$this->tipo_conta = (@ $_REQUEST['tipo_conta']);
		$this->nome_conta = @ $_REQUEST['nome_conta'];
		$this->saldo = (@ $_REQUEST['saldo']);
	
		if ( $this->idconta ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
		} else {
			$this->idconta = $this->insert();
		}
		
		$this->saveLog('Salvou conta ID '.$this->idconta, $_user->id_usuario);
		return array ( 'idconta' => $this->idconta);
	}

	public function excluir() {
		if ( @ $_REQUEST['idconta'] ) {
			$this->idconta = $_REQUEST['idconta'];	
			$this->delete();
			
			global $_user;
			$this->saveLog('Excluir conta ID '.$this->idconta, $_user->id_usuario);
			return array ( 'idconta' => $this->idconta );
		}	
	}
}

?>