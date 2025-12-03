<?php
ob_clean();
require_once __DIR__ . "/../config/database.php";

class ClienteModel {

    private $conn;

    public function __construct() {
        $banco = new Database();
        $this->conn = $banco->Connect();
    }

    public function postClientes() {
    try {
        

    } catch (\Throwable $th) {
        return ["erro" => $th->getMessage()];
    }
}

}

?>