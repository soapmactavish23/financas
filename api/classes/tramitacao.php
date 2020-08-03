<?php

class tramitacao extends database
{

	public function obterTodos()
	{
		global $_user;
		$sql = "SELECT * FROM tramitacao WHERE idusuario = $_user->id_usuario ORDER BY data DESC";

		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function obterTodosPorMes(){
		global $_user;
		$sql = "SELECT nome_conta, descricao, categoria, tipo_tramitacao, valor, pago, data, t.dt_update
		FROM tramitacao t
		INNER JOIN conta c
		ON t.idconta = c.idconta
		WHERE t.idusuario = $_user->id_usuario AND MONTH(data) = ".$_REQUEST['periodo'];
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function obterCategoria()
	{
		$sql = "SELECT DISTINCT categoria FROM tramitacao";

		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function salvar()
	{
		global $_user;

		$this->idtramitacao = @$_REQUEST['idtramitacao'];
		$this->idusuario = $_user->id_usuario;
		$this->idconta = (@$_REQUEST['idconta']);
		$this->idcartao = (@$_REQUEST['idcartao']);
		$this->descricao = (@$_REQUEST['descricao']);
		$this->categoria = (@$_REQUEST['categoria']);
		$this->valor = (@$_REQUEST['valor']);
		$this->tipo_tramitacao = (@$_REQUEST['tipo_tramitacao']);
		$this->data = (@$_REQUEST['data']);
		$this->pago = (@$_REQUEST['pago']);

		if ($_REQUEST['fixo']) {
			$this->fixo = 'S';
		} else {
			$this->fixo = 'N';
		}

		if ($this->idtramitacao) {
			$this->dt_update = date('Y-m-d H:i:s');
			$this->update();
			
			$sql_update = "";

			$this->execute($sql_update);
		} else {
			$this->idtramitacao = $this->insert();
		}

		$this->saveLog('Salvou tramitacao ID ' . $this->idtramitacao, $_user->id_usuario);
		return array('idtramitacao' => $this->idtramitacao, 'sql_update' => $sql_update);
	}

	public function excluir()
	{
		if (@$_REQUEST['idtramitacao']) {
			$this->idtramitacao = @$_REQUEST['idtramitacao'];
			$this->idconta = @$_REQUEST['idconta'];
			$this->tipo_tramitacao = $_REQUEST['tipo_tramitacao'];
			$this->valor = @$_REQUEST['valor'];
			$this->pago = @$_REQUEST['pago'];
			$this->delete();

			if ($this->pago == 'S') {
				if ($this->tipo_tramitacao == 'RECEITA') {
					$this->execute("UPDATE conta SET saldo = saldo - $this->valor WHERE idconta = $this->idconta");
				} else {
					$this->execute("UPDATE conta SET saldo = saldo + $this->valor WHERE idconta = $this->idconta");
				}
			}

			global $_user;
			$this->saveLog('Excluir tramitacao ID ' . $this->idtramitacao, $_user->id_usuario);
			return array('idtramitacao' => $this->idtramitacao);
		}
	}

	public function obterDtDespesa()
	{
		global $_user;
		$sql = "SELECT concat(DAY(data), '/0', MONTH(data)) as dt, valor FROM tramitacao WHERE (idusuario = $_user->id_usuario AND data>=current_date) AND tipo_tramitacao like 'DESPESA' ORDER BY data ASC";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function contarDespesas()
	{
		global $_user;
		$sql = "SELECT categoria, sum(valor) as valor 
		FROM tramitacao
		WHERE idusuario = $_user->id_usuario AND tipo_tramitacao like 'DESPESA' 
		GROUP BY categoria";

		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function contarReceitas()
	{
		global $_user;
		$sql = "SELECT categoria, sum(valor) as valor 
		FROM tramitacao
		WHERE idusuario = $_user->id_usuario AND tipo_tramitacao like 'RECEITA' 
		GROUP BY categoria";

		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function pagar()
	{
		global $_user;

		$this->idtramitacao = @$_REQUEST['idtramitacao'];
		$this->pago = 'S';
		$this->idconta = @$_REQUEST['idconta'];
		$this->tipo_tramitacao = @$_REQUEST['tipo_tramitacao'];
		$this->valor = @$_REQUEST['valor'];
		$this->update();

		$sql_update = "";

		if ($this->tipo_tramitacao == "RECEITA") {
			$sql_update = "UPDATE conta SET saldo = saldo + $this->valor WHERE idconta = " . $this->idconta;
		} else {
			$sql_update = "UPDATE conta SET saldo = saldo - $this->valor WHERE idconta = " . $this->idconta;
		}
		$this->execute($sql_update);

		return array('success' => "Tramitação feita com sucesso", 'sql' => $sql_update);
	}

	public function pagarFixas()
	{
		global $_user;
		$sql = "SELECT idtramitacao, idconta, tipo_tramitacao, valor, data
		FROM tramitacao 
		WHERE idusuario = $_user->id_usuario AND (MONTH(data)<=MONTH(CURDATE()) AND fixo = 'S')";

		if ($rs = parent::fetch_all($sql)) {

			$vet = array_shift($rs);
			$idtramitacao = $vet['idtramitacao'];
			$idconta = $vet['idconta'];
			$tipo_tramitacao = $vet['tipo_tramitacao'];
			$valor = $vet['valor'];
			$data = $vet['data'];

			if ($tipo_tramitacao == "RECEITA") {
				$this->execute("UPDATE conta SET saldo = saldo + $valor WHERE idconta = $idconta");
			} else {
				$this->execute("UPDATE conta SET saldo = saldo - $valor WHERE idconta = $idconta");
			}

			$this->execute("UPDATE tramitacao SET data = DATE_ADD(CURDATE(), INTERVAL 1 MONTH) WHERE idtramitacao = $idtramitacao");

			return array('success' => 'Tramitações pagas com sucesso');
		} else {
			return array('error' => 'Nenhuma Tramitação a ser paga');
		}
	}

	public function contarDespesasDiarias()
	{
		global $_user;
		$sql = "SELECT SUM(valor) as valor, COUNT(*) as tot_despesa
		FROM tramitacao 
		WHERE tipo_tramitacao like 'DESPESA' AND idusuario = $_user->id_usuario AND data = curdate() AND pago = 'N'";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function contarReceitasDiarias()
	{
		global $_user;
		$sql = "SELECT SUM(valor) as valor, COUNT(*) as tot_receita
		FROM tramitacao 
		WHERE tipo_tramitacao like 'RECEITA' AND idusuario = $_user->id_usuario AND data = curdate() AND pago = 'N'
		";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function obterDespesasDiarias()
	{
		global $_user;
		$sql = "SELECT idtramitacao, categoria, valor, data, idconta, tipo_tramitacao FROM tramitacao WHERE idusuario = $_user->id_usuario AND data = curdate() AND pago = 'N' AND tipo_tramitacao like 'DESPESA'";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function obterReceitasDiarias()
	{
		global $_user;
		$sql = "SELECT idtramitacao, categoria, valor, data, idconta, tipo_tramitacao FROM tramitacao WHERE idusuario = $_user->id_usuario AND data = curdate() AND pago = 'N' AND tipo_tramitacao like 'RECEITA'";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function contarDespesasPorMes(){
		global $_user;
		$sql = "SELECT SUM(valor) AS valor_despesa, COUNT(*) tot_despesa FROM tramitacao 
		WHERE MONTH(data) = ".$_REQUEST['periodo']." AND tipo_tramitacao like 'DESPESA' AND idusuario = $_user->id_usuario";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

	public function contarReceitasPorMes(){
		global $_user;
		$sql = "SELECT SUM(valor) AS valor_receita, COUNT(*) tot_receita FROM tramitacao 
		WHERE MONTH(data) = ".$_REQUEST['periodo']." AND tipo_tramitacao like 'RECEITA' AND idusuario = $_user->id_usuario";
		if ($rs = parent::fetch_all($sql)) {
			foreach ($rs as $row) {
				$col = array();
				foreach ($row as $k => $v) {
					$col[$k] = ($v);
				}
				$rows[] = $col;
			}
			return array('data' => $rows);
		}
	}

}
