import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Plus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import dog1 from '@/assets/dog1.jpg';

const AdminPage = () => {
  const { campaigns, addCampaign, updateCampaign, addCampaignUpdate } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState<string | null>(null);

  // Create form
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'Ativa' | 'Urgente'>('Ativa');

  // Edit form
  const [editGoal, setEditGoal] = useState('');

  // Update form
  const [updateText, setUpdateText] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addCampaign({
      name: newName,
      image: dog1,
      location: newLocation,
      status: newStatus,
      goal: parseInt(newGoal),
      description: newDescription,
    });
    setNewName('');
    setNewLocation('');
    setNewGoal('');
    setNewDescription('');
    setShowCreate(false);
    toast.success('Campanha criada com sucesso!');
  };

  const handleEditGoal = (id: string) => {
    updateCampaign(id, { goal: parseInt(editGoal) });
    setEditingId(null);
    setEditGoal('');
    toast.success('Meta atualizada!');
  };

  const handleAddUpdate = (id: string) => {
    addCampaignUpdate(id, {
      text: updateText,
      date: new Date().toISOString().split('T')[0],
    });
    setUpdateText('');
    setShowUpdateForm(null);
    toast.success('Atualização adicionada!');
  };

  return (
    <div className="pb-24">
      <div className="bg-primary px-4 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <Link to="/perfil" className="rounded-full bg-primary-foreground/20 p-2">
            <ArrowLeft size={18} className="text-primary-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-primary-foreground">Admin</h1>
            <p className="text-sm text-primary-foreground/80">Gerencie campanhas</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-3">
        {/* Create button */}
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
        >
          <Plus size={18} /> Nova Campanha
        </button>

        {/* Create form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 animate-slide-up">
            <input type="text" placeholder="Nome da campanha" value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            <input type="text" placeholder="Localização" value={newLocation} onChange={e => setNewLocation(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            <input type="number" placeholder="Meta (R$)" value={newGoal} onChange={e => setNewGoal(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            <select value={newStatus} onChange={e => setNewStatus(e.target.value as 'Ativa' | 'Urgente')}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="Ativa">Ativa</option>
              <option value="Urgente">Urgente</option>
            </select>
            <textarea placeholder="Descrição" value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" required />
            <button type="submit" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
              Criar Campanha
            </button>
          </form>
        )}

        {/* Campaign list */}
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">R${c.raised} / R${c.goal} · {c.donors} doadores</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingId(editingId === c.id ? null : c.id); setEditGoal(c.goal.toString()); }}
                    className="rounded-lg p-2 hover:bg-muted"
                  >
                    <Edit2 size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setShowUpdateForm(showUpdateForm === c.id ? null : c.id)}
                    className="rounded-lg p-2 hover:bg-muted"
                  >
                    <Plus size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {editingId === c.id && (
                <div className="mt-3 flex gap-2">
                  <input type="number" value={editGoal} onChange={e => setEditGoal(e.target.value)}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button onClick={() => handleEditGoal(c.id)}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                    Salvar
                  </button>
                </div>
              )}

              {showUpdateForm === c.id && (
                <div className="mt-3 space-y-2">
                  <textarea placeholder="Texto da atualização..." value={updateText} onChange={e => setUpdateText(e.target.value)} rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  <button onClick={() => handleAddUpdate(c.id)}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                    Adicionar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
