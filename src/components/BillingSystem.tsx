import { useState, ChangeEvent } from 'react';
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/Table"

interface BillItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export function BillingSystem() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 });

  const addItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      setBillItems([...billItems, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', quantity: 1, price: 0 });
    }
  };

  const removeItem = (id: number) => {
    setBillItems(billItems.filter(item => item.id !== id));
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const printBill = () => {
    const printContent = `
      <h2>Invoice</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${billItems.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>Rs. ${item.price.toFixed(2)}</td>
              <td>Rs. ${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p>Total Amount: Rs. ${totalAmount.toFixed(2)}</p>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, name: e.target.value });
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 });
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gradient">Billing System</h2>
          <Button 
            variant="success" 
            onClick={printBill}
            className="hover-lift"
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-print" />
              Print Invoice
            </span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            label="Item Name"
            type="text"
            placeholder="Enter item name"
            value={newItem.name}
            onChange={handleNameChange}
            className="glass-effect"
          />
          <Input
            label="Quantity"
            type="number"
            placeholder="Enter quantity"
            value={newItem.quantity}
            onChange={handleQuantityChange}
            className="glass-effect"
          />
          <Input
            label="Price"
            type="number"
            placeholder="Enter price"
            value={newItem.price}
            onChange={handlePriceChange}
            className="glass-effect"
          />
          <div className="flex items-end">
            <Button 
              variant="default" 
              onClick={addItem}
              className="w-full hover-lift"
            >
              <i className="fas fa-plus mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="card bg-gray-50 p-4 mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <div className="card p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90">Total Amount</p>
            <p className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

