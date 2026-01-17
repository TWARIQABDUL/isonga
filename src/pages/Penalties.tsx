import React, { useEffect, useState } from 'react';
import { PenaltyService } from '../services/PenaltyService';
import { Penalty } from '../data';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import CreatePenaltyModal from '../components/forms/CreatePenaltyModal';

const Penalties = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPenalties = async () => {
    try {
      setLoading(true);
      const data = await PenaltyService.getAllPenalties();
      // Assuming API returns { data: Penalty[] } or just Penalty[]
      const penaltyList = Array.isArray(data) ? data : data.data || [];
      setPenalties(penaltyList);
    } catch (error) {
      console.error('Failed to fetch penalties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenalties();
  }, []);

  const handlePay = async (id: string) => {
    if (confirm('Are you sure you want to mark this penalty as paid?')) {
      try {
        await PenaltyService.markPenaltyPaid(id);
        fetchPenalties();
      } catch (error) {
        console.error('Failed to mark as paid:', error);
        alert('Failed to mark as paid');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this penalty?')) {
      try {
        await PenaltyService.deletePenalty(id);
        fetchPenalties();
      } catch (error) {
        console.error('Failed to delete penalty:', error);
        alert('Failed to delete penalty');
      }
    }
  };

  const columns = [
    { label: 'User ID', key: 'userIdNumber' },
    { label: 'Amount', key: 'amount', render: (value: number) => `${value.toLocaleString()} RWF` },
    { label: 'Reason', key: 'reason' },
    { label: 'Status', key: 'status', render: (status: string) => (
      <Badge variant={status === 'PAID' ? 'success' : 'warning'}>{status}</Badge>
    )},
    { label: 'Created At', key: 'createdAt', render: (date: string) => new Date(date).toLocaleDateString() },
    {
      label: 'Actions',
      key: 'id',
      render: (id: string, penalty: Penalty) => (
        <div className="flex gap-2">
          {penalty.status !== 'PAID' && (
            <button 
              onClick={() => handlePay(id)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Mark as Paid"
            >
              <CheckCircle size={18} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Penalties Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Issue Penalty
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading penalties...</div>
        ) : (
          <Table 
            data={penalties}
            columns={columns}
          />
        )}
      </div>
      
      {isModalOpen && (
        <CreatePenaltyModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchPenalties();
          }}
        />
      )}
    </>
  );
};

export default Penalties;
