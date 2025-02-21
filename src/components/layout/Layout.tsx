import { motion } from 'framer-motion';
import { Header } from '../Header';
import { Notifications } from '../Notifications';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Sidebar - 2 columns on desktop, full width on mobile */}
        <aside className="col-span-12 lg:col-span-2 space-y-6">
          <Notifications />
        </aside>

        {/* Main Content - 10 columns on desktop, full width on mobile */}
        <main className="col-span-12 lg:col-span-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 