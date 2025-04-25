import React, { useState } from 'react';
import {
    Table,
    Button,
    Drawer,
    InputNumber,
    Form,
    message,
} from 'antd';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../api';

function StepsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingStep, setEditingStep] = useState(null);
    const [form] = Form.useForm();

    // Получение списка степов
    const fetchSteps = async () => {
        const response = await api.post('/v1/steps/findAll');
        return response.data.result;
    };

    const { data: steps, isLoading, refetch } = useQuery({
        queryKey: ['steps'],
        queryFn: fetchSteps,
    });

    // Мутация для обновления степа
    const updateStep = async (stepData) => {
        const response = await api.post('/v1/steps/update', stepData);
        return response.data;
    };

    const mutation = useMutation({
        mutationFn: updateStep,
        onSuccess: () => {
            message.success('Данные обновлены');
            setDrawerOpen(false);
            refetch();
        },
        onError: () => {
            message.error('Ошибка при обновлении');
        },
    });

    const handleEdit = (record) => {
        setEditingStep(record);
        setDrawerOpen(true);
        form.setFieldsValue({
            id: record.id,
            step1_score: record.step1_score,
            step1_amount: record.step1_amount || 0,
            step2_score: record.step2_score,
            step2_amount: record.step2_amount || 0,
            step3_score: record.step3_score,
            step3_amount: record.step3_amount || 0,
            step4_score: record.step4_score,
            step4_amount: record.step4_amount || 0,
        });
    };

    const onFinish = (values) => {
        mutation.mutate(values);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Step 1',
            dataIndex: 'step1_score',
        },
        {
            title: 'Step 2',
            dataIndex: 'step2_score',
        },
        {
            title: 'Step 3',
            dataIndex: 'step3_score',
        },
        {
            title: 'Step 4',
            dataIndex: 'step4_score',
        },
        {
            title: 'Действия',
            render: (_, record) => (
                <Button type="link" onClick={() => handleEdit(record)}>
                    Редактировать
                </Button>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Table
                columns={columns}
                dataSource={steps || []}
                rowKey="id"
                loading={isLoading}
            />
            <Drawer
                title="Редактировать степ"
                placement="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                width={400}
            >
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item name="id" hidden><InputNumber /></Form.Item>

                    {Array.from({ length: 4 }, (_, i) => (
                        <React.Fragment key={i}>
                            <Form.Item label={`Step ${i + 1} Score`} name={`step${i + 1}_score`}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label={`Step ${i + 1} Amount`} name={`step${i + 1}_amount`}>
                                <InputNumber style={{ width: '100%' }} />
                            </Form.Item>
                        </React.Fragment>
                    ))}

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={mutation.isLoading}>
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
}

export default StepsPage;
