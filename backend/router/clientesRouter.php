<?php
require_once './db.php';
require_once './controllers/ClienteController.php';


$controller = new ClienteController($conn);


$rota = $_GET['route'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'];


if ($rota == 'clientes' && $metodo == 'GET') {
$controller->index();
}


if ($rota == 'cliente' && $metodo == 'GET') {
$id = $_GET['id'];
$controller->show($id);
}


if ($rota == 'cliente' && $metodo == 'POST') {
$controller->store();
}


if ($rota == 'cliente' && $metodo == 'PUT') {
parse_str(file_get_contents("php://input"), $_PUT);
$_POST = $_PUT;
$id = $_GET['id'];
$controller->update($id);
}


if ($rota == 'cliente' && $metodo == 'DELETE') {
$id = $_GET['id'];
$controller->destroy($id);
}
?>