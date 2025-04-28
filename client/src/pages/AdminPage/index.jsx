import React from 'react'
import AdminStyle from './Style'
import { Card, Typography, Spin, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
const { Title } = Typography;
function AdminPage() {
    const fetchTotalBalance = async () => {
        const response = await api.get('/v1/users/total-balance');
        return response.data;
    };

    const { data, isLoading } = useQuery({
        queryKey: ['totalBalance'],
        queryFn: fetchTotalBalance,
    });
    return (
        <AdminStyle>
            <Space direction="vertical" size={16}>
                <Card style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
                    {isLoading ? (
                        <Spin />
                    ) : (
                        <>
                            <Title level={4}>Общий Баланс Участников</Title>
                            <Title level={2}>{data?.totalBalance ?? 0} TML</Title>
                        </>
                    )}
                </Card>
            </Space>
        </AdminStyle>
    )
}

export default AdminPage
