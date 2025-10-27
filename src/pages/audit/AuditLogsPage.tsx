// src/pages/audit/AuditLogsPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Table from '../../components/Table';
import { showErrorToast } from '../../utils/toast';

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

  const columns = [
    { header: 'Timestamp', accessor: 'created_at' },
    { header: 'Action', accessor: 'action' },
    { header: 'Entity', accessor: 'entity' },
    { header: 'User ID', accessor: 'user_id' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-mine-shaft mb-6">Audit Logs</h1>
      <Table columns={columns} data={logs} />
    </div>
  );
};

export default AuditLogsPage;
