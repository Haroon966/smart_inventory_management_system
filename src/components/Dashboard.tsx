import { useState, useEffect } from 'react';
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';
import { notificationStore } from '../utils/notificationStore';
import { Card } from './ui/Card';
import { LineChart, BarChart } from './ui/Charts';
import '../App.css';

export function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState(dataStore.getSettings());

  useEffect(() => {
    const updateData = () => {
      const newInventory = dataStore.getInventory();
      const newTransactions = dataStore.getTransactions();
      const newSettings = dataStore.getSettings();

      // Check for low stock items
      newInventory.forEach(item => {
        if (item.quantity < newSettings.lowStockThreshold) {
          notificationStore.addNotification(
            'warning',
            `Low stock alert: ${item.name} (${item.quantity} remaining)`
          );
        }
      });

      // Check for large transactions
      const recentTransactions = newTransactions.slice(-5);
      recentTransactions.forEach(transaction => {
        if (transaction.total > 1000) {
          notificationStore.addNotification(
            'info',
            `Large ${transaction.type}: ${transaction.itemName} ($${transaction.total.toFixed(2)})`
          );
        }
      });

      setInventory(newInventory);
      setTransactions(newTransactions);
      setSettings(newSettings);
    };

    // Check for new device login (example)
    const userAgent = navigator.userAgent;
    const lastUserAgent = localStorage.getItem('lastUserAgent');
    if (lastUserAgent !== userAgent) {
      notificationStore.addNotification(
        'info',
        'New device login detected'
      );
      localStorage.setItem('lastUserAgent', userAgent);
    }

    updateData();
    const intervalId = setInterval(updateData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < settings.lowStockThreshold).length;
  const totalSales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.total, 0);
  const recentTransactions = transactions.slice(-5).reverse();

  // Enhanced chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [30, 40, 35, 50, 49, 60],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const productData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Stock Level',
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-4">
          <select className="form-select bg-card border border-border rounded-md p-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <Card title="Overview" className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory</p>
              <h3 className="text-2xl font-bold text-foreground mt-2">{totalItems}</h3>
              <p className="text-sm text-success-600 mt-2">+12% from last month</p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </Card>

        <Card title="Low Stock Items" className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-foreground mt-2">{lowStockItems}</h3>
              <p className="text-sm text-warning-600 mt-2">5 items need restock</p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </Card>

        <Card title="Total Sales" className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold text-foreground mt-2">Rs.{totalSales.toFixed(2)}</h3>
              <p className="text-sm text-success-600 mt-2">+8% from last month</p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and Transactions */}
      <div className="dashboard-grid">
        <Card title="Sales Overview">
          <LineChart data={salesData} />
        </Card>

        <Card title="Product Distribution">
          <BarChart data={productData} />
        </Card>

        {/* Full-width Recent Transactions */}
        <Card title="Recent Transactions" className="full-width">
          <div className="overflow-x-auto">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div className="transaction-item">
                        <div className="transaction-icon">
                          {transaction.type === 'sale' ? '💰' : '🛍️'}
                        </div>
                        <div className="transaction-details">
                          <span className="font-medium">{transaction.itemName}</span>
                          <span className="transaction-id">#{transaction.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        transaction.type === 'sale' 
                          ? 'status-badge-success' 
                          : transaction.type === 'purchase'
                          ? 'status-badge-info'
                          : 'status-badge-warning'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>
                      <span className={`font-medium ${
                        transaction.type === 'sale' 
                          ? 'text-success-600' 
                          : 'text-info-600'
                      }`}>
                        {transaction.type === 'sale' ? '+' : '-'}Rs.{transaction.total.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-badge-success">
                        Completed
                      </span>
                    </td>
                    <td>
                      <span className="text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

