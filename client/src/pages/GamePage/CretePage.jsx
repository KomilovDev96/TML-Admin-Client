import React, { useState } from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';

const { Option } = Select;

const CretePage = ({ refetchGames }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // изменил имя состояния
    const [form] = Form.useForm();

    // Функция для добавления игры
    const addGameMutation = useMutation({
        mutationFn: async (newGame) => {
            const response = await api.post('/v1/games/create', newGame);
            return response.data;
        },
    });

    const showModal = () => {
        setIsModalOpen(true); // изменил на setIsModalOpen
    };

    const handleCancel = () => {
        setIsModalOpen(false); // изменил на setIsModalOpen
    };

    const handleOk = () => {
        form
            .validateFields()
            .then(async (values) => {
                // Отправляем данные на сервер
                const newGame = {
                    name: values.name,
                    start_date: values.start_date.format('YYYY-MM-DD'), // Форматируем дату
                    end_date: values.end_date.format('YYYY-MM-DD'),     // Форматируем дату
                    participation_amount: parseFloat(values.participation_amount), // Преобразуем строку в число
                    status: values.status,
                };

                try {
                    // Отправляем данные на сервер
                    const result = await addGameMutation.mutateAsync(newGame);
                    message.success(`Игра "${result.result.name}" добавлена!`);
                    setIsModalOpen(false); // Закрываем модальное окно
                    form.resetFields(); // Сбрасываем форму
                    // После успешного добавления игры обновляем таблицу
                    refetchGames(); // Вызываем функцию для обновления данных
                } catch (error) {
                    console.error('Ошибка при добавлении игры:', error.response || error); // Выводим подробности об ошибке
                    message.error('Ошибка при добавлении игры');
                }
            })
            .catch((info) => {
                console.log('Validation Failed:', info);
            });
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Добавить игру
            </Button>

            <Modal
                title="Добавить игру"
                open={isModalOpen} // исправлено с visible на open
                onCancel={handleCancel}
                onOk={handleOk}
                okText="Добавить"
                cancelText="Отмена"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="gameForm"
                    initialValues={{
                        status: 'active',
                    }}
                >
                    <Form.Item
                        label="Название игры"
                        name="name"
                        rules={[{ required: true, message: 'Пожалуйста, введите название игры!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Дата начала"
                        name="start_date"
                        rules={[{ required: true, message: 'Пожалуйста, выберите дату начала!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item
                        label="Дата окончания"
                        name="end_date"
                        rules={[{ required: true, message: 'Пожалуйста, выберите дату окончания!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item
                        label="Сумма участия"
                        name="participation_amount"
                        rules={[{ required: true, message: 'Пожалуйста, введите сумму участия!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Статус"
                        name="status"
                        rules={[{ required: true, message: 'Пожалуйста, выберите статус!' }]}
                    >
                        <Select>
                            <Option value="active">Активный</Option>
                            <Option value="inactive">Неактивный</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CretePage;
