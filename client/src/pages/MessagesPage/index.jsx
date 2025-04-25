import React, { useState } from 'react';
import {
    Button,
    Card,
    Descriptions,
    Drawer,
    Form,
    Input,
    message,
    Popconfirm,
    Space,
    Table
} from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../api';

function MessagesPage() {
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [sentMessage, setSentMessage] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [foundMessage, setFoundMessage] = useState(null)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const openEditDrawer = (message) => {
        setEditingMessage(message);
        setEditTitle(message.title);
        setEditContent(message.content);
        setEditDrawerOpen(true);
    };

    const updateMessage = async ({ id, title, content }) => {
        const response = await api.post('/v1/messages/update', { id, title, content });
        return response.data.result;
    };

    const updateMutation = useMutation({
        mutationFn: updateMessage,
        onSuccess: () => {
            message.success('Сообщение обновлено');
            setEditDrawerOpen(false);
            refetch(); // Обновляем список
        },
        onError: () => {
            message.error('Ошибка при обновлении');
        },
    });




    // ✅ Поиск сообщения по ID
    const fetchMessageById = async (id) => {
        const response = await api.post('/v1/messages/findOne', { id: Number(id) });
        return response.data.result;
    };

    const searchMutation = useMutation({
        mutationFn: fetchMessageById,
        onSuccess: (data) => {
            setFoundMessage(data);
        },
        onError: () => {
            message.error('Сообщение не найдено');
            setFoundMessage(null);
        },
    });

    const handleSearchById = () => {
        if (!searchId) {
            message.warning('Введите ID');
            return;
        }
        searchMutation.mutate(searchId);
    };


    // ✅ Создание сообщения
    const createMessage = async (data) => {
        const response = await api.post('/v1/messages/create', data);
        return response.data.result;
    };

    const mutation = useMutation({
        mutationFn: createMessage,
        onSuccess: (data) => {
            message.success('Сообщение отправлено!');
            setSentMessage(data);
            setDrawerOpen(false);
            form.resetFields();
            refetch();
        },
        onError: () => {
            message.error('Ошибка при отправке сообщения');
        },
    });

    const onFinish = (values) => {
        mutation.mutate(values);
    };


    // Удаляем 
    const deleteMessage = async (id) => {
        const response = await api.post('/v1/messages/remove', { id });
        return response.data;
    };

    const deleteMutation = useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            message.success('Сообщение удалено');
            refetch(); // Обновляем список после удаления
        },
        onError: () => {
            message.error('Ошибка при удалении');
        },
    });
    // ✅ Получение сообщений
    const fetchMessages = async (page) => {
        const response = await api.post('/v1/messages/findAll', {
            page,
            limit: 10,
        });
        return response.data;
    };
    const {
        data,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['messages', page],
        queryFn: () => fetchMessages(page),
        keepPreviousData: true,
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Заголовок',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Текст',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Отправлено',
            dataIndex: 'sent_at',
            key: 'sent_at',
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => openEditDrawer(record)}>
                        Редактировать
                    </Button>
                    <Popconfirm
                        title="Удалить игру?"

                        onConfirm={() => deleteMutation.mutate(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button danger type="link" >Удалить</Button>

                    </Popconfirm>
                </Space>
            ),
        }

    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Поиск по ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button onClick={handleSearchById}>Найти сообщение</Button>
            </Space>
            <Card
                title="Список сообщений"
                extra={
                    <Button type="primary" onClick={() => setDrawerOpen(true)}>
                        Создать сообщение
                    </Button>
                }
            >
                <Table
                    columns={columns}
                    dataSource={data?.result || []}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{
                        current: data?.pagination?.current || page,
                        total: data?.pagination?.totalItem || 0,
                        pageSize: data?.pagination?.perPage || 10,
                        onChange: (newPage) => setPage(newPage),
                    }}
                />
            </Card>
            <Drawer
                title="Редактировать сообщение"
                placement="left"
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
            >
                <Input
                    placeholder="Заголовок"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ marginBottom: 12 }}
                />
                <Input.TextArea
                    placeholder="Содержимое"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    style={{ marginBottom: 12 }}
                />
                <Button
                    type="primary"
                    onClick={() =>
                        updateMutation.mutate({
                            id: editingMessage.id,
                            title: editTitle,
                            content: editContent,
                        })
                    }
                    loading={updateMutation.isLoading}
                >
                    Сохранить
                </Button>
            </Drawer>
            <Drawer
                title="Новое сообщение"
                placement="left"
                width={400}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
            >
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item
                        label="Заголовок"
                        name="title"
                        rules={[{ required: true, message: 'Введите заголовок' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Содержимое"
                        name="content"
                        rules={[{ required: true, message: 'Введите текст сообщения' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={mutation.isLoading} block>
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {sentMessage && (
                <Card title="Последнее сообщение" style={{ marginTop: 24 }}>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="ID">{sentMessage.id}</Descriptions.Item>
                        <Descriptions.Item label="Заголовок">{sentMessage.title}</Descriptions.Item>
                        <Descriptions.Item label="Текст">{sentMessage.content}</Descriptions.Item>
                        <Descriptions.Item label="Время отправки">
                            {new Date(sentMessage.sent_at).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
            {foundMessage && (
                <Card title={`Сообщение ID: ${foundMessage.id}`} style={{ marginTop: 24 }}>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Заголовок">{foundMessage.title}</Descriptions.Item>
                        <Descriptions.Item label="Содержимое">{foundMessage.content}</Descriptions.Item>
                        <Descriptions.Item label="Отправлено">
                            {new Date(foundMessage.sent_at).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </div>
    );
}

export default MessagesPage;
