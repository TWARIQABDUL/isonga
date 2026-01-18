import { useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Typography, message, Tag, Card, Statistic, Button, Modal, Form, InputNumber } from 'antd';
import { FileText, ArrowUpCircle, ArrowDownCircle, Wallet, Edit } from 'lucide-react';
import axios from 'axios';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SavingsTransaction {
  id: string; 
  user_id_number: string;
  full_name?: string;
  amount: number;
  type?: 'deposit' | 'withdrawal'; 
  created_at: string;
  date_received?: string;
  week_number?: number;

  year?: number;
  month?: number;
  target?: number;
  ingoboka?: number;
}

const SavingsReport = () => {
    const actionRef = useRef<ActionType>();
    const [totals, setTotals] = useState({
        deposits: 0,
        withdrawals: 0,
        net: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<SavingsTransaction | null>(null);
    const [form] = Form.useForm();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'ADMIN';

    const handleEdit = (record: SavingsTransaction) => {
        setEditingTransaction(record);
        form.setFieldsValue({
            amount: record.amount,
            target: record.target || 0 // Assuming target might be available or 0
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (!editingTransaction) return;

            await axios.put(
                `${import.meta.env.VITE_API_URL_DEV}/savings/${editingTransaction.id}`,
                 values,
                {
                    headers: { Authorization: `Bearer ${user?.token}` }
                }
            );

            message.success('Savings updated successfully');
            setIsModalOpen(false);
            setEditingTransaction(null);
            actionRef.current?.reload();
        } catch (error) {
            console.error('Failed to update savings:', error);
            message.error('Failed to update savings');
        }
    };


    const columns: ProColumns<SavingsTransaction>[] = [
        {
            title: 'Validation ID',
            dataIndex: 'id',
            search: false,
            copyable: true,
            ellipsis: true,
            width: 150,
        },
        {
            title: 'User ID',
            dataIndex: 'user_id_number',
            fieldProps: {
                placeholder: 'Filter by ID Number',
            },
            copyable: true,
        },
        {
            title: 'Full Name',
            dataIndex: 'full_name',
            search: false,
            ellipsis: true,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            search: false,
            sorter: (a, b) => a.amount - b.amount,
            align: 'right',
            render: (_, record) => (
                <span className={`font-semibold ${record.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                    {record.type === 'withdrawal' ? '-' : '+'}{formatCurrency(record.amount)}
                </span>
            ),
        },
        {
            title: 'Ingoboka',
            dataIndex: 'ingoboka',
            search: false,
            align: 'right',
            render: (_, record) => (
                <span className="font-semibold text-blue-600">
                    {formatCurrency(record.ingoboka || 0)}
                </span>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            search: false,
            filters: [
                { text: 'Deposit', value: 'deposit' },
                { text: 'Withdrawal', value: 'withdrawal' },
            ],
            onFilter: (value, record) => record.type === value,
            render: (_, record) => {
                 const type = record.type || 'deposit';
                 const isDeposit = type === 'deposit';
                 return (
                    <Tag 
                        icon={isDeposit ? <ArrowUpCircle size={14} className="mr-1 inline" /> : <ArrowDownCircle size={14} className="mr-1 inline" />} 
                        color={isDeposit ? 'success' : 'error'}
                        className="flex items-center w-fit px-2 py-1"
                    >
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
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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

        {
            title: 'Actions',
            valueType: 'option',
            width: 100,
            render: (_, record) => {
                if (!isAdmin) return null;

                const createdAt = new Date(record.created_at);
                const now = new Date();
                const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

                if (diffInMinutes > 60) return null;

                return (
                    <Button 
                        type="text" 
                        icon={<Edit size={16} />} 
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Edit
                    </Button>
                );
            }
        },
    ];

    return (
         <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                     <Statistic
                         title={<span className="text-gray-500 font-medium flex items-center gap-2"><ArrowUpCircle size={16} className="text-green-500" /> Total Collected</span>}
                         value={totals.deposits}
                         precision={0}
                         valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                         prefix="RWF "
                     />
                 </Card>
                 <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                     <Statistic
                         title={<span className="text-gray-500 font-medium flex items-center gap-2"><ArrowDownCircle size={16} className="text-red-500" /> Total Withdrawn</span>}
                         value={totals.withdrawals}
                         precision={0}
                         valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                         prefix="RWF "
                     />
                 </Card>
                 <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                     <Statistic
                         title={<span className="text-gray-500 font-medium flex items-center gap-2"><Wallet size={16} className="text-blue-500" /> Net Balance</span>}
                         value={totals.net}
                         precision={0}
                         valueStyle={{ color: totals.net >= 0 ? '#1890ff' : '#cf1322', fontWeight: 'bold' }}
                         prefix="RWF "
                     />
                 </Card>
             </div>

            <ProTable<SavingsTransaction>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                rowKey="id"
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
                        
                        let data: SavingsTransaction[] = [];
                        if (Array.isArray(response.data)) {
                             data = response.data;
                        } else if (Array.isArray(response.data?.data)) {
                             data = response.data.data;
                        } else if (Array.isArray(response.data?.list)) {
                            data = response.data.list;
                        }

                        // Calculate totals from the fetched data
                        const newTotals = data.reduce((acc, curr) => {
                            const amount = Number(curr.amount);
                            const type = curr.type || 'deposit';
                            
                            if (type === 'deposit') {
                                acc.deposits += amount;
                                acc.net += amount;
                            } else {
                                acc.withdrawals += amount;
                                acc.net -= amount;
                            }
                            return acc;
                        }, { deposits: 0, withdrawals: 0, net: 0 });
                        
                        setTotals(newTotals);

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
                search={{
                    labelWidth: 'auto',
                    collapsed: false,
                    className: 'bg-white p-4 rounded-lg shadow-sm mb-6',
                }}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                }}
                dateFormatter="string"
                headerTitle={
                    <Typography.Title level={4} className="!m-0 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Savings Transactions
                    </Typography.Title>
                }
                options={{
                    density: true,
                    fullScreen: true,
                    refresh: true,
                    setting: true,
                }}
                toolbar={{
                    settings: [{ icon: 'setting', tooltip: 'Settings' }],
                }}
            />

             <Modal
                title="Edit Savings Transaction"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter the amount' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `RWF ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/RWF\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="target"
                        label="Target"
                        rules={[{ required: true, message: 'Please enter the target' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `RWF ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/RWF\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Form>
            </Modal>
         </div>
    );
};

export default SavingsReport;
