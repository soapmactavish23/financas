<?php

class transferencia extends database
{

    public function obterTodos()
    {
        global $_user;
        $sql = "SELECT idtransferencia, idconta_transferencia, c_transfere.instituicao as conta_transferencia, idconta_recebe, c_recebe.instituicao as conta_recebe, valor, t.dt_update
        FROM transferencia t
        INNER JOIN conta c_transfere
        ON t.idconta_transferencia = c_transfere.idconta
        INNER JOIN conta c_recebe
        ON t.idconta_recebe = c_recebe.idconta WHERE t.idusuario = " . $_user->id_usuario;

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

        $this->idtranferencia = $_REQUEST['idtranferencia'];
        $this->idconta_transferencia = $_REQUEST['idconta'];
        $this->idconta_recebe = $_REQUEST['idconta_recebe'];
        $this->idusuario = $_user->id_usuario;
        $this->valor = $_REQUEST['valor'];

        if ($this->idtranferencia) {
            $this->dt_update = date('Y-m-d H:i:s');
            $this->update();
        } else {
            $this->execute("UPDATE conta SET saldo = saldo - $this->valor WHERE idconta = ".$this->idconta_transferencia);
            $this->execute("UPDATE conta SET saldo = saldo + $this->valor WHERE idconta = ".$this->idconta_recebe);
            $this->idtranferencia = $this->insert();
        }

        $this->saveLog('Salvou transferencia ID ' . $this->idtranferencia, $_user->id_usuario);
        return array('idtranferencia' => $this->idtranferencia);
    }

    public function excluir()
    {
        if (@$_REQUEST['idtransferencia']) {
            $this->idtransferencia = @ $_REQUEST['idtransferencia'];
            $this->idconta_transferencia = @$_REQUEST['idconta_transferencia'];
            $this->idconta_recebe = @$_REQUEST['idconta_recebe'];
            $this->valor = @ $_REQUEST['valor'];

            $this->execute("UPDATE conta SET saldo = saldo + $this->valor WHERE idconta = $this->idconta_transferencia");
            $this->execute("UPDATE conta SET saldo = saldo - $this->valor WHERE idconta = $this->idconta_recebe");

            $this->delete();

            global $_user;
            $this->saveLog('Excluir idtransferencia ID ' . $this->idtransferencia, $_user->id_usuario);
            return array(
                'idtransferencia' => $this->idtransferencia, 
                'valor' => $this->valor,
                'idconta_transferencia' => $this->idconta_transferencia,
                'idconta_recebe' => $this->idconta_recebe
            );
        }else{
            return array('error' => 'Não Foi possivel encontrar a transferência');
        }
    }
}
