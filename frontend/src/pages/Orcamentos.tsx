import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useOrcamentos } from '@/hooks/useOrcamentos';
import { useClientes } from '@/hooks/useClientes';
import { useServicos } from '@/hooks/useServicos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { OrcamentoItem } from '@/types';

const Orcamentos = () => {
  const { orcamentos, addOrcamento, updateOrcamento, updateOrcamentoItems, deleteOrcamento, getOrcamentoItems, getOrcamentoTotal } = useOrcamentos();
  const { clientes } = useClientes();
  const { servicos } = useServicos();
  const [open, setOpen] = useState(false);
  const [selectOrcamento, setSelectOrcamento] = useState<string | null>(null);
  const [selectedServicosItems, setSelectedServicosItems] = useState<
    {id?: string; orcamentoId?: string; nomeItem: string; valor?: string}[]
  >([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    servicoId: '',
    detalhes: '',
    tempoEstimado: '',
    status: 'pendente' as 'aprovado' | 'pendente' | 'cancelado',
    dataCriacao: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServicosItems.length === 0) {
      toast.error('Adicione pelo menos um item ao orçamento');
      return;
    }

    // --- Editando/update ---
  if (selectOrcamento){
    const itemsParaEdicao: OrcamentoItem[] = selectedServicosItems.map(item => ({
      id: item.id as string,
      orcamentoId: selectOrcamento, 
      nomeItem: item.nomeItem,
      valor: parseFloat(item.valor) || 0, // numero float
    }));

    try{
      //espera o update principal
      await updateOrcamento(selectOrcamento, formData);

      //esperando o update dos itens
      await updateOrcamentoItems(selectOrcamento, itemsParaEdicao);

      toast.success("Orçamento atualizado!");
      resetForm();
    } catch(error){
      console.error("Erro na edição: ", error);
      toast.error("Falha ao atualizar o orçamento e/ou itens. Verifique o console.");
    }
    return;
  } 


  // --- Criando/ADD ---
  const itemsParaEnvio: { nomeItem: string, valor: string }[] = selectedServicosItems.map(item => ({
    nomeItem: item.nomeItem,
    valor: item.valor, // valor como string
  }));
  
  addOrcamento(formData, itemsParaEnvio);
  toast.success('Orçamento criado!');
  resetForm();
  };

  const resetForm = () => {
    setFormData({
      clienteId: '',
      servicoId: '',
      detalhes: '',
      tempoEstimado: '',
      status: 'pendente',
      dataCriacao: new Date().toISOString().split('T')[0],
    });
    setSelectedServicosItems([]);
    setSelectOrcamento(null);
    setOpen(false);
  };

  const handleEdit = (orcamento: any) => {
    setFormData({
      clienteId: orcamento.clienteId,
      servicoId: orcamento.servicoId,
      detalhes: orcamento.detalhes,
      tempoEstimado: orcamento.tempoEstimado,
      status: orcamento.status,
      dataCriacao: orcamento.dataCriacao?.split('T')[0] ?? new Date().toISOString().split('T')[0],
    });

    const existingItems = getOrcamentoItems(orcamento.id).map(i => ({
      id: i.id,
      orcamentoId: i.orcamentoId,
      nomeItem: i.nomeItem,
      valor: String(i.valor), // valor como string
    }));
    setSelectedServicosItems(existingItems);
  
    setSelectOrcamento(orcamento.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteOrcamento(id);
      toast.success('Orçamento excluído!');
    }
  };

  const getClienteNome = (clienteId: string) => {
    return clientes.find(c => c.id === clienteId)?.nome || 'Cliente não encontrado';
  };

  const getServicoNome = (servicoId: string) => {
    return servicos.find(s => s.id === servicoId)?.nome || 'Serviço não encontrado';
  };

  const addServicoItem = () => {
    setSelectedServicosItems([...selectedServicosItems, { nomeItem: '', valor: '' }]);
  };

  const updateServicoItem = (index: number, field: 'nomeItem' | 'valor', value: string) => {
    const updated = [...selectedServicosItems];
    updated[index][field] = value;
    setSelectedServicosItems(updated);
  };

  const removeServicoItem = (index: number) => {
    setSelectedServicosItems(selectedServicosItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedServicosItems.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold">Orçamentos</h1>
            <p className="text-muted-foreground text-lg">Crie e gerencie orçamentos</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="shadow-lg hover:shadow-glow transition-all" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Orçamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente</Label>
                    <Select
                      value={formData.clienteId}
                      onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servicoId">Serviço Principal</Label>
                    <Select
                      value={formData.servicoId}
                      onValueChange={(value) => setFormData({ ...formData, servicoId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {servicos.map((servico) => (
                          <SelectItem key={servico.id} value={servico.id}>
                            {servico.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detalhes">Detalhes do Orçamento</Label>
                  <Textarea
                    id="detalhes"
                    value={formData.detalhes}
                    onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
                    placeholder="Descreva o que será feito..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tempoEstimado">Tempo Estimado</Label>
                    <Input
                      id="tempoEstimado"
                      value={formData.tempoEstimado}
                      onChange={(e) => setFormData({ ...formData, tempoEstimado: e.target.value })}
                      placeholder="Ex: 2 semanas"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataCriacao">Data</Label>
                    <Input
                      id="dataCriacao"
                      type="date"
                      value={formData.dataCriacao}
                      onChange={(e) => setFormData({ ...formData, dataCriacao: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Itens do Orçamento */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Itens do Orçamento</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addServicoItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedServicosItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        {/*Campo de texto livre*/}
                        <Input
                          type='text'
                          placeholder='Descrição do Item'
                          value={item.nomeItem}
                          onChange={(e) => updateServicoItem(index, 'nomeItem', e.target.value)}
                          className='flex-1'
                        />
                        {/* Valor */}
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Valor"
                          value={item.valor}
                          onChange={(e) => updateServicoItem(index, 'valor', e.target.value)}
                          className="w-32"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeServicoItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedServicosItems.length > 0 && (
                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-bold text-accent">
                        R$ {calculateTotal().toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Criar Orçamento
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orcamentos.map((orcamento) => {
            const items = getOrcamentoItems(orcamento.id);
            const total = getOrcamentoTotal(orcamento.id);
            return (
              <Card key={orcamento.id} className="card-hover border-0 shadow-lg overflow-hidden group bg-gradient-to-br from-card to-card/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-success opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">
                        {getServicoNome(orcamento.servicoId)}

                        </CardTitle>
                        <CardDescription className="mt-1 font-medium">
                          {getClienteNome(orcamento.clienteId)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={
                      orcamento.status === 'aprovado' ? 'default' :
                      orcamento.status === 'pendente' ? 'secondary' : 'outline'
                    } className="shadow-sm">
                      {orcamento.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {orcamento.detalhes}
                  </p>
                  <div className="bg-gradient-accent rounded-xl p-4 shadow-md">
                    <div className="text-xs text-white/80 font-medium mb-1">Valor Total</div>
                    <div className="text-3xl font-bold text-white">
                      R$ {total.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted/50 rounded-lg px-3 py-2">
                      <div className="text-xs text-muted-foreground font-medium mb-1">Data</div>
                      <div className="text-sm font-semibold text-foreground">
                        {new Date(orcamento.dataCriacao).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    {orcamento.tempoEstimado && (
                      <div className="bg-muted/50 rounded-lg px-3 py-2">
                        <div className="text-xs text-muted-foreground font-medium mb-1">Tempo</div>
                        <div className="text-sm font-semibold text-foreground">
                          {orcamento.tempoEstimado}
                        </div>
                      </div>
                    )}
                  </div>
                  {items.length > 0 ? (
                    <div className="border-t pt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Itens</p>
                      <ul className="text-sm space-y-1.5">
                        {items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between text-foreground">
                            <span className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {item.nomeItem?.trim() || "Item sem descrição"}
                            </span>
                            <span className="text-muted-foreground">
                              R$ {item.valor.toLocaleString('pt-BR')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sem itens cadastrados</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    {/* Botão aprovado */}
                    {orcamento.status === 'pendente' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 hover:bg-success hover:text-success-foreground hover:border-success transition-colors"
                        onClick={() => {
                          updateOrcamento(orcamento.id, { status: 'aprovado' });
                          toast.success('Orçamento aprovado!');
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    )}
                    {/* Botão cancelar */}
                    {orcamento.status === 'pendente' &&(
                      <Button
                        size='sm'
                        variant='outline'
                        className='flex-1 hover:bg-destructive/80 hover:text-destructive-foreground hover:border-destructive transition-colors'
                        onClick={() => {
                          updateOrcamento(orcamento.id, { status: 'cancelado'});
                          toast.error('Orçamento cancelado!');
                        }}
                        >
                          Cancelar
                      </Button>
                    )}
                    {/* Botão editar */}
                    {orcamento.status !== 'cancelado' && (
                      <Button
                        size='sm'
                        variant='outline'
                        className='hover:bg-primary/10 hover:text-primary'
                        onClick={() => handleEdit(orcamento)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                      onClick={() => handleDelete(orcamento.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orcamentos;
