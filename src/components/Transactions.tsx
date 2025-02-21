import { useState, useEffect } from 'react';
import { dataStore, Transaction } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Form, FormGroup } from './ui/Form';
import { Table } from './ui/Table';
import { notificationStore } from '../utils/notificationStore';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'date'>>({ type: 'sale', itemName: '', quantity: 0, total: 0 });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const updatedTransactions = await dataStore.getTransactions();
        setTransactions(updatedTransactions);
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
    const updateInterval = setInterval(loadTransactions, 15000);

    return () => clearInterval(updateInterval);
  }, []);

  const addTransaction = async () => {
    if (!newTransaction.itemName || newTransaction.quantity <= 0 || newTransaction.total <= 0) {
      setError('Please fill in all fields correctly.');
      return;
    }

    const transaction = { 
      ...newTransaction, 
      id: Date.now(), 
      date: new Date().toISOString().split('T')[0] 
    };

    setTransactions(prev => [...prev, transaction]);
    await dataStore.setTransactions([...transactions, transaction]);
    notificationStore.addNotification('success', 'Transaction added successfully');
    setNewTransaction({ type: 'sale', itemName: '', quantity: 0, total: 0 });
    setError(null);
  };

  const deleteTransaction = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
      setTransactions(updatedTransactions);
      dataStore.setTransactions(updatedTransactions);
    }
  };

  const columns = [
    { header: 'Type', accessor: 'type' },
    { header: 'Item Name', accessor: 'itemName' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Total', accessor: 'total' },
    { header: 'Date', accessor: 'date' },
  ];

  const filteredTransactions = transactions.filter(transaction => 
    transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{marginTop: '40px'}}>
      <h2 className="mb-4">Transactions</h2>
      {loading && <div>Loading transactions...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Card title="Add New Transaction">
        <Form onSubmit={addTransaction}>
          <div className="row g-3">
            <div className="col-md-3">
              <FormGroup label="Type" htmlFor="type">
                <select
                  className="form-select"
                  id="type"
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'sale' | 'purchase' | 'return' })}
                >
                  <option value="sale"> Sale</option>
                  <option value="purchase">Purchase </option>
                  <option value="return">Return </option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-3">
              <FormGroup label="Item Name" htmlFor="itemName">
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  value={newTransaction.itemName}
                  onChange={(e) => setNewTransaction({ ...newTransaction, itemName: e.target.value })}
                />
              </FormGroup>
            </div>
            < div className="col-md-2">
              <FormGroup label="Quantity" htmlFor="quantity">
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={newTransaction.quantity}
                  onChange={(e) => setNewTransaction({ ...newTransaction, quantity: parseInt(e.target.value) || 0 })}
                />
              </FormGroup>
            </div>
            <div className="col-md-2">
              <FormGroup label="Total" htmlFor="total">
                <input
                  type="number"
                  className="form-control"
                  id="total"
                  value={newTransaction.total}
                  onChange={(e) => setNewTransaction({ ...newTransaction, total: parseFloat(e.target.value) || 0 })}
                />
              </FormGroup>
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <button type="submit" className="btn btn-primary w-100">Add Transaction</button>
            </div>
          </div>
        </Form>
      </Card>

      <Card title="Filter Transactions">
        <FormGroup label="Search by Item Name" htmlFor="search">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>Clear</button>
          </div>
        </FormGroup>
      </Card>

      <Card title="Transaction List">
        <Table
          columns={columns}
          data={filteredTransactions}
          actions={(transaction: Transaction) => (
            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
          )}
        />
      </Card>
    </div>
  );
}