/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  User, 
  Lock, 
  TrendingUp, 
  Gift, 
  Zap, 
  ChevronRight, 
  ArrowRight, 
  History, 
  Wallet,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  LogOut,
  MessageCircle,
  Activity
} from 'lucide-react';

// --- Types ---
type View = 'landing' | 'register' | 'login' | 'dashboard';
type Tab = 'pronostics' | 'jeux-concours' | 'automise';

interface Prediction {
  id: string;
  match: string;
  sport: string;
  date: string;
  time: string;
  prediction: string;
  status: 'pending' | 'won' | 'lost';
}

interface Investment {
  id: string;
  amount: number;
  date: string;
  status: string;
}

// --- Mock Data ---
const MOCK_PREDICTIONS: Prediction[] = [
  { id: '1', match: 'Chelsea – Match de football', sport: 'Football', date: 'Jeudi 15 mars', time: '20h00', prediction: 'Pari gagnant', status: 'pending' },
  { id: '2', match: 'Real Madrid vs Man City', sport: 'Football', date: 'Mardi 20 mars', time: '21h00', prediction: 'Plus de 2.5 buts', status: 'pending' },
  { id: '3', match: 'Lakers vs Warriors', sport: 'Basketball', date: 'Mercredi 21 mars', time: '03h00', prediction: 'Victoire Lakers', status: 'pending' },
];

const MOCK_INVESTMENTS: Investment[] = [
  { id: '1', amount: 500, date: '12/02/2024', status: 'Actif' },
  { id: '2', amount: 1500, date: '01/01/2024', status: 'Terminé' },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('pronostics');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [investAmount, setInvestAmount] = useState(500);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const WHATSAPP_NUMBER = '33757828250'; // International format for 07 57 82 82 50

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: accessCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setView('dashboard');
        setError('');
      } else {
        setError(data.message || 'Code incorrect');
      }
    } catch (err: any) {
      setError(`Erreur: ${err.message || 'Problème de connexion au serveur'}`);
    }
  };

  const sendWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleInvest = () => {
    sendWhatsApp(`Bonjour LH-SCORE, je souhaite investir un montant de ${investAmount}€ dans le programme AUTOMISE.`);
  };

  const handleWithdraw = () => {
    sendWhatsApp(`Bonjour LH-SCORE, je souhaite effectuer un retrait de mes gains AUTOMISE.`);
  };

  // --- Components ---

  return (
    <div className="font-sans selection:bg-primary selection:text-black">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" />
        ) : (
          <>
            {view === 'landing' && (
              <LandingPage 
                key="landing" 
                setView={setView} 
              />
            )}
            {view === 'register' && (
              <RegisterPage 
                key="register" 
                setView={setView} 
              />
            )}
            {view === 'login' && (
              <LoginPage 
                key="login" 
                setView={setView} 
                accessCode={accessCode}
                setAccessCode={setAccessCode}
                handleLogin={handleLogin}
                error={error}
              />
            )}
            {view === 'dashboard' && (
              <Dashboard 
                key="dashboard" 
                setIsLoggedIn={setIsLoggedIn}
                setView={setView}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                investAmount={investAmount}
                setInvestAmount={setInvestAmount}
                handleInvest={handleInvest}
                handleWithdraw={handleWithdraw}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SplashScreen Component ---

const SplashScreen = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
  >
    {/* Animated Background Elements */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0.1, 0.2, 0.1]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] border-[1px] border-primary/10 rounded-full"
    />
    
    <div className="relative z-10 flex flex-col items-center">
      {/* Animated Football/Icon */}
      <motion.div
        initial={{ y: -100, opacity: 0, rotate: -180 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: 0.2
        }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-primary/20">
          <Trophy className="text-primary w-20 h-20" />
        </div>
        
        {/* Floating Balls Animation */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              rotate: 360
            }}
            transition={{ 
              duration: 2 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4 bg-primary text-black p-2 rounded-full shadow-lg"
          >
            <Activity size={16} />
          </motion.div>
        ))}
      </motion.div>

      {/* Logo Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-7xl font-black tracking-tighter text-white italic mb-2">
          LH-SCORE
        </h1>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[2px] w-8 bg-primary/50" />
          <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase">
            PARIS SPORTIFS
          </span>
          <div className="h-[2px] w-8 bg-primary/50" />
        </div>
      </motion.div>

      {/* Loading Bar */}
      <div className="mt-12 w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-primary to-primary-dark shadow-[0_0_15px_rgba(255,255,0,0.5)]"
        />
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-zinc-500 text-[10px] font-bold uppercase tracking-widest"
      >
        Initialisation du terrain...
      </motion.p>
    </div>

    {/* Decorative Goal Post Style Lines */}
    <div className="absolute bottom-0 left-0 w-full h-32 opacity-10 pointer-events-none">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full border-t-2 border-x-2 border-white rounded-t-3xl" />
    </div>
  </motion.div>
);

// --- Sub-components moved outside to prevent re-mounting ---

const LandingPage = ({ setView }: { setView: (v: View) => void, key?: string }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="z-10 max-w-2xl"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Trophy className="text-primary w-10 h-10" />
        <h1 className="text-6xl font-black tracking-tighter text-white italic">LH-SCORE</h1>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
        Meilleure application de <span className="text-primary">paris sportifs</span>
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('register')}
          className="bg-primary hover:bg-primary-dark text-black font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
          S'inscrire <ArrowRight size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('login')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 px-8 rounded-2xl border border-white/10 flex items-center justify-center gap-2 transition-colors"
        >
          Accès VIP <Lock size={18} />
        </motion.button>
      </div>
    </motion.div>


  </div>
);

const RegisterPage = ({ setView }: { setView: (v: View) => void, key?: string }) => (
  <div className="min-h-screen bg-black p-6 flex flex-col items-center">
    <div className="w-full max-w-md">
      <button onClick={() => setView('landing')} className="text-zinc-400 hover:text-white mb-8 flex items-center gap-2 transition-colors">
        <ChevronRight className="rotate-180" size={20} /> Retour
      </button>

      <h2 className="text-3xl font-bold text-white mb-2">Choisissez votre offre</h2>
      <p className="text-zinc-400 mb-8">Accédez à l'élite du pronostic sportif.</p>

      <div className="space-y-6">
        {/* Offre Basique */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Offre Basique</h3>
              <div className="text-primary font-black text-2xl mt-1">10 € <span className="text-sm font-normal text-zinc-500">/ semaine</span></div>
            </div>
            <div className="bg-zinc-800 p-2 rounded-xl">
              <ShieldCheck className="text-zinc-400" size={24} />
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle2 size={18} className="text-primary" /> Accès aux paris pronostics
            </li>
            <li className="flex items-center gap-3 text-zinc-300">
              <CheckCircle2 size={18} className="text-primary" /> Accès aux jeux-concours
            </li>
          </ul>
          <button 
            onClick={() => window.open('https://pay.sumup.com/b2c/QBONUQ2E', '_blank')}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            S'abonner maintenant
          </button>
          <button 
            onClick={() => window.open('https://wa.me/33757828250?text=Bonjour,%20j’ai%20effectué%20un%20paiement%20pour%20rejoindre%20le%20VIP.', '_blank')}
            className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left w-full"
          >
            <p className="text-sm font-bold text-white leading-snug">
              👉 Une fois que vous avez effectué le paiement, cliquez ici pour nous envoyer un message sur WhatsApp au : 
              <span className="text-white block text-xl mt-1 font-black">07 57 82 82 50</span>
            </p>
          </button>
        </motion.div>

        {/* Offre Complète */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-primary/20 to-black border-2 border-primary rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-primary/10"
        >
          <div className="absolute top-4 right-4 bg-primary text-black text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
            Premium
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Offre Complète</h3>
              <div className="text-primary font-black text-2xl mt-1">25 € <span className="text-sm font-normal text-zinc-500">/ mois</span></div>
            </div>
            <div className="bg-primary p-2 rounded-xl">
              <Zap className="text-black" size={24} />
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-zinc-100">
              <CheckCircle2 size={18} className="text-primary" /> Accès aux paris pronostics
            </li>
            <li className="flex items-center gap-3 text-zinc-100">
              <CheckCircle2 size={18} className="text-primary" /> Accès aux jeux-concours
            </li>
            <li className="flex items-center gap-3 text-zinc-100">
              <CheckCircle2 size={18} className="text-primary" /> Accès à Automise
            </li>
          </ul>
          <button 
            onClick={() => window.open('https://pay.sumup.com/b2c/Q6ZB2GYO', '_blank')}
            className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            S'abonner maintenant
          </button>
          <button 
            onClick={() => window.open('https://wa.me/33757828250?text=Bonjour,%20j’ai%20effectué%20un%20paiement%20pour%20rejoindre%20le%20VIP.', '_blank')}
            className="mt-4 p-4 rounded-2xl border border-white/20 bg-primary/5 hover:bg-primary/10 transition-all text-left w-full"
          >
            <p className="text-sm font-bold text-white leading-snug">
              👉 Une fois que vous avez effectué le paiement, cliquez ici pour nous envoyer un message sur WhatsApp au : 
              <span className="text-white block text-xl mt-1 font-black">07 57 82 82 50</span>
            </p>
          </button>
        </motion.div>
      </div>
    </div>
  </div>
);

const LoginPage = ({ 
  setView, accessCode, setAccessCode, handleLogin, error 
}: { 
  setView: (v: View) => void;
  accessCode: string;
  setAccessCode: (s: string) => void;
  handleLogin: () => void | Promise<void>;
  error: string;
  key?: string;
}) => (
  <div className="min-h-screen bg-black p-6 flex flex-col items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm bg-zinc-900/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="text-primary" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white">Accès VIP</h2>
        <p className="text-zinc-500 text-sm">Entrez votre code d'accès</p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Code d'accès"
            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-center text-2xl tracking-[0.5em] font-black focus:outline-none focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {error && <p className="text-red-500 text-xs mt-4 text-center font-medium">{error}</p>}
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-primary/20"
        >
          Accéder au VIP
        </button>

        <button 
          onClick={() => setView('landing')}
          className="w-full py-2 text-zinc-500 hover:text-white text-sm transition-colors"
        >
          Annuler
        </button>
      </div>
    </motion.div>
  </div>
);

const Dashboard = ({ 
  setIsLoggedIn, setView, activeTab, setActiveTab, investAmount, setInvestAmount, handleInvest, handleWithdraw 
}: {
  setIsLoggedIn: (b: boolean) => void;
  setView: (v: View) => void;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  investAmount: number;
  setInvestAmount: (n: number) => void;
  handleInvest: () => void;
  handleWithdraw: () => void;
  key?: string;
}) => (
  <div className="min-h-screen bg-black flex flex-col">
    {/* Header */}
    <header className="p-6 flex justify-between items-center border-bottom border-white/5 sticky top-0 bg-black/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-2">
        <Trophy className="text-primary" size={24} />
        <span className="font-black italic text-xl tracking-tighter">LH-SCORE</span>
      </div>
      <button 
        onClick={() => { setIsLoggedIn(false); setView('landing'); }}
        className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-colors"
      >
        <LogOut size={20} />
      </button>
    </header>

    {/* Tabs Navigation */}
    <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
      {(['pronostics', 'jeux-concours', 'automise'] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-3 rounded-2xl font-bold text-sm capitalize transition-all whitespace-nowrap ${
            activeTab === tab 
              ? 'bg-primary text-black shadow-lg shadow-primary/20' 
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Main Content */}
    <main className="flex-1 p-6 pb-24">
      <AnimatePresence mode="wait">
        {activeTab === 'pronostics' && (
          <motion.div
            key="pronostics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} /> Pronostics du jour
            </h3>
            {MOCK_PREDICTIONS.map((pred) => (
              <div key={pred.id} className="bg-zinc-900/50 border border-white/10 p-5 rounded-3xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-white">{pred.match}</h4>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">{pred.sport}</p>
                  </div>
                  <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-lg uppercase">
                    Premium
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                    <Calendar size={14} /> {pred.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                    <Clock size={14} /> {pred.time}
                  </div>
                </div>
                <div className="bg-black/50 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Pronostic :</span>
                  <span className="text-primary font-bold">{pred.prediction}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'jeux-concours' && (
          <motion.div
            key="jeux"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gift className="text-primary" size={20} /> Jeux-Concours
            </h3>
            <div className="bg-zinc-900/50 border border-white/10 rounded-[2rem] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-primary" size={40} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2 italic">Bientôt disponible</h4>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Nos jeux-concours exclusifs arrivent très prochainement. Restez connectés pour ne rien manquer !
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'automise' && (
          <motion.div
            key="automise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-primary" size={20} /> AUTOMISE
            </h3>
            
            <div className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="text-primary" size={40} />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2 italic">Bientôt disponible</h4>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Le système d'investissement AUTOMISE est en cours de maintenance et sera de retour très bientôt.
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <button 
                  onClick={() => window.open('https://wa.me/33757828250?text=Bonjour,%20je%20souhaite%20avoir%20plus%20d\'informations%20sur%20AUTOMISE.', '_blank')}
                  className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
                >
                  <MessageCircle size={20} /> Plus d'infos sur WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>

    {/* Bottom Navigation (Mobile Style) */}
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-around items-center z-40">
      <button 
        onClick={() => setActiveTab('pronostics')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'pronostics' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <TrendingUp size={24} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Pronos</span>
      </button>
      <button 
        onClick={() => setActiveTab('jeux-concours')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'jeux-concours' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <Gift size={24} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Jeux</span>
      </button>
      <button 
        onClick={() => setActiveTab('automise')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'automise' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <Zap size={24} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Automise</span>
      </button>
    </nav>
  </div>
);
