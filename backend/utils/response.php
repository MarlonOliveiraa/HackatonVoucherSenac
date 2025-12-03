<?php
function response($status, $mensagem, $dados = null) {
    echo json_encode([
        "status" => $status,
        "mensagem" => $mensagem,
        "dados" => $dados
    ]);
    exit;
}
