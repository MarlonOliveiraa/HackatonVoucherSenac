<?php
class Database
{
    private $server = "localhost";
    private $dbname = "hackaton144";
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

        } catch (PDOException $th) {
            error_log("Erro de conexão DB: " . $th->getMessage());
            return null;
        }
        
    }

}

 // Não conectar automaticamente para produção
?>

