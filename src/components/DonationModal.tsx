import { useState } from 'react';
import { X, Gift, Star, Sparkles, Utensils, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  campaignId?: string;
  campaignName?: string;
  onSuccess?: (name: string, amount: number) => void;
}

const ORDER_BUMP_PRICE = 6.99;

const DonationModal = ({ open, onClose, amount, campaignId, campaignName, onSuccess }: DonationModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [orderBump, setOrderBump] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; transaction_id: number } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const finalAmount = orderBump ? amount + ORDER_BUMP_PRICE : amount;
  const amountInCentavos = Math.round(finalAmount * 100);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !document.trim() || !phone.trim()) return;

    const cleanDoc = document.replace(/\D/g, '');
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanDoc.length < 11) {
      toast.error('CPF inválido');
      return;
    }
    if (cleanPhone.length < 10) {
      toast.error('Telefone inválido');
      return;
    }

    setLoading(true);

    try {
      const reference = `campaign-${campaignId || 'food'}-${Date.now()}`;

      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: {
          amount: amountInCentavos,
          description: campaignName || 'Doação Patas do Bem',
          reference,
          customer: {
            name: name.trim(),
            email: email.trim(),
            document: cleanDoc,
            phone: cleanPhone,
          },
        },
      });

      if (error) throw error;

      if (data?.qr_code) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
          transaction_id: data.transaction_id,
        });
        onSuccess?.(name, finalAmount);
      } else {
        throw new Error(data?.error || 'Erro ao gerar PIX');
      }
    } catch (err: any) {
      console.error('PIX error:', err);
      toast.error('Erro ao gerar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData?.qr_code) return;
    try {
      await navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleClose = () => {
    setPixData(null);
    setCopied(false);
    setName('');
    setEmail('');
    setDocument('');
    setPhone('');
    setOrderBump(false);
    onClose();
  };

  // ─── PIX QR Code Screen ───
  if (pixData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-card p-6 animate-slide-up shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Pague com PIX</h3>
            <button onClick={handleClose} className="rounded-full p-2 hover:bg-muted transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-accent p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">Valor a pagar</p>
              <p className="text-3xl font-extrabold text-primary">
                R$ {finalAmount.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* QR Code */}
            {pixData.qr_code_base64 && (
              <div className="flex justify-center">
                <img
                  src={pixData.qr_code_base64}
                  alt="QR Code PIX"
                  className="h-48 w-48 rounded-xl border border-border"
                />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Escaneie o QR Code com o app do seu banco ou copie o código abaixo
            </p>

            {/* Copy button */}
            <button
              onClick={handleCopyPix}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                copied
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar Código PIX</>}
            </button>

            <div className="rounded-xl bg-accent/50 p-3">
              <p className="text-[10px] text-muted-foreground break-all font-mono">
                {pixData.qr_code.slice(0, 80)}...
              </p>
            </div>

            <p className="text-[10px] text-muted-foreground">
              Após o pagamento, a doação será confirmada automaticamente 💚
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Donation Form ───
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
              <p className="text-[10px] text-muted-foreground">Pagamento via PIX</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-muted transition-colors">
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
            <label className="text-xs font-medium text-muted-foreground">Nome completo</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={document}
                onChange={e => setDocument(formatCpf(e.target.value))}
                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
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
            disabled={loading}
            className="w-full rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98] hover:opacity-90 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Gerando PIX...</>
            ) : (
              orderBump ? '💎 Gerar PIX com Bônus' : '💚 Gerar PIX'
            )}
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
