// src/pages/users/PermissionsModal.tsx
import {
  Button,
  Checkbox,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { Estate, UserProfile } from '../../types';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

// Define the shape of the permissions object
interface CoAdminPermissions {
  can_create_items: boolean;
  can_edit_items: boolean;
  can_delete_items: boolean;
  can_manage_estates: boolean;
  can_manage_buildings: boolean;
  can_manage_categories: boolean;
  can_generate_reports: boolean;
  can_view_audit_logs: boolean;
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [selectedEstates, setSelectedEstates] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<CoAdminPermissions>({
    can_create_items: false,
    can_edit_items: false,
    can_delete_items: false,
    can_manage_estates: false,
    can_manage_buildings: false,
    can_manage_categories: false,
    can_generate_reports: false,
    can_view_audit_logs: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data when the modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // Fetch all estates
        const { data: estatesData, error: estatesError } = await supabase
          .from('estates')
          .select('*');
        if (estatesError) throw estatesError;
        setEstates(estatesData as Estate[]);

        // Fetch user's current estate access
        const { data: accessData, error: accessError } = await supabase
          .from('user_estate_access')
          .select('estate_id')
          .eq('user_id', user.id);
        if (accessError) throw accessError;
        setSelectedEstates(accessData.map((a) => a.estate_id));

        // Fetch user's co-admin permissions
        const { data: permsData, error: permsError } = await supabase
          .from('co_admin_permissions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (permsData) {
          const { user_id, ...rest } = permsData;
          setPermissions(rest);
        } else if (permsError && permsError.code !== 'PGRST116') {
          // Ignore 'no rows found' error, but throw others
          throw permsError;
        }
      } catch (error: any) {
        showErrorToast(error.message || 'Failed to fetch permissions data.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, user]);

  const handlePermissionToggle = (permission: keyof CoAdminPermissions) => {
    setPermissions((prev) => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Delete existing estate access entries
      const { error: deleteError } = await supabase
        .from('user_estate_access')
        .delete()
        .eq('user_id', user.id);
      if (deleteError) throw deleteError;

      // Insert the new set of estate access permissions
      if (selectedEstates.length > 0) {
        const { error: insertError } = await supabase
          .from('user_estate_access')
          .insert(selectedEstates.map((estate_id) => ({ user_id: user.id, estate_id })));
        if (insertError) throw insertError;
      }

      // Upsert co-admin permissions
      const { error: permsError } = await supabase
        .from('co_admin_permissions')
        .upsert({ user_id: user.id, ...permissions });
      if (permsError) throw permsError;

      showSuccessToast('Permissions updated successfully!');
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to update permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`Permissions for ${user?.full_name}`}
      size="lg"
      centered
    >
      <Stack gap="lg">
        <div>
          <Title order={4}>Estate Access</Title>
          <Text size="sm" c="dimmed">
            Grant access to specific estates.
          </Text>
          <Checkbox.Group
            value={selectedEstates}
            onChange={setSelectedEstates}
          >
            <SimpleGrid cols={2} mt="sm">
              {estates.map((estate) => (
                <Checkbox
                  key={estate.id}
                  value={estate.id.toString()}
                  label={estate.name}
                />
              ))}
            </SimpleGrid>
          </Checkbox.Group>
        </div>

        <div>
          <Title order={4}>Co-Admin Permissions</Title>
          <Text size="sm" c="dimmed">
            Assign specific management capabilities.
          </Text>
          <SimpleGrid cols={2} mt="sm">
            {Object.keys(permissions).map((key) => (
              <Checkbox
                key={key}
                label={key.replace(/_/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase())}
                checked={permissions[key as keyof CoAdminPermissions]}
                onChange={() => handlePermissionToggle(key as keyof CoAdminPermissions)}
              />
            ))}
          </SimpleGrid>
        </div>

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isLoading}>
            Save Permissions
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PermissionsModal;
