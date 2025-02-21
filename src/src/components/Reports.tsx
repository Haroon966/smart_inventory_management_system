import React, { useState, useEffect } from 'react';
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Form, FormGroup } from './ui/Form';

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
    <div>
      <h2 className="mb-4">Reports</h2>
      <Card title="Generate Report">
        <Form onSubmit={generateReport}>
          <div className="row g-3">
            <div className="col-md-4">
              <FormGroup label="Report Type" htmlFor="reportType">
                <select
                  className="form-select"
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="sales">Sales Report</option>
                  <option value="inventory">Inventory Report</option>
                  <option value="profit">Profit Report</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</la="btn btn-primary w-100">Generate Report</button>
            </div>
          </div>
        </Form>
        {reportData && (
          <div className="mt-4">
            <h5>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h5>
            <ul className="list-group">
              {Object.entries(reportData).map(([key, value]) => (
                <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

