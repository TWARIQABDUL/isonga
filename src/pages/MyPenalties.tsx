import React, { useEffect, useState } from 'react';
import { PenaltyService } from '../services/PenaltyService';
import { Penalty } from '../data';
import Table from '../components/layout/Table';
import Badge from '../components/layout/Badge';

const MyPenalties = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        setLoading(true);
        const data = await PenaltyService.getMyPenalties();
        setPenalties(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Failed to fetch my penalties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, []);

  const columns = [
    { label: 'Amount', key: 'amount', render: (value: number) => `${value.toLocaleString()} RWF` },
    { label: 'Reason', key: 'reason' },
    { label: 'Status', key: 'status', render: (status: string) => (
      <Badge variant={status === 'PAID' ? 'success' : 'warning'}>{status}</Badge>
    )},
    { label: 'Date', key: 'dateIssued', render: (date: string) => new Date(date).toLocaleDateString() },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Penalties</h1>

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
    </>
  );
};

export default MyPenalties;
