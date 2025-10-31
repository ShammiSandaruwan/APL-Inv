// src/pages/users/AssignEstateModal.tsx
import { Button, Modal, Select, Stack, Text } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Estate, UserProfile } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

interface AssignEstateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

const AssignEstateModal: React.FC<AssignEstateModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [selectedEstate, setSelectedEstate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchEstates = async () => {
        try {
          const { data, error } = await supabase.from('estates').select('id, name');
          if (error) throw error;
          setEstates(data as Estate[]);
        } catch (error: any) {
          showErrorToast(error.message || 'Failed to fetch estates.');
        }
      };
      fetchEstates();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!user || !selectedEstate) return;

    setIsLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      if (!accessToken) {
        throw new Error("You must be logged in to perform this action.");
      }

      const response = await fetch('/api/assign-estate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          target_user_id: user.id,
          estate_id: selectedEstate,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      showSuccessToast('Estate assigned successfully!');
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to assign estate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Assign Estate">
      <Stack>
        <Text>
          Assign an estate to <strong>{user?.full_name}</strong>.
        </Text>
        <Select
          label="Estate"
          placeholder="Select an estate"
          data={estates.map((e) => ({ value: e.id, label: e.name }))}
          value={selectedEstate}
          onChange={setSelectedEstate}
          searchable
          required
        />
        <Button onClick={handleSubmit} loading={isLoading} fullWidth mt="md">
          Assign Estate
        </Button>
      </Stack>
    </Modal>
  );
};

export default AssignEstateModal;
