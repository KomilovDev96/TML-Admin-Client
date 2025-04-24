import { Button, Descriptions, Drawer, Input, Space, Table, Tag } from 'antd';
import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
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


    const fetchUser = async (telegramId) => {
        const response = await api.post('/v1/users/findByTelegramId', { telegramId });
        return response.data.result;
    };
    // 🔍 Фильтрация по telegramId
    const filteredData = data?.result.filter((user) =>
        user.telegramId.toString().includes(search)
    )
    const [telegramId, setTelegramId] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    const mutation = useMutation({
        mutationFn: fetchUser,
        onSuccess: (data) => {
            setUserData(data);
            setIsDrawerOpen(true);
        },
        onError: () => {
            message.error('Пользователь не найден');
        },
    });

    const handleSearch = () => {
        if (!telegramId) {
            message.warning('Введите Telegram ID');
            return;
        }
        mutation.mutate(telegramId);
    };

    return (
        <div>
            <Input
                placeholder="Введите Telegram ID"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                style={{ width: 300, marginRight: 8 }}
            />
            <Button type="primary" onClick={handleSearch}>
                Поиск
            </Button>
            <Drawer
                title="Информация о пользователе"
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                {userData && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="ID">{userData.id}</Descriptions.Item>
                        <Descriptions.Item label="Имя">{userData.firstName}</Descriptions.Item>
                        <Descriptions.Item label="Юзернейм">@{userData.userName}</Descriptions.Item>
                        <Descriptions.Item label="Язык">{userData.language}</Descriptions.Item>
                        <Descriptions.Item label="Telegram ID">{userData.telegramId}</Descriptions.Item>
                        <Descriptions.Item label="Баланс">{userData.balance}</Descriptions.Item>
                        <Descriptions.Item label="Статус">{userData.status}</Descriptions.Item>
                        <Descriptions.Item label="Реферальная ссылка">{userData.referral_link}</Descriptions.Item>
                        <Descriptions.Item label="Оценки">
                            step1: {userData.step1_score}, step2: {userData.step2_score},<br />
                            step3: {userData.step3_score}, step4: {userData.step4_score}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Drawer>
            
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
