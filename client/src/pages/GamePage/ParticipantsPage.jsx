import React, { useEffect, useState } from 'react';
import { Table, Form, InputNumber, Button, Card, Descriptions, Drawer, Input, Space } from 'antd';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';

function ParticipantsPage() {
    const [page, setPage] = useState(1);
    const [form, editForm] = Form.useForm();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);


    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState(null);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [participantDetails, setParticipantDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const openEditDrawer = (record) => {
        setEditingParticipant(record);
        editForm.setFieldsValue(record);
        setEditDrawerVisible(true);
    };
    const updateParticipant = async (data) => {
        const response = await api.post('/v1/participants/update', data);
        return response.data;
    };

    const updateMutation = useMutation({
        mutationFn: updateParticipant,
        onSuccess: () => {
            message.success('Участник обновлен');
            setEditDrawerVisible(false);
            refetch(); // обновим список
        },
        onError: () => {
            message.error('Ошибка при обновлении');
        },
    });
    const fetchParticipant = async (id) => {
        const response = await api.post('/v1/participants/findOne', { id });
        return response.data;
    };
    const showParticipantDetails = (record) => {
        setSelectedParticipant(record);
        setDrawerVisible(true);
        setDetailsLoading(true);

        fetchParticipant(record.id)
            .then((data) => setParticipantDetails(data))
            .finally(() => setDetailsLoading(false));
    };
    const fetchParticipants = async (params = {}) => {
        const response = await api.post('/v1/participants/findAll', {
            page,
            limit: 10,
            ...params,
        });
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: fetchParticipants,
        onMutate: () => setLoading(true),
        onSuccess: (data) => {
            setData(data);
            setLoading(false);
        },
        onError: () => {
            setData(null);
            setLoading(false);
        },
    });

    const onFinish = (values) => {
        setPage(1); // сбрасываем на первую страницу при новом поиске
        mutation.mutate(values);
    };

    useEffect(() => {
        // Загружаем данные по умолчанию при открытии страницы
        mutation.mutate({});
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'User ID', dataIndex: 'user_id' },
        { title: 'Game ID', dataIndex: 'game_id' },
        { title: 'Transaction ID', dataIndex: 'transaction_id' },
        { title: 'Номер участника', dataIndex: 'participantNumber' },
        {
            title: 'Дата участия',
            dataIndex: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Действия',
            render: (_, record) => (
                <Space>
                    <Button onClick={() => showParticipantDetails(record)}>Смотреть</Button>
                    <Button type="link" onClick={() => openEditDrawer(record)}>Редактировать</Button>
                </Space>
            ),
        }

    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

            <Card title="Фильтр участников игры" style={{ marginBottom: 20 }}>
                <Form layout="inline" onFinish={onFinish} form={form}>
                    <Form.Item label="User ID" name="user_id">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Game ID" name="game_id">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Номер участника" name="participantNumber">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Найти
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Card title="Участники">
                <Table
                    columns={columns}
                    dataSource={data?.result || []}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: data?.pagination?.current || 1,
                        total: data?.pagination?.totalItem || 0,
                        pageSize: data?.pagination?.perPage || 10,
                        onChange: (newPage) => {
                            setPage(newPage);
                            const values = form.getFieldsValue();
                            mutation.mutate({ ...values, page: newPage });
                        },
                    }}
                />
            </Card>
            <Drawer
                title="Редактировать участника"
                placement="right"
                width={400}
                onClose={() => setEditDrawerVisible(false)}
                open={editDrawerVisible}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={(values) => {
                        updateMutation.mutate({ ...values, id: editingParticipant.id });
                    }}
                >
                    <Form.Item label="User ID" name="user_id" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Game ID" name="game_id" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Transaction ID" name="transaction_id" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={updateMutation.isLoading} block>
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
            <Drawer
                title="Информация об участнике"
                placement="right"
                width={400}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                {detailsLoading ? (
                    <p>Загрузка...</p>
                ) : (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="ID">{participantDetails?.id}</Descriptions.Item>
                        <Descriptions.Item label="User ID">{participantDetails?.user_id}</Descriptions.Item>
                        <Descriptions.Item label="Game ID">{participantDetails?.game_id}</Descriptions.Item>
                        <Descriptions.Item label="Transaction ID">{participantDetails?.transaction_id}</Descriptions.Item>
                        <Descriptions.Item label="Номер участника">{participantDetails?.participantNumber}</Descriptions.Item>
                        <Descriptions.Item label="Создано">
                            {new Date(participantDetails?.created_at).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
        </div>
    );
}

export default ParticipantsPage;
