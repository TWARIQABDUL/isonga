import { useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Typography, message, Tag } from 'antd';
import { FileText } from 'lucide-react';
import axios from 'axios';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SavingsTransaction {
  id: string; 
  user_id_number: string;
  full_name?: string;
  amount: number;
  // type might be optional or inferred if not present in API provided by user, 
  // but let's keep it and handle partial data gracefully
  type?: 'deposit' | 'withdrawal'; 
  created_at: string;
  date_received?: string;
  week_number?: number;
  year?: number;
  month?: number;
}

const AdminSavingsReport = () => {
    const actionRef = useRef<ActionType>();

    const columns: ProColumns<SavingsTransaction>[] = [
        {
            title: 'Validation ID',
            dataIndex: 'id',
            search: false,
        },
        {
            title: 'User ID Number',
            dataIndex: 'user_id_number',
            fieldProps: {
                placeholder: 'Filter by ID Number',
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            search: false,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            search: false,
            render: (_, record) => (
                <span className={record.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}>
                    {formatCurrency(record.amount)}
                </span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            search: false,
             render: (_, record) => {
                 const type = record.type || 'deposit'; // Default to deposit if missing
                 return (
                    <Tag color={type === 'deposit' ? 'green' : 'red'}>
                        {type.toUpperCase()}
                    </Tag>
                );
             },
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            valueType: 'dateTime',
            search: false,
            render: (_, record) => formatDate(record.created_at),
        },
        {
            title: 'Year',
            dataIndex: 'year',
            valueType: 'digit',
            hideInTable: true,
        },
        {
            title: 'Month',
            dataIndex: 'month',
            valueType: 'digit',
             hideInTable: true,
             fieldProps: {
                 min: 1,
                 max: 12,
                 placeholder: 'Month (1-12)'
             }
        },
        {
            title: 'Week',
            dataIndex: 'week_number',
            valueType: 'digit',
             hideInTable: true,
             fieldProps: {
                 min: 1,
                 max: 52,
                  placeholder: 'Week (1-52)'
             }
        },
    ];

    return (
         <div className="p-4">
             <Typography.Title level={3} className="flex items-center gap-2 !mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
                Admin Savings Report
            </Typography.Title>
            <ProTable<SavingsTransaction>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params) => {
                     try {
                        const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
                        const queryParams = {
                            userIdNumber: params.user_id_number,
                            year: params.year,
                            month: params.month,
                            week: params.week_number
                        };

                        const response = await axios.get(
                            `${import.meta.env.VITE_API_URL_DEV}/savings/report`,
                             {
                                params: queryParams,
                                headers: { Authorization: `Bearer ${token}` }
                            }
                        );
                        
                        let data = [];
                        if (Array.isArray(response.data)) {
                             data = response.data;
                        } else if (Array.isArray(response.data?.data)) {
                             data = response.data.data;
                        } else if (Array.isArray(response.data?.list)) {
                            data = response.data.list;
                        }

                        return {
                            data: data,
                            success: true,
                        };
                     } catch (error) {
                        console.error('Failed to fetch savings report:', error);
                        message.error('Failed to fetch report');
                        return { data: [], success: false };
                     }
                }}
                 rowKey="id"
                 search={{
                    labelWidth: 'auto',
                    collapsed: false,
                }}
                 pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                headerTitle="Savings Transactions"
            />
         </div>
    );
};

export default AdminSavingsReport;
