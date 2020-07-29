<?php

class tramitacao extends database {
	
	public function obterTodos() {
		global $_user;
		$sql = "SELECT * FROM tramitacao WHERE idusuario = $_user->id_usuario";
	
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

    public function obterCategoria() {
		$sql = "SELECT DISTINCT categoria FROM tramitacao";
	
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

		$this->idtramitacao = @ $_REQUEST['idtramitacao'];
		$this->idusuario = $_user->id_usuario;
		$this->idconta = (@ $_REQUEST['idconta']);
		$this->idcartao = (@ $_REQUEST['idcartao']);
        $this->descricao = (@ $_REQUEST['descricao']);
        $this->categoria = (@ $_REQUEST['categoria']);
        $this->valor = (@ $_REQUEST['valor']);
        $this->tipo_tramitacao = (@ $_REQUEST['tipo_tramitacao']);
        $this->data = (@ $_REQUEST['data']);
    
        if($this->idconta){
            if($this->tipo_tramitacao == "RECEITA"){
				$this->execute("UPDATE conta SET saldo = saldo + $this->valor WHERE idconta = $this->idconta");
			}else{
				$this->execute("UPDATE conta SET saldo = saldo - $this->valor WHERE idconta = $this->idconta");
			}
        }else{
			if($this->tipo_tramitacao == "RECEITA"){
				$this->execute("UPDATE cartao SET limite = limite + $this->valor WHERE idcartao = $this->idcartao");
			}else{
				$this->execute("UPDATE cartao SET limite = limite - $this->valor WHERE idcartao = $this->idcartao");
			}
		}
		
		if ( $this->idtramitacao ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
		} else {
			$this->idtramitacao = $this->insert();
		}
		
		$this->saveLog('Salvou tramitacao ID '.$this->idtramitacao, $_user->id_usuario);
		return array ( 'idtramitacao' => $this->idtramitacao);
	}

	public function excluir() {
		if ( @ $_REQUEST['idtramitacao'] ) {
			$this->idtramitacao = $_REQUEST['idtramitacao'];	
			$this->delete();
			global $_user;
			$this->saveLog('Excluir tramitacao ID '.$this->idtramitacao, $_user->id_usuario);
			return array ( 'idtramitacao' => $this->idtramitacao );
		}	
	}

	public function contarDespesas(){
		global $_user;
		$sql = "SELECT categoria, sum(valor) as valor 
		FROM tramitacao
		WHERE idusuario = $_user->id_usuario AND tipo_tramitacao like 'DESPESA' 
		GROUP BY categoria";
		
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

	public function contarReceitas(){
		global $_user;
		$sql = "SELECT categoria, sum(valor) as valor 
		FROM tramitacao
		WHERE idusuario = $_user->id_usuario AND tipo_tramitacao like 'RECEITA' 
		GROUP BY categoria";
		
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
}

?>