// src/pages/estates/EstatesPage.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import Card from '../../components/Card';
import AddEstateModal from './AddEstateModal';
import EditEstateModal from './EditEstateModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';

// Define the type for an estate object
export type Estate = {
  id: string;
  name: string;
  code: string;
  location: string;
  description: string;
  is_active: boolean;
};

const EstatesPage: React.FC = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);

  useEffect(() => {
    const fetchEstates = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('estates').select('*');

      if (error) {
        showErrorToast(error.message);
      } else {
        setEstates(data as Estate[]);
      }
      setIsLoading(false);
    };

    fetchEstates();
  }, []);

  const handleAddEstate = async (estate: Omit<Estate, 'id' | 'is_active'>) => {
    const { data, error } = await supabase
      .from('estates')
      .insert([estate])
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setEstates([...estates, data[0]]);
      showSuccessToast('Estate added successfully!');
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteEstate = async () => {
    if (!selectedEstate) return;

    const { error } = await supabase
      .from('estates')
      .delete()
      .eq('id', selectedEstate.id);

    if (error) {
      showErrorToast(error.message);
    } else {
      setEstates(estates.filter((e) => e.id !== selectedEstate.id));
      showSuccessToast('Estate deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedEstate(null);
    }
  };

  const handleUpdateEstate = async (updatedEstate: Estate) => {
    const { data, error } = await supabase
      .from('estates')
      .update(updatedEstate)
      .eq('id', updatedEstate.id)
      .select();

    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      setEstates(estates.map((e) => (e.id === updatedEstate.id ? data[0] : e)));
      showSuccessToast('Estate updated successfully!');
      setIsEditModalOpen(false);
      setSelectedEstate(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mine-shaft">Estates Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <FaPlus className="mr-2" />
          Add Estate
        </Button>
      </div>

      {estates.length === 0 ? (
        <p>No estates found. Add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estates.map((estate) => (
            <Card key={estate.id}>
              <h2 className="text-xl font-semibold">{estate.name}</h2>
              <p className="text-scorpion">Code: {estate.code}</p>
              <p className="text-scorpion">Location: {estate.location}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedEstate(estate);
                    setIsEditModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaPencilAlt className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setSelectedEstate(estate);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddEstateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEstate={handleAddEstate}
      />

      <EditEstateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateEstate={handleUpdateEstate}
        estate={selectedEstate}
      />

      {selectedEstate && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteEstate}
          title="Delete Estate"
          message={`Are you sure you want to delete the estate "${selectedEstate.name}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default EstatesPage;
