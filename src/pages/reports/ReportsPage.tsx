// src/pages/reports/ReportsPage.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/Button';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInventoryReport = async () => {
    setIsGenerating(true);
    const { data, error } = await supabase
      .from('items')
      .select('name, item_code, buildings(name, estates(name))');

    if (error) {
      showErrorToast(error.message);
    } else {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Name,Item Code,Building,Estate\n"
        + data.map((item: any) => `${item.name},${item.item_code},${item.buildings.name},${item.buildings.estates.name}`).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "inventory_report.csv");
      document.body.appendChild(link);
      link.click();
      showSuccessToast('Report generated successfully!');
    }
    setIsGenerating(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-mine-shaft mb-6">Reports</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Inventory Report</h2>
        <p className="text-scorpion mb-4">
          Generate a CSV file of all items in the system.
        </p>
        <Button onClick={generateInventoryReport} isLoading={isGenerating}>
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default ReportsPage;
