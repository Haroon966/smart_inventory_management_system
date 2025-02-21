import { useState, useEffect } from 'react';
import { dataStore, InventoryItem, Transaction } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Form, FormGroup } from './ui/Form';

interface SalesReport {
  totalSales: number;
  itemsSold: number;
  averageOrderValue: number;
}

interface InventoryReport {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  averageItemValue: number;
}

interface ProfitReport {
  totalSales: number;
  totalPurchases: number;
  profit: number;
  profitMargin: number;
}

type ReportData = SalesReport | InventoryReport | ProfitReport;

export function Reports() {
  const [reportType, setReportType] = useState<string>('sales');
  const [reportData, setReportData] = useState<ReportData | null>(null);
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
    <div style={{marginTop: '40px'}}>
      <h2 className="mb-4">Reports</h2>
      <Card title="Generate Report">
        <Form onSubmit={(e) => {
          e.preventDefault();
          generateReport();
        }}>
          <div className="row g-3">
            <div className="col-md-6">
              <FormGroup label="Report Type" htmlFor="reportType">
                <select
                  className="form-select shadow-sm"
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="sales">📊 Sales Report</option>
                  <option value="inventory">📦 Inventory Report</option>
                  <option value="profit">💰 Profit Report</option>
                </select>
              </FormGroup>
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <button 
                type="submit" 
                className="btn btn-primary w-100 shadow-sm hover-lift"
                style={{ transition: 'all 0.2s ease' }}
              >
                <i className="bi bi-graph-up me-2"></i>
                Generate Report
              </button>
            </div>
          </div>
        </Form>
        {reportData && (
          <div className="mt-4 animate-fade-in">
            <h5 className="text-primary mb-3">
              {reportType === 'sales' && '📊 '}
              {reportType === 'inventory' && '📦 '}
              {reportType === 'profit' && '💰 '}
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </h5>
            <div className="card shadow-sm">
              <ul className="list-group list-group-flush">
                {Object.entries(reportData).map(([key, value]) => (
                  <li key={key} 
                      className="list-group-item d-flex justify-content-between align-items-center py-3 hover-bg-light"
                      style={{ transition: 'background-color 0.2s ease' }}
                  >
                    <span className="text-muted">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      {typeof value === 'number' ? 
                        key.toLowerCase().includes('price') || 
                        key.toLowerCase().includes('value') || 
                        key.toLowerCase().includes('sales') || 
                        key.toLowerCase().includes('profit') ? 
                          `Rs. ${(value as number).toFixed(2)}` : 
                          key.toLowerCase().includes('margin') ?
                            `${(value as number).toFixed(2)}%` :
                            (value as number).toFixed(2)
                        : value?.toString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

