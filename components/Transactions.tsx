import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, Transaction } from '../utils/dataStore';

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'date'>>({ type: 'sale', itemName: '', quantity: 0, total: 0 });

  useEffect(() => {
    setTransactions(dataStore.getTransactions());
  }, []);

  const addTransaction = () => {
    if (newTransaction.itemName && newTransaction.quantity > 0 && newTransaction.total > 0) {
      const updatedTransactions = [...transactions, { ...newTransaction, id: Date.now(), date: new Date().toISOString().split('T')[0] }];
      setTransactions(updatedTransactions);
      dataStore.setTransactions(updatedTransactions);
      setNewTransaction({ type: 'sale', itemName: '', quantity: 0, total: 0 });
    }
  };

  const deleteTransaction = (id: number) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    dataStore.setTransactions(updatedTransactions);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transactions</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Transaction</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={newTransaction.type} onValueChange={(value: 'sale' | 'purchase' | 'return') => setNewTransaction({ ...newTransaction, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">Item Name</Label>
              <Input id="itemName" value={newTransaction.itemName} onChange={(e) => setNewTransaction({ ...newTransaction, itemName: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" value={newTransaction.quantity} onChange={(e) => setNewTransaction({ ...newTransaction, quantity: parseInt(e.target.value) || 0 })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right">Total</Label>
              <Input id="total" type="number" value={newTransaction.total} onChange={(e) => setNewTransaction({ ...newTransaction, total: parseFloat(e.target.value) || 0 })} className="col-span-3" />
            </div>
          </div>
          <Button onClick={addTransaction}>Add Transaction</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>{transaction.itemName}</TableCell>
              <Table
Cell>{transaction.quantity}</TableCell>
              <TableCell>${transaction.total.toFixed(2)}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteTransaction(transaction.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

