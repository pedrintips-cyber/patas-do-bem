import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import dog1 from '@/assets/dog1.jpg';
import dog2 from '@/assets/dog2.jpg';
import dog3 from '@/assets/dog3.jpg';
import dog4 from '@/assets/dog4.jpg';
import heroDog from '@/assets/hero-dog.jpg';

export interface Campaign {
  id: string;
  name: string;
  image: string;
  location: string;
  status: 'Ativa' | 'Urgente';
  goal: number;
  raised: number;
  donors: number;
  description: string;
  updates: CampaignUpdate[];
  comments: Comment[];
}

export interface CampaignUpdate {
  id: string;
  text: string;
  date: string;
  image?: string;
}

export interface Comment {
  id: string;
  name: string;
  text: string;
  date: string;
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  campaignId: string | null;
  campaignName: string;
  type: 'campaign' | 'food';
  date: string;
}

export interface FoodData {
  goalKg: number;
  raisedKg: number;
  donors: number;
  pricePerKg: number;
}

export interface SiteConfig {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface UserProfile {
  name: string;
  email: string;
}

interface AppState {
  campaigns: Campaign[];
  donations: Donation[];
  food: FoodData;
  profile: UserProfile;
  siteConfig: SiteConfig;
  addDonation: (donation: Omit<Donation, 'id' | 'date'>) => void;
  addFoodDonation: (kg: number, name: string, email: string) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'donors' | 'raised' | 'updates' | 'comments'>) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  addComment: (campaignId: string, name: string, text: string) => void;
  addCampaignUpdate: (campaignId: string, update: Omit<CampaignUpdate, 'id'>) => void;
  setProfile: (profile: UserProfile) => void;
  updateFoodSettings: (settings: Partial<FoodData>) => void;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
}

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Ajude o Caramelo',
    image: dog1,
    location: 'São Paulo, SP',
    status: 'Urgente',
    goal: 2000,
    raised: 1250,
    donors: 47,
    description: 'Caramelo foi encontrado na beira de uma rodovia, com a pata traseira fraturada. Ele precisa de uma cirurgia urgente para voltar a andar. Com sua ajuda, vamos dar uma nova chance a esse guerreiro! O valor arrecadado será utilizado para cobrir os custos da cirurgia, internação, medicamentos e acompanhamento veterinário.',
    updates: [
      { id: '1', text: 'Caramelo passou pela primeira consulta e está estável!', date: '2026-02-18' },
      { id: '2', text: 'Cirurgia agendada para próxima semana. Continuem doando!', date: '2026-02-20' },
    ],
    comments: [
      { id: '1', name: 'Maria Silva', text: 'Força Caramelo! 💚', date: '2026-02-19' },
      { id: '2', name: 'Pedro Santos', text: 'Doei com o coração. Melhoras!', date: '2026-02-20' },
    ],
  },
  {
    id: '2',
    name: 'Resgate da Luna',
    image: dog2,
    location: 'Rio de Janeiro, RJ',
    status: 'Ativa',
    goal: 3000,
    raised: 890,
    donors: 32,
    description: 'Luna é uma cachorrinha dócil que foi abandonada grávida. Ela precisa de cuidados especiais para o parto e para os filhotes. Ajude-nos a garantir que Luna e seus bebês tenham um começo de vida seguro e saudável.',
    updates: [
      { id: '1', text: 'Luna está em um lar temporário recebendo cuidados.', date: '2026-02-17' },
    ],
    comments: [
      { id: '1', name: 'Ana Oliveira', text: 'Que linda! Já doei ❤️', date: '2026-02-18' },
    ],
  },
  {
    id: '3',
    name: 'Thor precisa de você',
    image: dog3,
    location: 'Belo Horizonte, MG',
    status: 'Ativa',
    goal: 1500,
    raised: 420,
    donors: 18,
    description: 'Thor é um filhote que nasceu com uma condição cardíaca rara. Ele precisa de um tratamento contínuo para ter qualidade de vida. Cada doação conta para manter Thor forte e feliz!',
    updates: [],
    comments: [],
  },
  {
    id: '4',
    name: 'Operação Neve',
    image: dog4,
    location: 'Curitiba, PR',
    status: 'Urgente',
    goal: 2500,
    raised: 1800,
    donors: 65,
    description: 'Neve foi resgatada de uma situação de maus-tratos. Está se recuperando, mas ainda precisa de cirurgia reconstrutiva e muito carinho. Ajude Neve a recomeçar!',
    updates: [
      { id: '1', text: 'Neve já come sozinha e está ganhando peso!', date: '2026-02-19' },
      { id: '2', text: 'Exames mostram evolução positiva!', date: '2026-02-21' },
    ],
    comments: [
      { id: '1', name: 'Carlos Mendes', text: 'Neve merece todo amor do mundo!', date: '2026-02-20' },
    ],
  },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [donations, setDonations] = useState<Donation[]>([
    { id: '1', name: 'Maria Silva', email: 'maria@email.com', amount: 50, campaignId: '1', campaignName: 'Ajude o Caramelo', type: 'campaign', date: '2026-02-18' },
    { id: '2', name: 'Pedro Santos', email: 'pedro@email.com', amount: 100, campaignId: '2', campaignName: 'Resgate da Luna', type: 'campaign', date: '2026-02-19' },
    { id: '3', name: 'Ana Oliveira', email: 'ana@email.com', amount: 25, campaignId: null, campaignName: 'Ração', type: 'food', date: '2026-02-20' },
  ]);
  const [food, setFood] = useState<FoodData>({ goalKg: 500, raisedKg: 280, donors: 43, pricePerKg: 10 });
  const [profile, setProfile] = useState<UserProfile>({ name: 'Visitante', email: 'visitante@email.com' });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    heroImage: heroDog,
    heroTitle: 'Juntos salvamos vidas 🐶',
    heroSubtitle: 'Patas do Bem – ONG de resgate animal',
  });

  const addDonation = useCallback((donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setDonations(prev => [newDonation, ...prev]);

    if (donation.campaignId) {
      setCampaigns(prev =>
        prev.map(c =>
          c.id === donation.campaignId
            ? { ...c, raised: c.raised + donation.amount, donors: c.donors + 1 }
            : c
        )
      );
    }
  }, []);

  const addFoodDonation = useCallback((kg: number, name: string, email: string) => {
    setFood(prev => {
      const amount = kg * prev.pricePerKg;
      const newDonation: Donation = {
        id: Date.now().toString(),
        name,
        email,
        amount,
        campaignId: null,
        campaignName: 'Ração',
        type: 'food',
        date: new Date().toISOString().split('T')[0],
      };
      setDonations(prevD => [newDonation, ...prevD]);
      return { ...prev, raisedKg: prev.raisedKg + kg, donors: prev.donors + 1 };
    });
  }, []);

  const addCampaign = useCallback((campaign: Omit<Campaign, 'id' | 'donors' | 'raised' | 'updates' | 'comments'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      raised: 0,
      donors: 0,
      updates: [],
      comments: [],
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  }, []);

  const updateCampaign = useCallback((id: string, data: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const deleteCampaign = useCallback((id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  const addComment = useCallback((campaignId: string, name: string, text: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              comments: [...c.comments, {
                id: Date.now().toString(),
                name,
                text,
                date: new Date().toISOString().split('T')[0],
              }],
            }
          : c
      )
    );
  }, []);

  const addCampaignUpdate = useCallback((campaignId: string, update: Omit<CampaignUpdate, 'id'>) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              updates: [...c.updates, { ...update, id: Date.now().toString() }],
            }
          : c
      )
    );
  }, []);

  const updateFoodSettings = useCallback((settings: Partial<FoodData>) => {
    setFood(prev => ({ ...prev, ...settings }));
  }, []);

  const updateSiteConfig = useCallback((config: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...config }));
  }, []);

  return (
    <AppContext.Provider value={{
      campaigns, donations, food, profile, siteConfig,
      addDonation, addFoodDonation, addCampaign, updateCampaign, deleteCampaign,
      addComment, addCampaignUpdate, setProfile, updateFoodSettings, updateSiteConfig,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
