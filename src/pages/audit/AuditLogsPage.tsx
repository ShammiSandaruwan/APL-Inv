// src/pages/audit/AuditLogsPage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast } from '../../utils/toast';
import { Table, Title, Loader, Center } from '@mantine/core';

// Define the type for an audit log object
export interface AuditLog {
  id: number;
  created_at: string;
  user_id: string;
  action: string;
  entity: string;
  entity_id: string;
  old_data: any;
  new_data: any;
}

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });

      if (error) {
        showErrorToast(error.message);
      } else {
        setLogs(data as AuditLog[]);
      }
      setIsLoading(false);
    };

    fetchLogs();
  }, []);

  const rows = logs.map((log) => (
    <tr key={log.id}>
      <td>{new Date(log.created_at).toLocaleString()}</td>
      <td>{log.action}</td>
      <td>{log.entity}</td>
      <td>{log.user_id}</td>
    </tr>
  ));

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <div>
      <Title order={2} mb="lg">Audit Logs</Title>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Action</th>
            <th>Entity</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

export default AuditLogsPage;
