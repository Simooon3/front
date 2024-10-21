import { Typography, Form, Input, Button, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './MainContent.css';  

const MainContent = ({ selectedKey }) => {
    const [form] = Form.useForm();
    const [clientData, setClientData] = useState(null);
    const [searchCedula, setSearchCedula] = useState('');
    const navigate = useNavigate();

    // Función simulada para el cierre de sesión
    const handleLogout = () => {
        console.log("User logged out");
        navigate('/login'); // Navega a la página de login
    };

    // Ejecuta handleLogout cuando selectedKey es '6'
    useEffect(() => {
        if (selectedKey === '6') {
            handleLogout();
        }
    }, [selectedKey]);

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const handleClean = () => {
        form.resetFields();
        setClientData(null);
        setSearchCedula('');
    };

    // Información para ejemplificar el funcionamiento de la aplicación
    const handleSearch = () => {
        const fetchedClientData = {
            cedula: searchCedula,
            nombre: 'Juan',
            apellido: 'Pérez',
            correo: 'juan.perez@example.com',
            contraseña: 'password123',
            telefono: '1234567890',
            direccion: 'Calle Falsa 123',
        };
        form.setFieldsValue(fetchedClientData);
        setClientData(fetchedClientData);
    };

    if (selectedKey === '2') {
        return (
            <div className="new-client-form-container">
                <Form layout="vertical" name="newClientForm" form={form} onFinish={onFinish}>
                    <Typography.Title level={3} align="center" strong className="new-client-title">
                        New Client
                    </Typography.Title>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Cedula"
                                name="cedula"
                                rules={[{ required: true, message: 'Please input the client\'s cedula!' }]}
                            >
                                <Input placeholder="Enter cedula" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Nombre"
                                name="nombre"
                                rules={[{ required: true, message: 'Please input the client\'s name!' }]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Apellido"
                                name="apellido"
                                rules={[{ required: true, message: 'Please input the client\'s last name!' }]}
                            >
                                <Input placeholder="Enter last name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Correo"
                                name="correo"
                                rules={[{ required: true, message: 'Please input the client\'s email!' }]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Contraseña"
                                name="contraseña"
                                rules={[{ required: true, message: 'Please input a password!' }]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Teléfono"
                                name="telefono"
                                rules={[{ required: true, message: 'Please input the client\'s phone number!' }]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Dirección"
                        name="direccion"
                        rules={[{ required: true, message: 'Please input the client\'s address!' }]}
                    >
                        <Input placeholder="Enter address" />
                    </Form.Item>

                    <Button block type="primary" htmlType="submit">
                        Register Client
                    </Button>

                    <Button block type="default" onClick={handleClean} style={{ marginTop: '1rem' }}>
                        Clean
                    </Button>
                </Form>
            </div>
        );
    }

    if (selectedKey === '3') {
        return (
            <div className="search-client-form-container">
                <Form layout="vertical" name="searchClientForm" form={form}>
                    <Typography.Title level={3} align="center" strong className="search-client-title">
                        Search Client
                    </Typography.Title>

                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item
                                label="Buscar por Cédula"
                                name="searchCedula"
                            >
                                <Input 
                                    placeholder="Enter cedula"
                                    value={searchCedula}
                                    onChange={(e) => setSearchCedula(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button block type="primary" onClick={handleSearch} style={{ marginBottom: '1rem' }}>
                        Buscar Cliente
                    </Button>

                    {clientData && (
                        <>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Cedula" name="cedula">
                                        <Input disabled value={clientData.cedula} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Nombre" name="nombre">
                                        <Input disabled value={clientData.nombre} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Apellido" name="apellido">
                                        <Input disabled value={clientData.apellido} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Correo" name="correo">
                                        <Input disabled value={clientData.correo} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Teléfono" name="telefono">
                                        <Input disabled value={clientData.telefono} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Dirección" name="direccion">
                                        <Input disabled value={clientData.direccion} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}

                    <Button block type="default" onClick={handleClean} style={{ marginTop: '1rem' }}>
                        Clean
                    </Button>
                </Form>
            </div>
        );
    }

    return <div className="default-content">Regresaste al Dashboard</div>;
};

export default MainContent;