// src/pages/estates/EstatesPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import Spinner from '../../components/Spinner';
import Button from '../../components/Button';
import AddEstateModal from './AddEstateModal';
import EditEstateModal from './EditEstateModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import EmptyState from '../../components/EmptyState';
import Table from '../../components/Table';
import Input from '../../components/Input';
import { showErrorToast, showSuccessToast } from '../../utils/toast';
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from 'react-icons/fa';

// Define the type for an estate object
export type Estate = {
  id: string;
  name: string;
  code: string;
  location: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

const EstatesPage: React.FC = () => {
  const [estates, setEstates] = useState<Estate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

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

  const handleAddEstate = async (estate: { name: string; code: string; location: string; description?: string }) => {
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

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Code', accessor: 'code' },
    { header: 'Location', accessor: 'location' },
  ];

  const filteredAndSortedEstates = useMemo(() => {
    return estates
      .filter(estate =>
        estate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (locationFilter === '' || estate.location === locationFilter)
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
  }, [estates, searchTerm, locationFilter, sortBy]);

  const uniqueLocations = [...new Set(estates.map(e => e.location))];

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

      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-silver-chalice rounded-md text-sm shadow-sm placeholder-scorpion focus:outline-none focus:ring-bay-leaf focus:border-bay-leaf"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {filteredAndSortedEstates.length === 0 ? (
        <EmptyState
          title="No Estates Found"
          message="Get started by adding your first estate to the system."
          actionText="Add Your First Estate"
          onActionClick={() => setIsAddModalOpen(true)}
        />
      ) : (
        <Table
          columns={columns}
          data={filteredAndSortedEstates}
          renderActions={(estate) => (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/estates/${estate.id}`)}
                className="flex items-center"
              >
                <FaEye />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedEstate(estate);
                  setIsEditModalOpen(true);
                }}
                className="flex items-center"
              >
                <FaPencilAlt />
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
                <FaTrash />
              </Button>
            </div>
          )}
        />
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
