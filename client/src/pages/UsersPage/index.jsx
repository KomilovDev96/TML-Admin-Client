import { Button, Descriptions, Drawer, Input, Select, Space, Table, Tag } from 'antd';
import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../api';

function UsersPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('');
    const [gameId, setGameId] = useState('');


    const fetchGames = async () => {
        const response = await api.post('/v1/games/findAll', { page: 1, limit: 100 });
        return response.data.result || [];
    };

    const { data: games } = useQuery({
        queryKey: ['games'],
        queryFn: fetchGames,
    });



    const fetchUsers = async (page, limit = 10, status = '', gameId = '') => {
        const payload = { page, limit };
        if (status) payload.status = status;
        if (gameId) payload.game_id = gameId;

        const response = await api.post('/v1/users/findAll', payload);
        return response.data;
    };


    const { data, isLoading } = useQuery({
        queryKey: ['users', page, status, gameId],
        queryFn: () => fetchUsers(page, 10, status, gameId),
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
    const filteredData = data?.result?.filter((user) =>
        user?.telegramId?.toString()?.includes(search)
    ) || [];

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
            <Space style={{ marginBottom: 16 }}>
                <Select
                    placeholder="Статус"
                    value={status}
                    onChange={(value) => {
                        setStatus(value);
                        setPage(1);
                    }}
                    style={{ width: 160, marginLeft: 8 }}
                    allowClear
                >
                    <Select.Option value="active">Активные</Select.Option>
                    <Select.Option value="inactive">Неактивные</Select.Option>
                </Select>
            </Space>
            <Select
                placeholder="Игра"
                value={gameId}
                onChange={(value) => {
                    setGameId(value);
                    setPage(1);
                }}
                style={{ width: 200 }}
                allowClear
            >
                {games?.map((game) => (
                    <Select.Option key={game.id} value={game.id}>
                        {game.name}
                    </Select.Option>
                ))}
            </Select>
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
                scroll={{ x: 'max-content' }}
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
