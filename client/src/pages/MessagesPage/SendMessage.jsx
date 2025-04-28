import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Select, Button, Form, Input, message, Spin } from 'antd';
import { debounce } from 'lodash';
import api from '../../api';

const PAGE_SIZE = 10;

const SendMessageForm = () => {
    // Состояния для пользователей
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [telegramIdSearch, setTelegramIdSearch] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userPagination, setUserPagination] = useState({ current: 1, pageSize: PAGE_SIZE });

    // Состояния для сообщений
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [messagePagination, setMessagePagination] = useState({ current: 1, pageSize: PAGE_SIZE });

    const usersSelectRef = useRef(null);
    const messagesSelectRef = useRef(null);

    // Запрос пользователей с пагинацией и поиском
    const {
        data: usersData,
        isLoading: isLoadingUsers,
        isFetching: isFetchingUsers
    } = useQuery({
        queryKey: ['users', userPagination.current, userSearchQuery],
        queryFn: async () => {
            const res = await api.post('/v1/users/findAll', {
                page: userPagination.current,
                limit: userPagination.pageSize,
                search: userSearchQuery
            });
            return {
                data: res.data.result,
                pagination: res.data.pagination
            };
        },
        keepPreviousData: true
    });

    // Запрос сообщений с пагинацией
    const {
        data: messagesData,
        isLoading: isLoadingMessages,
        isFetching: isFetchingMessages
    } = useQuery({
        queryKey: ['messages', messagePagination.current],
        queryFn: async () => {
            const res = await api.post('/v1/messages/findAll', {
                page: messagePagination.current,
                limit: messagePagination.pageSize
            });
            return {
                data: res.data.result,
                pagination: res.data.pagination
            };
        },
        keepPreviousData: true
    });

    // Поиск конкретного пользователя по Telegram ID
    const { data: searchedUser, refetch: searchUser, isFetching: isSearchingUser } = useQuery({
        queryKey: ['userSearch', telegramIdSearch],
        queryFn: async () => {
            if (!telegramIdSearch) return null;
            const res = await api.post('/v1/users/findByTelegramId', { telegramId: telegramIdSearch });
            return res.data.result;
        },
        enabled: false
    });

    // Отправка сообщения
    const { mutate: sendMessage, isLoading: isSending } = useMutation({
        mutationFn: async (payload) => {
            const res = await api.post('/v1/messages/bulk-send', payload);
            return res.data;
        },
        onSuccess: () => {
            message.success('Сообщение успешно отправлено!');
            setSelectedUserIds([]);
            setSelectedMessageId(null);
            setTelegramIdSearch('');
        },
        onError: (error) => {
            message.error(`Ошибка: ${error.response?.data?.message || error.message}`);
        }
    });

    // Обработчики прокрутки для подгрузки данных
    const handleUsersScroll = debounce(async (event) => {
        const { target } = event;
        if (
            !isFetchingUsers &&
            usersData?.pagination?.next &&
            target.scrollTop + target.offsetHeight >= target.scrollHeight - 20
        ) {
            setUserPagination(prev => ({
                ...prev,
                current: prev.current + 1
            }));
        }
    }, 200);

    const handleMessagesScroll = debounce(async (event) => {
        const { target } = event;
        if (
            !isFetchingMessages &&
            messagesData?.pagination?.next &&
            target.scrollTop + target.offsetHeight >= target.scrollHeight - 20
        ) {
            setMessagePagination(prev => ({
                ...prev,
                current: prev.current + 1
            }));
        }
    }, 200);

    // Оптимизированные списки данных
    const usersOptions = useMemo(() =>
        usersData?.data?.map(user => ({
            label: `${user.firstName || 'Без имени'} (ID: ${user.id})`,
            value: user.id
        })) || [],
        [usersData]
    );

    const messagesOptions = useMemo(() =>
        messagesData?.data?.map(msg => ({
            label: `${msg.title || 'Без названия'} (ID: ${msg.id})`,
            value: msg.id
        })) || [],
        [messagesData]
    );

    // Обработчик поиска пользователя по Telegram ID
    const handleSearchUser = () => {
        if (!telegramIdSearch) {
            message.warning('Введите Telegram ID');
            return;
        }
        searchUser();
    };

    // Обработчик отправки сообщения
    const handleSubmit = () => {
        if (selectedUserIds.length === 0) {
            message.warning('Выберите хотя бы одного пользователя!');
            return;
        }
        if (!selectedMessageId) {
            message.warning('Выберите сообщение!');
            return;
        }
        sendMessage({
            user_ids: selectedUserIds,
            message_ids: [selectedMessageId],
        });
    };

    return (
        <Form layout="vertical" style={{ maxWidth: 500 }}>
            {/* Поиск пользователя по Telegram ID */}
            <Form.Item label="Поиск пользователя (Telegram ID)">
                <Input
                    value={telegramIdSearch}
                    onChange={(e) => setTelegramIdSearch(e.target.value)}
                    placeholder="Введите Telegram ID"
                />
                <Button
                    onClick={handleSearchUser}
                    style={{ marginTop: 8 }}
                    loading={isSearchingUser}
                >
                    Найти
                </Button>
                {searchedUser && (
                    <div style={{ marginTop: 8 }}>
                        Найден: {searchedUser.firstName} (ID: {searchedUser.id})
                        <Button
                            size="small"
                            onClick={() => {
                                if (!selectedUserIds.includes(searchedUser.id)) {
                                    setSelectedUserIds([...selectedUserIds, searchedUser.id]);
                                }
                            }}
                            style={{ marginLeft: 8 }}
                            disabled={selectedUserIds.includes(searchedUser.id)}
                        >
                            {selectedUserIds.includes(searchedUser.id) ? 'Добавлен' : 'Добавить'}
                        </Button>
                    </div>
                )}
            </Form.Item>

            {/* Выбор пользователей с пагинацией */}
            <Form.Item label="Выберите пользователей">
                <Select
                    mode="multiple"
                    placeholder="Начните вводить имя пользователя"
                    loading={isLoadingUsers}
                    value={selectedUserIds}
                    onChange={setSelectedUserIds}
                    onSearch={debounce((value) => {
                        setUserSearchQuery(value);
                        setUserPagination(prev => ({ ...prev, current: 1 }));
                    }, 500)}
                    onPopupScroll={handleUsersScroll}
                    filterOption={false}
                    showSearch
                    ref={usersSelectRef}
                    style={{ width: '100%' }}
                    options={usersOptions}
                    notFoundContent={isFetchingUsers ? <Spin size="small" /> : 'Ничего не найдено'}
                    listHeight={250}
                />
            </Form.Item>

            {/* Выбор сообщения с пагинацией */}
            <Form.Item label="Выберите сообщение">
                <Select
                    placeholder="Начните вводить название сообщения"
                    loading={isLoadingMessages}
                    value={selectedMessageId}
                    onChange={setSelectedMessageId}
                    onPopupScroll={handleMessagesScroll}
                    showSearch
                    ref={messagesSelectRef}
                    style={{ width: '100%' }}
                    options={messagesOptions}
                    notFoundContent={isFetchingMessages ? <Spin size="small" /> : 'Ничего не найдено'}
                    listHeight={250}
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                />
            </Form.Item>

            <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSending}
                disabled={selectedUserIds.length === 0 || !selectedMessageId}
                style={{ marginTop: 16 }}
            >
                Отправить сообщение
            </Button>
        </Form>
    );
};

export default SendMessageForm;