<?php

class despesa extends database {
	public function obterTodos() {
		$sql = "SELECT * FROM despesa";
	
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
		$this->iddespesa = @ $_REQUEST['iddespesa'];
		$this->despesa = (@ $_REQUEST['despesa']);
		$this->valor_despesa = @ $_REQUEST['valor_despesa'];
		if ( @ $_REQUEST['tipo_despesa'] ) $this->tipo = 'F';
		else $this->tipo = 'T';

		if ( $this->iddespesa ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
			
			global $_user;
			$this->saveLog('alterou desepsa ID '.$this->iddespesa, $_user->id_usuario);
		} else {
			$this->iddespesa = $this->insert();
			
			global $_user;
			$this->saveLog('inserir despesa ID '.$this->iddespesa, $_user->id_usuario);
		}
		
		return array ( 'iddespesa' => $this->iddespesa );
	}

	public function excluir() {
		if ( @ $_REQUEST['iddespesa'] ) {
			$this->iddespesa = $_REQUEST['iddespesa'];
			$this->delete();
			global $_user;
			$this->saveLog('excluiu despesa ID '.$_REQUEST['iddespesa'], $_user->id_usuario);
			return array ( 'iddespesa' => $this->iddespesa );
		}
	}
}
?>
