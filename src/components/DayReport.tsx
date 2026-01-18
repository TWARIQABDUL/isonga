import { ProTable } from '@ant-design/pro-components';
import { Card, Typography, Divider } from 'antd';
import { useState } from 'react';
import axios from 'axios';


interface SavingsReportItem {
  savings_id: string;
  full_name: string;
  id_number: string;
  total_amount: string | number;
  total_ingoboka: string | number;
  date_received: string;
}

const columns = [
  { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
  { title: 'ID Number', dataIndex: 'id_number', key: 'id_number' },
  { title: 'Total Amount', dataIndex: 'total_amount', key: 'total_amount', valueType: 'money' },
  { title: 'Total Ingoboka', dataIndex: 'total_ingoboka', key: 'total_ingoboka', valueType: 'money' },
  { title: 'Date Received', dataIndex: 'date_received', key: 'date_received', valueType: 'date', sorter: (a: any, b: any) => new Date(a.date_received).getTime() - new Date(b.date_received).getTime() },
];

const DayReport = () => {
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIngoboka, setTotalIngoboka] = useState(0);
  
  return (
    <Card
      title="Daily Savings Report"
      style={{ boxShadow: '0 2px 8px #f0f1f2' }}
      bodyStyle={{ padding: 24 }}
      bordered={false}
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
            const res = await axios.get<SavingsReportItem[]>(
              `${import.meta.env.VITE_API_URL_DEV}/savings/dayreport`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("fetch day report",res.data);
            
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
            const totalIng = filtered.reduce((sum, item) => sum + Number(item.total_ingoboka || 0), 0);
            setTotalAmount(total);
            setTotalIngoboka(totalIng);

            return {
              data: filtered,
              success: true,
              total: filtered.length,
            };
          } catch (err) {
            console.error('Failed to fetch report:', err);
            setTotalAmount(0);
            setTotalIngoboka(0);
            return { data: [], success: false, total: 0 };
          } finally {
            setLoading(false);
          }
        }}
      />
      <Divider />
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
      <Typography.Title level={4} style={{ marginBottom: 0 }}>
        Total Amount:&nbsp;
        <span style={{ color: '#1890ff' }}>{totalAmount.toLocaleString()}</span> RWF
      </Typography.Title>
      <Typography.Title level={4} style={{ marginBottom: 0 }}>
        Total Ingoboka:&nbsp;
        <span style={{ color: '#52c41a' }}>{totalIngoboka.toLocaleString()}</span> RWF
      </Typography.Title>
    </div>
    </Card>
  );
};

export default DayReport;
