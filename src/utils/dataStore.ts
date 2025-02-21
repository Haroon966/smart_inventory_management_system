export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total?: number;
}

export interface Transaction {
  id: number;
  type: 'sale' | 'purchase' | 'return';
  itemName: string;
  quantity: number;
  total: number;
  date: string;
}

export interface Settings {
  confirmDeletions: boolean;
  lowStockThreshold: number;
  companyName: string;
}

const LOCAL_STORAGE_KEYS = {
  INVENTORY: 'inventory',
  TRANSACTIONS: 'transactions',
  SETTINGS: 'settings',
};

export const dataStore = {
  getInventory: (): InventoryItem[] => {
    const storedInventory = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
    return storedInventory ? JSON.parse(storedInventory) : [];
  },

  setInventory: (inventory: InventoryItem[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  },

  getTransactions: (): Transaction[] => {
    const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS);
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  },

  setTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getSettings: (): Settings => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return storedSettings
      ? JSON.parse(storedSettings)
      : { confirmDeletions: true, lowStockThreshold: 5, companyName: 'My Company' };
  },

  setSettings: (settings: Settings) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
};

