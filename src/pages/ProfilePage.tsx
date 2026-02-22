import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { User, Mail, Heart, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { profile, setProfile, donations } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const userDonations = donations.filter(d => d.email === profile.email);
  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0);

  const handleSave = () => {
    setProfile({ name, email });
    setEditing(false);
  };

  return (
    <div className="pb-24">
      <div className="bg-primary px-4 pb-6 pt-8">
        <h1 className="text-2xl font-extrabold text-primary-foreground">Perfil</h1>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-3">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <User size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
                    Salvar
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg font-bold text-foreground">{profile.name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail size={12} />
                    <span>{profile.email}</span>
                  </div>
                </>
              )}
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} className="rounded-full p-2 hover:bg-muted">
                <Settings size={18} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-accent p-4 text-center">
            <Heart className="mx-auto mb-1 text-primary" size={20} />
            <p className="text-xl font-extrabold text-foreground">R${totalDonated}</p>
            <p className="text-[10px] text-muted-foreground">Total doado</p>
          </div>
          <div className="rounded-2xl bg-accent p-4 text-center">
            <Heart className="mx-auto mb-1 text-primary" size={20} />
            <p className="text-xl font-extrabold text-foreground">{userDonations.length}</p>
            <p className="text-[10px] text-muted-foreground">Doações feitas</p>
          </div>
        </div>

        {/* Donation history */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Minhas Doações</h2>
          {userDonations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma doação ainda. Que tal começar?</p>
          ) : (
            <div className="space-y-2">
              {userDonations.map(d => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.campaignName}</p>
                    <p className="text-[10px] text-muted-foreground">{d.date}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">R${d.amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin link */}
        <Link
          to="/admin"
          className="mt-8 block rounded-xl border border-border bg-card p-4 text-center text-sm font-semibold text-muted-foreground hover:border-primary transition-colors"
        >
          ⚙️ Painel Administrativo
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
