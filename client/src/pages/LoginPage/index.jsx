import React from 'react';
import { Button, Form, Input } from 'antd';
import Lottie from "lottie-react";
import groovyWalkAnimation from './sigin.json'
import Logo from './photo_2025-03-18_12-14-35.jpg'
import { LoginStyle, LotiFiy } from './Style';


function LoginPage() {
    const [form] = Form.useForm();
    const onFinish = values => {
        console.log('Success:', values);
        form.resetFields();
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
        form.resetFields();

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
                    name="phoneNumber"
                    label=" Number"
                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="referral_link"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </LoginStyle>
    )
}


export default LoginPage
