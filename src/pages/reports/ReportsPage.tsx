// src/pages/reports/ReportsPage.tsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/Button';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState('full_inventory');
  const [estateId, setEstateId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [estates, setEstates] = useState([]);
  const [buildings, setBuildings] = useState([]);

  React.useEffect(() => {
    const fetchEstates = async () => {
      const { data, error } = await supabase.from('estates').select('*');
      if (error) {
        showErrorToast(error.message);
      } else {
        setEstates(data as any);
      }
    };
    fetchEstates();
  }, []);

  React.useEffect(() => {
    const fetchBuildings = async () => {
      if (estateId) {
        const { data, error } = await supabase.from('buildings').select('*').eq('estate_id', estateId);
        if (error) {
          showErrorToast(error.message);
        } else {
          setBuildings(data as any);
        }
      } else {
        setBuildings([]);
      }
    };
    fetchBuildings();
  }, [estateId]);

  const generateReport = async () => {
    setIsGenerating(true);
    let query = supabase.from('items').select('name, item_code, buildings(name, estates(name))');

    if (reportType === 'estate_specific' && estateId) {
      query = query.eq('estate_id', estateId);
    }

    if (reportType === 'building_specific' && buildingId) {
      query = query.eq('building_id', buildingId);
    }

    const { data, error } = await query;

    if (error) {
      showErrorToast(error.message);
    } else {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "Name,Item Code,Building,Estate\n"
        + data.map((item: any) => `${item.name},${item.item_code},${item.buildings.name},${item.buildings.estates.name}`).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportType}_report.csv`);
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
        <h2 className="text-xl font-semibold mb-4">Custom Report Builder</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-mine-shaft">
              Report Type
            </label>
            <select
              id="reportType"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm"
            >
              <option value="full_inventory">Full Inventory</option>
              <option value="estate_specific">Estate-Specific</option>
              <option value="building_specific">Building-Specific</option>
            </select>
          </div>
          {reportType === 'estate_specific' && (
            <div>
              <label htmlFor="estate" className="block text-sm font-medium text-mine-shaft">
                Estate
              </label>
              <select
                id="estate"
                name="estate"
                value={estateId}
                onChange={(e) => setEstateId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm"
              >
                <option value="">All Estates</option>
                {estates.map((estate: any) => (
                  <option key={estate.id} value={estate.id}>{estate.name}</option>
                ))}
              </select>
            </div>
          )}
          {reportType === 'building_specific' && (
            <>
              <div>
                <label htmlFor="estate" className="block text-sm font-medium text-mine-shaft">
                  Estate
                </label>
                <select
                  id="estate"
                  name="estate"
                  value={estateId}
                  onChange={(e) => setEstateId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm"
                >
                  <option value="">Select Estate</option>
                  {estates.map((estate: any) => (
                    <option key={estate.id} value={estate.id}>{estate.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="building" className="block text-sm font-medium text-mine-shaft">
                  Building
                </label>
                <select
                  id="building"
                  name="building"
                  value={buildingId}
                  onChange={(e) => setBuildingId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm"
                  disabled={!estateId}
                >
                  <option value="">All Buildings</option>
                  {buildings.map((building: any) => (
                    <option key={building.id} value={building.id}>{building.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <div className="mt-6">
          <Button onClick={generateReport} isLoading={isGenerating}>
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
