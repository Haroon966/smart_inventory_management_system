import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';

export function Reports() {
  const [reportType, setReportType] = useState<string>('sales');
  const [reportData, setReportData] = useState<any>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setInventory(dataStore.getInventory());
    setTransactions(dataStore.getTransactions());
  }, []);

  const generateReport = () => {
    switch (reportType) {
      case 'sales':
        generateSalesReport();
        break;
      case 'inventory':
        generateInventoryReport();
        break;
      case 'profit':
        generateProfitReport();
        break;
      default:
        setReportData(null);
    }
  };

  const generateSalesReport = () => {
    const salesTransactions = transactions.filter(t => t.type === 'sale');
    const totalSales = salesTransactions.reduce((sum, t) => sum + t.total, 0);
    const itemsSold = salesTransactions.reduce((sum, t) => sum + t.quantity, 0);
    
    setReportData({
      totalSales,
      itemsSold,
      averageOrderValue: totalSales / salesTransactions.length || 0,
    });
  };

  const generateInventoryReport = () => {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const lowStockItems = inventory.filter(item => item.quantity < 5).length;

    setReportData({
      totalItems,
      totalValue,
      lowStockItems,
      averageItemValue: totalValue / totalItems || 0,
    });
  };

  const generateProfitReport = () => {
    const sales = transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.total, 0);
    const purchases = transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.total, 0);
    const profit = sales - purchases;

    setReportData({
      totalSales: sales,
      totalPurchases: purchases,
      profit,
      profitMargin: (profit / sales) * 100 || 0,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reports</h2>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
                <SelectItem value="profit">Profit Report</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport}>Generate Report</Button>
          </div>
          {reportData && (
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h3>
              {Object.entries(reportData).map(([key, value]) => (
                <p key={key} className="mb-1">
                  <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </span>
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

