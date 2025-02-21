import React, { useState, useEffect } from 'react';
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Table } from './ui/Table';

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

  const transactionColumns = [
    { header: 'Item Name', accessor: 'itemName' },
    { header: 'Type', accessor: 'type' },
    { header: 'Total', accessor: 'total' },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <Card title="Total Inventory Items">
            <p className="display-4">{totalItems}</p>
          </Card>
        </div>
        <div className="col-md-4">
          <Card title="Low Stock Items">
            <p className="display-4">{lowStockItems}</p>
          </Card>
        </div>
        <div className="col-md-4">
          <Card title="Total Sales">
            <p className="display-4">${totalSales.toFixed(2)}</p>
          </Card>
        </div>
      </div>
      <Card title="Recent Transactions">
        <Table
          columns={transactionColumns}
          data={recentTransactions}
          actions={(transaction: Transaction) => (
            <span className={`badge ${transaction.type === 'sale' ? 'bg-success' : 'bg-danger'}`}>
              {transaction.type === 'sale' ? '+' : '-'}${transaction.total.toFixed(2)}
            </span>
          )}
        />
      </Card>
    </div>
  );
}

