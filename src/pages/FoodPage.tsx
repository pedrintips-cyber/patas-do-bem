import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import ProgressBar from '@/components/ProgressBar';
import DonationModal from '@/components/DonationModal';
import { toast } from 'sonner';

const kgOptions = [1, 5, 10, 20];

const FoodPage = () => {
  const { food, addFoodDonation } = useApp();
  const [selectedKg, setSelectedKg] = useState(5);
  const [customKg, setCustomKg] = useState('');
  const [showModal, setShowModal] = useState(false);

  const kg = customKg ? parseInt(customKg) : selectedKg;
  const amount = kg * 10;

  const handleDonation = (name: string, email: string) => {
    addFoodDonation(kg, name, email);
    setShowModal(false);
    setCustomKg('');
    toast.success(`💚 ${name} doou ${kg}kg de ração!`, { duration: 4000 });
  };

  return (
    <div className="pb-24">
      <div className="bg-primary px-4 pb-6 pt-8">
        <h1 className="text-2xl font-extrabold text-primary-foreground">Ajude com ração 🥣</h1>
        <p className="mt-1 text-sm text-primary-foreground/80">R$10 = 1kg de ração</p>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-3">
        {/* Progress */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-slide-up">
          <div className="text-center mb-3">
            <p className="text-sm text-muted-foreground">Meta mensal</p>
            <p className="text-2xl font-extrabold text-foreground">{food.raisedKg}kg <span className="text-muted-foreground font-normal text-base">/ {food.goalKg}kg</span></p>
          </div>
          <ProgressBar current={food.raisedKg * 10} goal={food.goalKg * 10} />
          <p className="mt-2 text-center text-xs text-muted-foreground">{food.donors} doadores este mês</p>
        </div>

        {/* Selection */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Escolha a quantidade</h2>
          <div className="grid grid-cols-4 gap-2">
            {kgOptions.map(k => (
              <button
                key={k}
                onClick={() => { setSelectedKg(k); setCustomKg(''); }}
                className={`rounded-xl border py-4 text-center transition-all ${
                  selectedKg === k && !customKg
                    ? 'border-primary bg-primary text-primary-foreground scale-105'
                    : 'border-border bg-card text-foreground hover:border-primary'
                }`}
              >
                <span className="block text-lg font-bold">{k}kg</span>
                <span className="text-[10px] opacity-80">R${k * 10}</span>
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Outra quantidade (kg)"
            value={customKg}
            onChange={e => setCustomKg(e.target.value)}
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground text-center">
            {kg}kg = <span className="font-bold text-primary">R${amount}</span>
          </p>
          <button
            onClick={() => kg > 0 && setShowModal(true)}
            className="mt-4 w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg transition-transform active:scale-[0.98] hover:opacity-90"
          >
            Doar Ração 🥣
          </button>
        </div>
      </div>

      <DonationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        amount={amount}
        onConfirm={handleDonation}
      />
    </div>
  );
};

export default FoodPage;
