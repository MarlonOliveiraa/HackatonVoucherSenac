import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useClientes } from '@/hooks/useClientes';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useServicos } from '@/hooks/useServicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Mail, Phone, Edit, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Clientes = () => {
  // hooks principais
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
  const { orcamentos, getOrcamentoTotal } = useOrcamentos();
  const { servicos } = useServicos();

  // estados locais
  const [open, setOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);

  // formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: '',
    status: 'ativo',
  });

  // cadastrar ou atualizar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    selectedCliente ? updateCliente(selectedCliente, formData) : addCliente(formData);
    toast.success(selectedCliente ? 'Cliente atualizado!' : 'Cliente cadastrado!');
    resetForm();
  };

  // limpa formulário
  const resetForm = () => {
    setFormData({ nome: '', telefone: '', email: '', observacoes: '', status: 'ativo' });
    setSelectedCliente(null);
    setOpen(false);
  };

  // abre para editar
  const handleEdit = (cliente: any) => {
    setFormData(cliente);
    setSelectedCliente(cliente.id);
    setOpen(true);
  };

  // excluir cliente
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCliente(id);
      toast.success('Cliente excluído!');
    }
  };

  // orçamentos do cliente
  const getClienteOrcamentos = (clienteId: string) => {
    return orcamentos
      .filter(o => o.clienteId === clienteId)
      .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
  };

  // nome do serviço
  const getServicoNome = (servicoId: string) =>
    servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">

        {/* header e botão novo cliente */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Clientes</h1>
            <p className="text-muted-foreground text-lg">Gerencie seus clientes</p>
          </div>

          {/* modal formulário */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
              </DialogHeader>

              {/* formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {selectedCliente ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* cards dos clientes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  
                  {/* nome + email */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-white">
                        {cliente.nome[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{cliente.nome}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {cliente.email || 'Sem email'}
                      </CardDescription>
                    </div>
                  </div>

                  {/* status */}
                  <Badge 
                    variant={cliente.status === 'ativo' ? 'default' : 'secondary'}
                  >
                    {cliente.status}
                  </Badge>
                </div>
              </CardHeader>

              {/* conteúdo do card */}
              <CardContent className="space-y-4">
                {cliente.telefone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {cliente.telefone}
                  </div>
                )}

                {cliente.observacoes && (
                  <p className="text-sm text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-3">
                    {cliente.observacoes}
                  </p>
                )}

                {/* botões */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCliente(cliente.id);
                      setTimelineOpen(true);
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Orçamentos
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(cliente)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* modal com timeline de orçamentos */}
        <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Orçamentos do Cliente</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedCliente && getClienteOrcamentos(selectedCliente).map((orcamento) => (
                <div key={orcamento.id} className="flex gap-4 border-l-2 border-primary pl-4 pb-4">
                  
                  {/* item da timeline */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{getServicoNome(orcamento.servicoId)}</h4>

                      <Badge variant={
                        orcamento.status === 'aprovado'
                          ? 'default'
                          : orcamento.status === 'pendente'
                          ? 'secondary'
                          : 'outline'
                      }>
                        {orcamento.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{orcamento.detalhes}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Data: {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm font-semibold text-accent">
                      R$ {getOrcamentoTotal(orcamento.id).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}

              {/* caso não tenha orçamentos */}
              {selectedCliente && getClienteOrcamentos(selectedCliente).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum orçamento encontrado
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
};

export default Clientes;
