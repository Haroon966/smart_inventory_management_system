import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Transactions } from './components/Transactions';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion } from 'framer-motion';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'transactions':
        return <Transactions />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
        <main className="container-fluid mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}  
          >
            <Notifications />
            {renderPage()}
          </motion.div>
        </main>
      </div>
    </ThemeProvider>
  );
}

