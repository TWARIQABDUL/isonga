import { ProTable } from '@ant-design/pro-components';
import { Card, Typography, Divider } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const columns = [
  { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
  { title: 'ID Number', dataIndex: 'id_number', key: 'id_number' },
  { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', valueType: 'money' },
  { title: 'Date Received', dataIndex: 'date_received', key: 'date_received', valueType: 'date', sorter: (a, b) => new Date(a.date_received).getTime() - new Date(b.date_received).getTime() },
];

const Testing = () => {
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  return (
    <Card
      title="Daily Savings Report"
      style={{ maxWidth: 900, margin: '32px auto', boxShadow: '0 2px 8px #f0f1f2' }}
      bodyStyle={{ padding: 24 }}
    >
      <ProTable
        columns={columns}
        rowKey="savings_id"
        options={{ search: true }}
        pagination={{ pageSize: 10 }}
        loading={loading}
        style={{ marginBottom: 24 }}
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          setLoading(true);
          try {
            const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
            const res = await axios.get(
              'http://localhost:8080/api/savings/dayreport',
              { headers: { Authorization: `Bearer ${token}` } }
            );
            let filtered = res.data;
            if (params.full_name) {
              filtered = filtered.filter(item =>
                item.full_name.toLowerCase().includes(params.full_name.toLowerCase())
              );
            }
            if (params.id_number) {
              filtered = filtered.filter(item =>
                item.id_number.includes(params.id_number)
              );
            }
            if (params.date_received) {
              const dateStr = params.date_received.format
                ? params.date_received.format('YYYY-MM-DD')
                : params.date_received;
              filtered = filtered.filter(item =>
                item.date_received === dateStr
              );
            }
            const total = filtered.reduce((sum, item) => sum + Number(item.total_amount), 0);
            setTotalAmount(total);

            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          } catch (err) {
            console.error('Failed to fetch report:', err);
            setTotalAmount(0);
            return { data: [], success: false, total: 0 };
          } finally {
            setLoading(false);
          }
        }}
      />
      <Divider />
      <Typography.Title level={4} style={{ textAlign: 'right', marginBottom: 0 }}>
        Total Amount:&nbsp;
        <span style={{ color: '#1890ff' }}>{totalAmount.toLocaleString()}</span> RWF
      </Typography.Title>
    </Card>
  );
};

export default Testing;