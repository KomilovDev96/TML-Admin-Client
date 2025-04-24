import React, { useState } from 'react';
import { Table, Input, Select, Space, Button } from 'antd';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import CretePage from './CretePage';

const { Option } = Select;

const fetchGames = async ({ page, limit, search, status }) => {
    const payload = {
        page,
        limit,
    };

    if (search) payload.search = search;
    if (status) payload.status = status;

    const response = await api.post('/v1/games/findAll', payload);
    return response.data;
};
const GamePage = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['games', page, limit, search, status],
        queryFn: () => fetchGames({ page, limit, search, status }),
        keepPreviousData: true,
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Дата начала',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Дата окончания',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Сумма участия',
            dataIndex: 'participation_amount',
            key: 'participation_amount',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Игроки',
            render: (_, record) => (
                <>
                    Платили: {record.payers},<br />
                    Не платили: {record.nonPayers},<br />
                    Повторные: {record.repeatPayers}
                </>
            ),
        },
    ];

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setPage(1);
    };


    const {
        data: gamesData,
        isLoading: isGamesLoading,
    } = useQuery({
        queryKey: ['games', { page: 1, limit: 1000 }],
        queryFn: () => fetchGames({ page: 1, limit: 1000 }),
    });


    const [selectedGameId, setSelectedGameId] = useState(null);
    const handleExcelDownload = async (gameId) => {
        if (!gameId) return;

        try {
            const response = await api.get(`/v1/users/export-excel/${gameId}`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `game_${gameId}_users.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            message.error('Ошибка при скачивании Excel');
        }
    };
    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Select
                    loading={isGamesLoading}
                    placeholder="Выберите игру"
                    style={{ width: 250 }}
                    onChange={(value) => setSelectedGameId(value)}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                >
                    {gamesData?.result?.map((game) => (
                        game.id && game.name ? (
                            <Option key={game.id} value={game.id}>
                                {game.name}
                            </Option>
                        ) : null
                    ))}
                </Select>

                <Button
                    type="primary"
                    disabled={!selectedGameId}
                    onClick={() => handleExcelDownload(selectedGameId)}
                >
                    Скачать Excel
                </Button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Поиск по имени"
                    value={search}
                    onChange={handleSearchChange}
                    allowClear
                />
                <Select
                    placeholder="Статус"
                    onChange={handleStatusChange}
                    allowClear
                    style={{ width: 150 }}
                >
                    <Option value="active">Активные</Option>
                    <Option value="inactive">Неактивные</Option>
                </Select>
            </Space>
            <CretePage refetchGames={refetch} />
            <Table
                columns={columns}
                dataSource={data?.result || []}
                loading={isLoading}
                pagination={{
                    current: data?.pagination?.current || 1,
                    total: data?.pagination?.totalItem || 0,
                    pageSize: data?.pagination?.perPage || 10,
                    onChange: (newPage) => setPage(newPage),
                }}
                rowKey="id"
            />
        </>
    );
};

export default GamePage;