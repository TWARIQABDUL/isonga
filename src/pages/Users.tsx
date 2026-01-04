import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Tag, message, Typography } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
import { Users as UsersIcon } from 'lucide-react';

interface User {
  id: number;
  idNumber: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  cell: string;
  role: 'ADMIN' | 'USER' | 'AGENT';
  createdAt: string;
}

const Users = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<User>[] = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [{ required: true, message: 'This is required' }],
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      copyable: true,
    },
    {
      title: 'National ID',
      dataIndex: 'idNumber',
      copyable: true,
      search: false,
    },
    {
      title: 'Location (Cell)',
      dataIndex: 'cell',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      valueType: 'select',
      valueEnum: {
        ADMIN: { text: 'Admin', status: 'Error' },
        USER: { text: 'User', status: 'Processing' },
        AGENT: { text: 'Agent', status: 'Success' },
      },
      render: (_, record) => {
        let color = 'blue';
        if (record.role === 'ADMIN') color = 'red';
        if (record.role === 'AGENT') color = 'green';
        return <Tag color={color}>{record.role}</Tag>;
      },
    },
    {
      title: 'Joined At',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      search: false,
    },
  ];

  return (
    <div className="p-4">
        <Typography.Title level={3} className="flex items-center gap-2 !mb-6">
            <UsersIcon className="w-8 h-8 text-blue-600" />
            User Management
        </Typography.Title>
        
        <ProTable<User>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params) => {
                try {
                const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL_DEV}/users`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                let filteredData = response.data;

                // Client-side filtering
                if (params.fullName) {
                    filteredData = filteredData.filter((user: User) => 
                        user.fullName.toLowerCase().includes(params.fullName!.toLowerCase())
                    );
                }
                if (params.email) {
                    filteredData = filteredData.filter((user: User) => 
                        user.email.toLowerCase().includes(params.email!.toLowerCase())
                    );
                }
                if (params.role) {
                     filteredData = filteredData.filter((user: User) => 
                        user.role === params.role
                    );
                }
                if (params.cell) {
                    filteredData = filteredData.filter((user: User) => 
                        user.cell.toLowerCase().includes(params.cell!.toLowerCase())
                    );
                }
                if (params.phoneNumber) {
                    filteredData = filteredData.filter((user: User) => 
                        user.phoneNumber.includes(params.phoneNumber!)
                    );
                }

                return {
                    data: filteredData,
                    success: true,
                    total: filteredData.length,
                };
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                    message.error('Failed to fetch users list');
                    return {
                        data: [],
                        success: false,
                    };
                }
            }}
            editable={{
                type: 'multiple',
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
            }}
            pagination={{
                pageSize: 10,
                onChange: (page) => console.log(page),
            }}
            dateFormatter="string"
            headerTitle="All Users"
        />
    </div>
  );
};

export default Users;
