<?php
class Database
{
    private $server = "localhost";
    private $dbname = "hackathon144";
    private $user = "root";
    private $pass = "";

    public function Connect(){
        try {
            $conn = new PDO(
                "mysql:host=" . $this->server . ";dbname=" . $this->dbname,
                $this->user,$this->pass
            );

            $conn->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
            $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $conn;
            echo "Conexão realizada com sucesso";

        } catch (PDOException $th) {
            error_log("Erro de conexão DB: " . $th->getMessage());
            return null;
            echo "Erro na conexão: " . $th->getMessage();
        }
        
    }

}

 // Não conectar automaticamente para produção
?>

