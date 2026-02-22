import { useState } from 'react';
import { X, Gift, Star, Sparkles, Utensils } from 'lucide-react';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  onConfirm: (name: string, email: string, orderBump: boolean) => void;
}

const ORDER_BUMP_PRICE = 6.99;

const DonationModal = ({ open, onClose, amount, onConfirm }: DonationModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderBump, setOrderBump] = useState(false);

  if (!open) return null;

  const finalAmount = orderBump ? amount + ORDER_BUMP_PRICE : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onConfirm(name, email, orderBump);
    setName('');
    setEmail('');
    setOrderBump(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-card p-6 animate-slide-up shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Finalizar Doação</h3>
              <p className="text-[10px] text-muted-foreground">Sua doação faz a diferença!</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Amount display */}
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary/5 to-accent p-5 text-center border border-primary/10">
          <p className="text-xs text-muted-foreground mb-1">Valor da doação</p>
          <p className="text-4xl font-extrabold text-primary">
            R$ {amount.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Order Bump */}
        <div
          onClick={() => setOrderBump(!orderBump)}
          className={`mb-5 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
            orderBump
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-dashed border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
              orderBump ? 'border-primary bg-primary' : 'border-muted-foreground/30'
            }`}>
              {orderBump && <span className="text-[10px] text-primary-foreground font-bold">✓</span>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Gift size={16} className="text-primary" />
                <span className="text-sm font-extrabold text-foreground">
                  SIM! Quero adicionar +R$ {ORDER_BUMP_PRICE.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Potencialize sua doação e ganhe regalias exclusivas:
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Star size={12} className="text-primary flex-shrink-0" />
                  <span>🎁 Participe do <b>sorteio mensal</b> de prêmios</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Star size={12} className="text-primary flex-shrink-0" />
                  <span>🏆 Campanha fica <b>destacada</b> no site</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Utensils size={12} className="text-primary flex-shrink-0" />
                  <span>🐾 Parte vai para o <b>fundo de ração</b></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <Star size={12} className="text-primary flex-shrink-0" />
                  <span>💚 Selo de <b>Doador VIP</b> no seu perfil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Seu nome</label>
            <input
              type="text"
              placeholder="Como quer ser identificado?"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Seu email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Total */}
          {orderBump && (
            <div className="rounded-xl bg-accent/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total com bônus</p>
              <p className="text-2xl font-extrabold text-primary">
                R$ {finalAmount.toFixed(2).replace('.', ',')}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98] hover:opacity-90 shadow-lg"
          >
            {orderBump ? '💎 Doar com Bônus' : '💚 Confirmar Doação'}
          </button>

          <p className="text-[10px] text-center text-muted-foreground">
            Doação como visitante · Não precisa de conta
          </p>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
