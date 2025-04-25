import React, { useState } from 'react';
import { Table, Input, Select, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
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

const TransactionsPage = () => {
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState('');
    const [currency, setCurrency] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');

    const { data, isLoading } = useQuery({
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

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id',
            responsive: ['md'],
        },
        {
            title: 'Пользователь', dataIndex: 'user_id', key: 'user_id',
            responsive: ['md'],
        },
        {
            title: 'Тип', dataIndex: 'type', key: 'type',
            responsive: ['md'],
        },
        {
            title: 'Валюта', dataIndex: 'currency', key: 'currency',
            responsive: ['md'],
        },
        {
            title: 'Сумма', dataIndex: 'amount', key: 'amount',
            responsive: ['md'],
        },
        {
            title: 'Баллы', dataIndex: 'score', key: 'score',
            responsive: ['md'],
        },
        {
            title: 'Статус', dataIndex: 'status', key: 'status',
            responsive: ['md'],
        },
        {
            title: 'From Address', dataIndex: 'from_address', key: 'from_address',
            responsive: ['md'],
        },
        {
            title: 'TxID', dataIndex: 'txid', key: 'txid',
            responsive: ['md'],
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
                    style={{ width: 120 }}
                >
                    <Option value="deposit">Deposit</Option>
                    <Option value="withdraw">Transfer</Option>
                </Select>
                <Select
                    placeholder="Status"
                    value={status}
                    onChange={setStatus}
                    allowClear
                    style={{ width: 150 }}
                >
                    <Option value="pending">pending</Option>
                    <Option value="completed">completed</Option>
                    <Option value="failed">failed</Option>
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
        </>
    );
};

export default TransactionsPage;
