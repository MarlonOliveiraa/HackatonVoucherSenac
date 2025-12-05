<?php
ob_clean();
require_once __DIR__ . "/../models/dashboardModel.php";

class DashboardController 
{
    private $model;

    public function __construct() {
        $this->model = new DashboardModel();
    }

    public function index() {
        try {
            $dados = $this->model->getDashboardData();

            return [
                "status" => "sucesso",
                "dados"  => $dados
            ];

        } catch (\Throwable $th) {

            return [
                "status" => "erro",
                "mensagem" => $th->getMessage()
            ];
        }
    }
}
