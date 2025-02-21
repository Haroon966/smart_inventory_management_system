import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';

export function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState(dataStore.getSettings());

  useEffect(() => {
    const updateData = () => {
      setInventory(dataStore.getInventory());
      setTransactions(dataStore.getTransactions());
      setSettings(dataStore.getSettings());
    };

    updateData();
    const intervalId = setInterval(updateData, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < settings.lowStockThreshold).length;
  const totalSales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.total, 0);
  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{lowStockItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentTransactions.map(transaction => (
              <li key={transaction.id} className="flex justify-between items-center">
                <span>{transaction.itemName}</span>
                <span className={transaction.type === 'sale' ? 'text-green-500' : 'text-red-500'}>
                  {transaction.type === 'sale' ? '+' : '-'}${transaction.total.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

