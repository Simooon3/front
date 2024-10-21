import './Login.css';
import { Button, Card, Checkbox, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';

const onFinish = (values) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Login = () => {
    // Agregar la clase login-body al body al cargar el componente y removerla al salir
    useEffect(() => {
        document.body.classList.add('login-body');
        return () => {
            document.body.classList.remove('login-body');
        };
    }, []);

    return (
        <Card className="login-container">
            <Typography.Title level={3} align="center" strong className="title">
                Log In
            </Typography.Title>
            <Typography.Text type="secondary" strong className="slogan">
                Bienvenido a Nombre de Empresa o slogan
            </Typography.Text>

            <Form name="formLogin" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email' }]}
                >
                    <Input placeholder="user@gmail.com"></Input>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password' }]}
                >
                    <Input.Password></Input.Password>
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" className="checkBoxRemember">
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Button block type="primary" htmlType="submit">
                    Log In
                </Button>
            </Form>
        </Card>
    );
};

export default Login;
