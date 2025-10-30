// src/pages/reports/ReportsPage.tsx
import {
  Button,
  Container,
  Paper,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Building, Estate } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<string | null>('full_inventory');
  const [estateId, setEstateId] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchEstates = async () => {
      const { data, error } = await supabase.from('estates').select('*');
      if (error) showErrorToast(error.message);
      else if (isMounted) setEstates(data as Estate[]);
    };
    fetchEstates();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchBuildings = async () => {
      if (estateId) {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .eq('estate_id', estateId);
        if (error) showErrorToast(error.message);
        else if (isMounted) setBuildings(data as Building[]);
      } else {
        if (isMounted) setBuildings([]);
      }
    };
    fetchBuildings();
    return () => {
      isMounted = false;
    };
  }, [estateId]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      let query = supabase
        .from('items')
        .select('name, item_code, buildings(name, estates(name))');

      if (reportType === 'estate_specific' && estateId) {
        query = query.eq('estate_id', estateId);
      }

      if (reportType === 'building_specific' && buildingId) {
        query = query.eq('building_id', buildingId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Name,Item Code,Building,Estate\n' +
        data
          .map(
            (item: any) =>
              `${item.name},${item.item_code},${item.buildings.name},${item.buildings.estates.name}`
          )
          .join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessToast('Report generated successfully!');
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container>
      <Stack gap="lg">
        <Title order={2}>Reports</Title>
        <Paper withBorder p="md" radius="md">
          <Title order={4} mb="md">
            Custom Report Builder
          </Title>
          <Stack>
            <Select
              label="Report Type"
              value={reportType}
              onChange={setReportType}
              data={[
                { value: 'full_inventory', label: 'Full Inventory' },
                { value: 'estate_specific', label: 'Estate-Specific' },
                { value: 'building_specific', label: 'Building-Specific' },
              ]}
            />
            {(reportType === 'estate_specific' ||
              reportType === 'building_specific') && (
              <Select
                label="Estate"
                placeholder="Select an estate"
                value={estateId}
                onChange={setEstateId}
                data={estates.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
                clearable
              />
            )}
            {reportType === 'building_specific' && (
              <Select
                label="Building"
                placeholder="Select a building"
                value={buildingId}
                onChange={setBuildingId}
                data={buildings.map((b) => ({
                  value: b.id,
                  label: b.name,
                }))}
                disabled={!estateId}
                clearable
              />
            )}
          </Stack>
          <Button onClick={generateReport} loading={isGenerating} mt="lg">
            Generate Report
          </Button>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ReportsPage;
