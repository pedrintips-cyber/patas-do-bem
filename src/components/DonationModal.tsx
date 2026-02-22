import { useState } from 'react';
import { X } from 'lucide-react';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onConfirm: (name: string, email: string) => void;
}

const DonationModal = ({ open, onClose, amount, onConfirm }: DonationModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onConfirm(name, email);
    setName('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-card p-6 animate-slide-up shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Confirmar Doação</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>
        <div className="mb-4 rounded-xl bg-accent p-4 text-center">
          <p className="text-sm text-muted-foreground">Valor da doação</p>
          <p className="text-3xl font-bold text-primary">R$ {amount}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98] hover:opacity-90"
          >
            Confirmar Doação 💚
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
