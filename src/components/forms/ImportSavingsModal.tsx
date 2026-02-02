import React, { useState } from 'react';
import { Modal, Upload, Button, message, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { SavingsService } from '../../services/SavingsService';

const { Dragger } = Upload;
const { Text } = Typography;

interface ImportSavingsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportSavingsModal: React.FC<ImportSavingsModalProps> = ({ open, onClose, onSuccess }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const file = fileList[0];
    if (!file) {
      message.error('Please select a file first.');
      return;
    }

    setUploading(true);
    try {
      await SavingsService.importSavings(file as unknown as File);
      message.success('Savings imported successfully.');
      setFileList([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      message.error('Failed to import savings. Please check the file format.');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
      if (!isExcel) {
        message.error('You can only upload Excel files!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Modal
      title="Import Savings from Excel"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={handleUpload}
          disabled={fileList.length === 0}
        >
          {uploading ? 'Importing...' : 'Import'}
        </Button>,
      ]}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other
          band files
        </p>
      </Dragger>
      <div style={{ marginTop: 16 }}>
        <Text type="secondary">Supported formats: .xlsx, .xls</Text>
      </div>
    </Modal>
  );
};

export default ImportSavingsModal;
