import React, { useState } from 'react';
import { Table, Button, Card, Tag, Spin, Alert, Modal, Form, Input, DatePicker, Space } from 'antd';
import { PlusOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent, useSyncEvents } from '../hooks/useCalendarQueries';
import moment from 'moment';

const CalendarEvents = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [form] = Form.useForm();

  // React Query hooks
  const { 
    data: events, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useEvents();
  
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const syncEventsMutation = useSyncEvents();

  // Handle modal visibility
  const showModal = (event = null) => {
    setIsEditMode(!!event);
    setCurrentEvent(event);
    
    if (event) {
      form.setFieldsValue({
        title: event.title,
        description: event.description,
        location: event.location,
        startDate: moment(event.start.dateTime),
        endDate: moment(event.end.dateTime),
      });
    } else {
      form.resetFields();
    }
    
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const eventData = {
        title: values.title,
        description: values.description,
        location: values.location,
        start: {
          dateTime: values.startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: values.endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };
      
      if (isEditMode && currentEvent) {
        await updateEventMutation.mutateAsync({
          eventId: currentEvent.id,
          eventData,
        });
      } else {
        await createEventMutation.mutateAsync(eventData);
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // Handle event deletion
  const handleDelete = async (eventId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this event?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteEventMutation.mutateAsync(eventId);
        } catch (error) {
          console.error('Failed to delete event:', error);
        }
      },
    });
  };

  // Handle calendar sync
  const handleSync = async () => {
    try {
      await syncEventsMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to sync events:', error);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Event',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--bs-secondary-color)' }}>
            {record.description && record.description.length > 50
              ? `${record.description.substring(0, 50)}...`
              : record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => location || 'No location',
    },
    {
      title: 'Start',
      dataIndex: ['start', 'dateTime'],
      key: 'start',
      render: (dateTime) => moment(dateTime).format('MMM D, YYYY h:mm A'),
    },
    {
      title: 'End',
      dataIndex: ['end', 'dateTime'],
      key: 'end',
      render: (dateTime) => moment(dateTime).format('MMM D, YYYY h:mm A'),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const now = moment();
        const start = moment(record.start.dateTime);
        const end = moment(record.end.dateTime);
        
        if (now.isBefore(start)) {
          return <Tag color="blue">Upcoming</Tag>;
        } else if (now.isAfter(end)) {
          return <Tag color="gray">Past</Tag>;
        } else {
          return <Tag color="green">In Progress</Tag>;
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showModal(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Loading and error states
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading calendar events...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error?.message || 'Failed to load calendar events'}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div className="calendar-events">
      <Card
        title="Calendar Events"
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              New Event
            </Button>
            <Button 
              icon={<SyncOutlined />} 
              onClick={handleSync}
              loading={syncEventsMutation.isLoading}
            >
              Sync
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={events || []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </Card>

      {/* Create/Edit Event Modal */}
      <Modal
        title={isEditMode ? 'Edit Event' : 'Create Event'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createEventMutation.isLoading || updateEventMutation.isLoading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: 'Please enter event title' }]}
          >
            <Input placeholder="Enter event title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter event description" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="Location"
          >
            <Input placeholder="Enter event location" />
          </Form.Item>
          
          <Form.Item
            name="startDate"
            label="Start Date & Time"
            rules={[{ required: true, message: 'Please select start date and time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="endDate"
            label="End Date & Time"
            rules={[{ required: true, message: 'Please select end date and time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarEvents;
