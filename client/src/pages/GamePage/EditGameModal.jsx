import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import api from '../../api';
import dayjs from 'dayjs';
const { Option } = Select;

const EditGameModal = ({ visible, onClose, game, refetch }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (game) {
            form.setFieldsValue({
                ...game,
                start_date: game.start_date ? dayjs(game.start_date) : null,
                end_date: game.end_date ? dayjs(game.end_date) : null,
            });
        }
    }, [game, form]);

    const updateGameMutation = useMutation({
        mutationFn: async (updatedGame) => {
            const response = await api.post('/v1/games/update', updatedGame);
            return response.data;
        },
        onSuccess: () => {
            message.success('Игра изменена');
            onClose();
            refetch();
        },
        onError: () => {
            message.error('Ошибка при изменении игры');
        },
    });

    const handleOk = () => {
        form.validateFields().then(values => {
            updateGameMutation.mutate({
                ...values,
                id: game.id,
                start_date: values.start_date.format('YYYY-MM-DD'),
                end_date: values.end_date.format('YYYY-MM-DD'),
            });
        });
    };

    return (
        <Modal
            title="Изменить игру"
            open={visible}
            onCancel={onClose}
            onOk={handleOk}
            okText="Сохранить"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="start_date" label="Дата начала" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="end_date" label="Дата окончания" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                    <Select>
                        <Option value="active">Активный</Option>
                        <Option value="inactive">Неактивный</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditGameModal;
