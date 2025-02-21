import { useState, useEffect } from 'react';
import { dataStore, InventoryItem } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Form, FormGroup } from './ui/Form';
import { Modal } from './ui/Modal';
import { Table } from './ui/Table';

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'> & { total: number }>({ name: '', category: '', quantity: 0, unitPrice: 0, total: 0 });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<string[]>(['Category A', 'Category B', 'Category C']); // Default categories
  const [newCategory, setNewCategory] = useState<string>('');

  useEffect(() => {
    setInventory(dataStore.getInventory());
  }, []);

  const addItem = () => {
    if (newItem.name && newItem.category && newItem.quantity > 0 && newItem.unitPrice > 0) {
      const updatedInventory = [...inventory, { ...newItem, id: Date.now() }];
      setInventory(updatedInventory);
      dataStore.setInventory(updatedInventory);
      setNewItem({ name: '', category: '', quantity: 0, unitPrice: 0, total: 0 });
    }
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

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Quantity', accessor: 'quantity' },
    { header: 'Unit Price', accessor: 'unitPrice' },
    { header: 'Total', accessor: 'total' },
  ];

  return (
    <div style={{margin: '40px auto', maxWidth: '1200px'}}>
      <h2 className="text-center mb-4">Inventory Management</h2>
      <div className="row">
        <div className="col-md-6">
          <Card title="Add New Item">
            <Form onSubmit={addItem}>
              <div className="row g-3">
                <div className="col-md-6">
                  <FormGroup label="Item Name" htmlFor="name">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Category" htmlFor="category">
                    <select
                      className="form-select"
                      id="category"
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Quantity" htmlFor="quantity">
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0, total: newItem.unitPrice * (parseInt(e.target.value) || 0) })}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup label="Unit Price" htmlFor="unitPrice">
                    <input
                      type="number"
                      className="form-control"
                      id="unitPrice"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0, total: newItem.quantity * (parseFloat(e.target.value) || 0) })}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-12">
                  <label className="form-label">&nbsp;</label>
                  <button type="submit" className="btn btn-primary w-100">Add Item</button>
                </div>
              </div>
            </Form>
          </Card>
        </div>
        <div className="col-md-6">
          <Card title="Create New Category">
            <Form onSubmit={(e) => { e.preventDefault(); addCategory(); }}>
              <div className="row g-3">
                <div className="col-md-6">
                  <FormGroup label="New Category" htmlFor="new-category">
                    <input
                      type="text"
                      className="form-control"
                      id="new-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <label className="form-label">&nbsp;</label>
                  <button type="submit" className="btn btn-success w-100">Add Category</button>
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      <Card title="Inventory List" className="mt-4">
        <Table
          columns={columns}
          data={inventory}
          actions={(item: InventoryItem) => (
            <>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingItem(item)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item.id)}>Delete</button>
            </>
          )}
        />
      </Card>

      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Inventory Item"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={updateItem}>Save changes</button>
          </>
        }
      >
        {editingItem && (
          <Form onSubmit={updateItem}>
            <FormGroup label="Name" htmlFor="edit-name">
              <input
                type="text"
                className="form-control"
                id="edit-name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Category" htmlFor="edit-category">
              <select
                className="form-select"
                id="edit-category"
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </FormGroup>
            <FormGroup label="Quantity" htmlFor="edit-quantity">
              <input
                type="number"
                className="form-control"
                id="edit-quantity"
                value={editingItem.quantity}
                onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0, total: editingItem.unitPrice * (parseInt(e.target.value) || 0) })}
              />
            </FormGroup>
            <FormGroup label="Unit Price" htmlFor="edit-unitPrice">
              <input
                type="number"
                className="form-control"
                id="edit-unitPrice"
                value={editingItem.unitPrice}
                onChange={(e) => setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) || 0, total: editingItem.quantity * (parseFloat(e.target.value) || 0) })}
              />
            </FormGroup>
          </Form>
        )}
      </Modal>
    </div>
  );
}



