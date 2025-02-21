import React, { useState, useEffect } from 'react';
import { dataStore, Settings as SettingsType } from '../utils/dataStore';
import { Card } from './ui/Card';
import { Form, FormGroup } from './ui/Form';

export function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    confirmDeletions: true,
    lowStockThreshold: 5,
    companyName: 'My Company',
  });

  useEffect(() => {
    setSettings(dataStore.getSettings());
  }, []);

  const saveSettings = () => {
    dataStore.setSettings(settings);
    alert('Settings saved successfully!');
  };

  return (
    <div style={{marginTop: '40px'}}>
      <h2 className="mb-4">Settings</h2>
      <Card title="General Settings">
        <Form onSubmit={saveSettings}>
          <FormGroup label="Confirm before deletions" htmlFor="confirm-deletions">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="confirm-deletions"
                checked={settings.confirmDeletions}
                onChange={(e) => setSettings({ ...settings, confirmDeletions: e.target.checked })}
              />
            </div>
          </FormGroup>
          <FormGroup label="Low stock threshold" htmlFor="low-stock-threshold">
            <input
              type="number"
              className="form-control"
              id="low-stock-threshold"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
            />
          </FormGroup>
          <FormGroup label="Company Name" htmlFor="company-name">
            <input
              type="text"
              className="form-control"
              id="company-name"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </FormGroup>
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </Form>
      </Card>
    </div>
  );
}

