import { Button, Space, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
function UsersPage() {
    const fetchUsers = async (
        page,
        limit,
    ) => {
        const params = { page, limit };
        const response = await api.post('/v1/users/findAll', { params });
        return response.data;
    };

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
    });

    const [filters, setFilters] = useState({
        status: 'active',
        game_id: 1,
    });

    const { data, isLoading, isPreviousData } = useQuery({
        queryKey: ['users', pagination.current, pagination.pageSize],
        queryFn: () => fetchUsers(
            pagination.current,
            pagination.pageSize
        ),
        keepPreviousData: true,
    });

    // Обновляем пагинацию при получении данных
    useEffect(() => {
        if (data?.pagination) {
            setPagination(prev => ({
                ...prev,
                current: data.pagination.current,
                pageSize: data.pagination.perPage,
                total: data.pagination.totalItem,
            }));
        }
    }, [data?.pagination]);

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };


    const clearFilters = () => {
        setFilteredInfo({});
    };
    const clearAll = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };
    const setAgeSort = () => {
        setSortedInfo({
            order: 'descend',
            columnKey: 'age',
        });
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
            ],
        },
        {
            title: 'Game ID',
            dataIndex: 'game_id',
            key: 'game_id',
        },
    ];


    return (
        <div>
            <Button onClick={setAgeSort}>Sort age</Button>
            <Button onClick={clearFilters}>Clear filters</Button>
            <Button onClick={clearAll}>Clear filters and sorters</Button>
            <Table
                columns={columns}
                dataSource={data?.result || []}
                rowKey="id"
                pagination={pagination}
                loading={isLoading || isPreviousData}
                onChange={handleTableChange}
            />

        </div>
    )
}

export default UsersPage








