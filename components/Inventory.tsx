import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, InventoryItem } from '../utils/dataStore';

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', category: '', quantity: 0, unitPrice: 0 });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    setInventory(dataStore.getInventory());
  }, []);

  const addItem = () => {
    if (newItem.name && newItem.category && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const updatedInventory = [...inventory, { ...newItem, id: Date.now() }];
      setInventory(updatedInventory);
      dataStore.setInventory(updatedInventory);
      setNewItem({ name: '', category: '', quantity: 0, unitPrice: 0 });
    }
  };

  const editItem = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const updateItem = () => {
    if (editingItem) {
      const updatedInventory = inventory.map(item => item.id === editingItem.id ? editingItem : item);
      setInventory(updatedInventory);
      dataStore.setInventory(updatedInventory);
      setEditingItem(null);
    }
  };

  const deleteItem = (id: number) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    dataStore.setInventory(updatedInventory);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Item</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Category A">Category A</SelectItem>
                  <SelectItem value="Category B">Category B</SelectItem>
                  <SelectItem value="Category C">Category C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">Quantity</Label>
              <Input id="quantity" type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">Unit Price</Label>
              <Input id="unitPrice" type="number" value={newItem.unitPrice} onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })} className="col-span-3" />
            </div>
          </div>
          <Button onClick={addItem}>Add Item</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => editItem(item)}>Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Category A">Category A</SelectItem>
                    <SelectItem value="Category B">Category B</SelectItem>
                    <SelectItem value="Category C">Category C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">Quantity</Label>
                <Input id="edit-quantity" type="number" value={editingItem.quantity} onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-unitPrice" className="text-right">Unit Price</Label>
                <Input id="edit-unitPrice" type="number" value={editingItem.unitPrice} onChange={(e) => setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) || 0 })} className="col-span-3" />
              </div>
            </div>
            <Button onClick={updateItem}>Update Item</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

