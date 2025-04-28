import React, { useState } from 'react';
import {
    Table,
    Input,
    Select,
    Space,
    Button,
    Drawer,
    Form,
    message,
} from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api';

const { Option } = Select;

const fetchTransactions = async ({ page, limit, user_id, currency, type, status }) => {
    const payload = {
        page,
        limit,
        user_id,
        currency,
        type,
        status,
    };
    const response = await api.post('/v1/transactions/findAll', payload);
    return response.data;
};

const updateTransaction = async (payload) => {
    const response = await api.post('/v1/transactions/update', payload);
    return response.data;
};

const TransactionsPage = () => {
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState('');
    const [currency, setCurrency] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentTx, setCurrentTx] = useState(null);
    const [form] = Form.useForm();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['transactions', page, userId, currency, type, status],
        queryFn: () =>
            fetchTransactions({
                page,
                limit: 10,
                user_id: userId || undefined,
                currency: currency || undefined,
                type: type || undefined,
                status: status || undefined,
            }),
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: updateTransaction,
        onSuccess: () => {
            message.success('Статус обновлён');
            setDrawerOpen(false);
            refetch();
        },
        onError: () => {
            message.error('Ошибка при обновлении');
        },
    });

    const handleEdit = (record) => {
        setCurrentTx(record);
        form.setFieldsValue({
            id: record.id,
            status: record.status,
        });
        setDrawerOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Пользователь',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Валюта',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Сумма',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Баллы',
            dataIndex: 'score',
            key: 'score',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'From Address',
            dataIndex: 'from_address',
            key: 'from_address',
        },
        {
            title: 'TxID',
            dataIndex: 'txid',
            key: 'txid',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    Редактировать
                </Button>
            ),
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    style={{ width: 150 }}
                />
                <Select
                    placeholder="Currency"
                    value={currency}
                    onChange={setCurrency}
                    allowClear
                    style={{ width: 120 }}
                >
                    <Option value="usd">USD</Option>
                    <Option value="usdt">USDT</Option>
                </Select>
                <Select
                    placeholder="Type"
                    value={type}
                    onChange={setType}
                    allowClear
                    style={{ width: 180 }}
                >
                    <Option value="deposit">Бизга тулов килганлар</Option>
                    <Option value="withdraw">Баллдан пуллга уткизганлар</Option>
                </Select>
                <Select
                    placeholder="Status"
                    value={status}
                    onChange={setStatus}
                    allowClear
                    style={{ width: 150 }}
                >
                    <Option value="pending">Кутиб турганлар</Option>
                    <Option value="completed">Тастикланганлар</Option>
                    <Option value="failed">Муофиякатсиз</Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={data?.result || []}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    current: data?.pagination?.current || page,
                    total: data?.pagination?.totalItem || 0,
                    pageSize: data?.pagination?.perPage || 10,
                    onChange: (newPage) => setPage(newPage),
                }}
                scroll={{ x: 'max-content' }}
            />

            <Drawer
                title="Редактировать статус"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={400}
            >
                <Form form={form} layout="vertical" onFinish={mutation.mutate}>
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Статус" name="status" rules={[{ required: true }]}>
                        <Select placeholder="Выберите статус">
                            <Option value="pending">Кутиб турган</Option>
                            <Option value="completed">Тастикланган</Option>
                            <Option value="failed">Муофиякатсиз</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={mutation.isLoading}>
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default TransactionsPage;