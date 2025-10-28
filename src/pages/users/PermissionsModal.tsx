// src/pages/users/PermissionsModal.tsx
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabaseClient';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import type { UserProfile } from './UserManagementPage';
import type { Estate } from '../../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ isOpen, onClose, user }) => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [selectedEstates, setSelectedEstates] = useState<string[]>([]);
  const [permissions, setPermissions] = useState({
    can_create_items: false,
    can_edit_items: false,
    can_delete_items: false,
    can_manage_estates: false,
    can_manage_buildings: false,
    can_manage_categories: false,
    can_generate_reports: false,
    can_view_audit_logs: false,
  });

  useEffect(() => {
    const fetchEstates = async () => {
      const { data, error } = await supabase.from('estates').select('*');
      if (error) {
        showErrorToast(error.message);
      } else {
        setEstates(data as Estate[]);
      }
    };

    const fetchPermissions = async () => {
      if (user) {
        const { data: accessData, error: accessError } = await supabase
          .from('user_estate_access')
          .select('estate_id')
          .eq('user_id', user.id);
        if (accessError) {
          showErrorToast(accessError.message);
        } else {
          setSelectedEstates(accessData.map((a: any) => a.estate_id));
        }

        const { data: permsData, error: permsError } = await supabase
          .from('co_admin_permissions')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (permsError) {
          showErrorToast(permsError.message);
        } else if (permsData) {
          setPermissions(permsData);
        }
      }
    };

    if (isOpen) {
      fetchEstates();
      fetchPermissions();
    }
  }, [isOpen, user]);

  const handleEstateToggle = (estateId: string) => {
    setSelectedEstates(prev =>
      prev.includes(estateId) ? prev.filter(id => id !== estateId) : [...prev, estateId]
    );
  };

  const handlePermissionToggle = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [permission]: !prev[permission] }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    const { error: accessError } = await supabase
      .from('user_estate_access')
      .delete()
      .eq('user_id', user.id);
    if (accessError) {
      showErrorToast(accessError.message);
      return;
    }

    const { error: insertAccessError } = await supabase
      .from('user_estate_access')
      .insert(selectedEstates.map(estate_id => ({ user_id: user.id, estate_id })));
    if (insertAccessError) {
      showErrorToast(insertAccessError.message);
      return;
    }

    const { error: permsError } = await supabase
      .from('co_admin_permissions')
      .upsert({ user_id: user.id, ...permissions });
    if (permsError) {
      showErrorToast(permsError.message);
      return;
    }

    showSuccessToast('Permissions updated successfully!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permissions for ${user?.full_name}`}>
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium">Estate Access</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {estates.map(estate => estate && (
              <div key={estate.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`estate-${estate.id}`}
                  checked={selectedEstates.includes(estate.id?.toString() || '')}
                  onChange={() => handleEstateToggle(estate.id?.toString() || '')}
                />
                <label htmlFor={`estate-${estate.id}`} className="ml-2">{estate.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium">Permissions</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.keys(permissions).map(key => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={permissions[key as keyof typeof permissions]}
                  onChange={() => handlePermissionToggle(key as keyof typeof permissions)}
                />
                <label htmlFor={key} className="ml-2">{key.replace(/_/g, ' ')}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Permissions
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionsModal;
