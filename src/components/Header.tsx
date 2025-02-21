import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import '../index.css';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export function Header({ setCurrentPage, currentPage }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  const pages = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'inventory', icon: '📦', label: 'Inventory' },
    { id: 'transactions', icon: '💳', label: 'Transactions' },
    { id: 'reports', icon: '📈', label: 'Reports' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-effect shadow-custom-lg sticky top-0 z-50"
      transition={{ duration: 0.3 }}
    >
      <div className="container-fluid mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <motion.span 
            className="text-xl font-bold flex items-center gap-2 text-foreground"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h1 className="hidden sm:inline">Smart Inventory Management System</h1>
          </motion.span>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 sm:space-x-2 glass-effect rounded-full p-1">
              <AnimatePresence mode="wait">
                {pages.map((page) => (
                  <motion.button 
                    key={page.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-3 py-2 rounded-full transition-all duration-200 flex items-center gap-2
                      ${currentPage === page.id 
                        ? 'bg-gradient-primary text-primary-50 shadow-custom' 
                        : 'text-foreground hover-accent'
                      }
                    `}
                    onClick={() => setCurrentPage(page.id)}
                  >
                    <span className="text-lg">{page.icon}</span>
                    <span className="hidden sm:inline">
                      {page.label}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full glass-effect text-foreground hover-accent"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

