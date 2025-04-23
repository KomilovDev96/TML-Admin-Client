import { Button, Input, Space, Table, Tag } from 'antd';
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

function UsersPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    const fetchUsers = async (page, limit = 10) => {
        const response = await api.post('/v1/users/findAll', {
            page,
            limit,
            status: 'active',
            game_id: 1,
        });
        return response.data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['users', page],
        queryFn: () => fetchUsers(page),
        keepPreviousData: true,
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Язык',
            dataIndex: 'language',
            key: 'language',
        },
        {
            title: 'Юзернейм',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Телеграм ID',
            dataIndex: 'telegramId',
            key: 'telegramId',
            sorter: (a, b) => Number(a.telegramId) - Number(b.telegramId),
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: 'ascend',
        },
        {
            title: 'Steps',
            key: 'steps',
            render: (record) => (
                `${record.step1_score} / 
                ${record.step2_score} / 
                ${record.step3_score}  /
                ${record.step4_score}`
            ),
        },
        {
            title: 'Баланс',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: 'Реф. ссылка',
            dataIndex: 'referral_link',
            key: 'referral_link',
        },
        {
            title: 'Пригласил',
            dataIndex: 'referred_by',
            key: 'referred_by',
            render: (value) => value || '—',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Создан',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
    ];

    // 🔍 Фильтрация по telegramId
    const filteredData = data?.result.filter((user) =>
        user.telegramId.toString().includes(search)
    )

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Поиск по Telegram ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredData || []}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    current: data?.pagination.current || page,
                    total: data?.pagination.totalItem || 0,
                    pageSize: data?.pagination.perPage || 10,
                    onChange: (newPage) => setPage(newPage),
                }}
            />
        </div>
    )
}

export default UsersPage;
