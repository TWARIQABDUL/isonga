import { useState } from 'react';
import { Form, Input, Button, Card, Select, message } from 'antd'; // Using Ant Design components as seen in other files
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const { Option } = Select;

const CreateUser = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
            await axios.post(
                `${import.meta.env.VITE_API_URL_DEV}/auth/register`,
                values,
                {
                    headers: {
                       'Content-Type': 'application/json',
                       Authorization: `Bearer ${token}` 
                    }
                }
            );
            message.success('User created successfully');
            form.resetFields();
        } catch (error: any) {
            console.error('Registration failed:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create user. Please try again.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card 
                title={
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        <span>Create New User</span>
                    </div>
                }
                className="shadow-md"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ role: 'USER' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[{ required: true, message: 'Please enter full name' }]}
                        >
                            <Input placeholder="John Doe" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input placeholder="john@example.com" />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={[{ required: true, message: 'Please enter phone number' }]}
                        >
                            <Input placeholder="078xxxxxxx" />
                        </Form.Item>

                        <Form.Item
                            name="idNumber"
                            label="National ID"
                            rules={[{ required: true, message: 'Please enter National ID' }]}
                        >
                            <Input placeholder="1199..." />
                        </Form.Item>

                        <Form.Item
                            name="cell"
                            label="Cell/Location"
                            rules={[{ required: true, message: 'Please enter location' }]}
                        >
                            <Input placeholder="Kigali" />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select a role' }]}
                        >
                            <Select>
                                <Option value="USER">User</Option>
                                <Option value="ADMIN">Admin</Option>
                                <Option value="AGENT">Agent</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please enter password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password placeholder="StrongPassword123" />
                    </Form.Item>

                    <Form.Item className="mb-0 flex justify-end">
                        <Button type="primary" htmlType="submit" loading={loading} className="bg-blue-600">
                            Create User
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateUser;
