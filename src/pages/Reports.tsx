import { useState } from 'react';
import { Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import DayReport from '../components/DayReport';
import SavingsReport from '../components/SavingsReport';

const Reports = () => {
    const [reportType, setReportType] = useState<string>('Day Report');

    return (
        <div className="p-6">
            <div className="flex justify-center mb-6">
                 <Segmented
                    options={[
                        { label: 'Day Report', value: 'Day Report', icon: <AppstoreOutlined /> },
                        { label: 'Savings Report', value: 'Savings Report', icon: <BarsOutlined /> },
                    ]}
                    value={reportType}
                    onChange={setReportType}
                    size="large"
                />
            </div>
            
            {reportType === 'Day Report' ? <DayReport /> : <SavingsReport />}
        </div>
    );
};

export default Reports;
