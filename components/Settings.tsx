import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore, Settings as SettingsType } from '../utils/dataStore';

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="confirm-deletions"
              checked={settings.confirmDeletions}
              onCheckedChange={(checked) => setSettings({ ...settings, confirmDeletions: checked })}
            />
            <Label htmlFor="confirm-deletions">Confirm before deletions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="low-stock-threshold">Low stock threshold:</Label>
            <Input
              id="low-stock-threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 0 })}
              className="w-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="company-name">Company Name:</Label>
            <Input
              id="company-name"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-64"
            />
          </div>
          <Button onClick={saveSettings}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}

