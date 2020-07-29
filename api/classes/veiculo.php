<?php

class veiculo extends database {
	
	public function obterTodos() {
		$sql = "SELECT id_veiculo, placa, marca, modelo, chassi, informante, contato, local, bairro, municipio, situacao, observacao, dt_situacao, dt_update 
		FROM veiculo";
	
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

	public function obterPelaPlaca() {
		$sql = "SELECT placa, marca, modelo, situacao FROM veiculo 
		WHERE placa = '".$_REQUEST['placa']."'
		LIMIT 1";
		
		if ( $rs = parent::fetch_all($sql) ) {
			foreach ( $rs as $row ) {
				$cols = [];
				foreach ( $row as $k=>$v ) {
					$cols[$k] = stripslashes($v);
				}
			}
		} else {
			$cols = array ( 'placa' => $_REQUEST['placa'], 'situacao' => 'NAO ENCONTRADO' );
		}
		return array ( $cols );
	}

	public function obterUltimo() {
		$sql = "SELECT concat(dt_update,' ',id_veiculo) last 
		FROM veiculo 
		ORDER BY dt_update DESC 
		LIMIT 1";
	
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

	public function obterTodosParaConsulta() {
		$sql = "SELECT concat(marca,' ',modelo,' ',placa) 'veiculo', chassi, informante, contato, local, bairro, municipio, situacao, observacao, dt_situacao, v.dt_update, nome FROM veiculo v INNER JOIN usuario u on v.id_usuario=u.id_usuario";
	
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

	public function obterMarcas() {
		$sql = "SELECT marca FROM veiculo group by marca";
	
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

	public function obterModelos() {
		$sql = "SELECT modelo FROM veiculo WHERE marca='".$_REQUEST['marca']."' group by modelo";
	
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

	public function obterMunicipios() {
		$sql = "SELECT municipio FROM veiculo group by municipio";
	
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

	public function obterBairros() {
		$sql = "SELECT bairro FROM veiculo WHERE municipio='".$_REQUEST['municipio']."' group by bairro";
	
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

	public function obterSituacao() {
		$sql = "SELECT situacao FROM veiculo group by situacao";

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

		$this->id_veiculo = @ $_REQUEST['id_veiculo'];
		$this->placa = @ $_REQUEST['placa'];
		$this->marca = (@ $_REQUEST['marca']);
		$this->modelo = (@ $_REQUEST['modelo']);
		$this->chassi = @ $_REQUEST['chassi'];
		$this->informante = (@ $_REQUEST['informante']);
		$this->contato = @ $_REQUEST['contato'];
		$this->municipio = (@ $_REQUEST['municipio']);
		$this->bairro = (@ $_REQUEST['bairro']);
		$this->local = (@ $_REQUEST['local']);
		$this->situacao = @ $_REQUEST['situacao'];
		$this->dt_situacao = @ $_REQUEST['dt_situacao'];
		$this->id_usuario = @ $_user->id_usuario;
		$this->observacao = (@ $_REQUEST['observacao']);
	
		if ( $this->id_veiculo ) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
		} else {
			$this->id_veiculo = $this->insert();
		}
		
		$this->saveLog('Salvou veiculo ID '.$this->id_veiculo, $_user->id_usuario);
		return array ( 'id_veiculo' => $this->id_veiculo, 'local_cadastrado' => $this->local, 'local_recebido' => $_REQUEST['local'] );
	}

	public function excluir() {
		if ( @ $_REQUEST['id_veiculo'] ) {
			$this->id_veiculo = $_REQUEST['id_veiculo'];	
			$this->delete();
			
			global $_user;
			$this->saveLog('Salvou veiculo ID '.$this->id_veiculo, $_user->id_usuario);
			return array ( 'id_veiculo' => $this->id_veiculo );
		}	
	}

	public function contarSituacao(){
		// $periodo = $_REQUEST['periodo'];
		$sql = "SELECT situacao, COUNT(*) as total FROM veiculo group by situacao order by situacao";

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

	public function contarMarcas(){
		$sql = "SELECT marca, count(*) as tot FROM veiculo group by marca order by tot desc";

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