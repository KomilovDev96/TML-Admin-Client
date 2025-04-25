import React from 'react';
import { Button, Form, Input } from 'antd';
import Lottie from "lottie-react";
import groovyWalkAnimation from './sigin.json'
import Logo from './photo_2025-03-18_12-14-35.jpg'
import { LoginStyle, LotiFiy } from './Style';
import { useMutation } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../api';



function LoginPage() {
    const navigate = useNavigate();
    // Api cols
    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/auth/login', data)
            return await response.data.result
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            toast.success('Вход выполнен!');
            setTimeout(() => navigate('/'), 1500); // Редирект через 1.5 сек

        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Ошибка входа');
        },
    });


    const [form] = Form.useForm();
    const onFinish = values => {
        loginMutation.mutate(values);
        form.resetFields();
    };
    const onFinishFailed = errorInfo => {
        console.log('Поля не должны быть пусты:', errorInfo);
    };
    return (
        <LoginStyle>
            <LotiFiy>
                <Lottie animationData={groovyWalkAnimation} loop={true} />
            </LotiFiy>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <img src={Logo} alt="jpg" />
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loginMutation.isPending}
                        block
                    >
                        Войти
                    </Button>
                </Form.Item>
                <ToastContainer />

            </Form>
        </LoginStyle>
    )
}


export default LoginPage
