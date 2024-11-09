import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Form, Input, Button, Row, Col, message, Checkbox, Radio, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importa axios
import './MainContent.css';

const MainContent = ({ selectedKey, tecnicoId }) => {
    const [form] = Form.useForm(); // Define `form` usando `useForm`
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState(null);  // Para manejar el equipo seleccionado
    const [isModalVisible, setIsModalVisible] = useState(false);  // Para manejar el modal de edición
    const [clientForm] = Form.useForm();
    const [equipmentForm] = Form.useForm(); // Formulario para el registro de equipo
    const [clientData, setClientData] = useState(null);
    const [searchCedula, setSearchCedula] = useState('');
    const [showEquipmentRegistration, setShowEquipmentRegistration] = useState(false);
    const [clientId, setClientId] = useState(null); // Id del cliente registrado
    const [mostrarBotonRegistrar, setMostrarBotonRegistrar] = useState(false);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        console.log("User logged out");
        navigate('/login'); 
    }, [navigate]);  // Incluimos navigate como dependencia ya que es usada dentro de la funcion

    useEffect(() => {
        if (selectedKey === '4' || selectedKey === '5') {
            const endpoint = selectedKey === '4' ? `asignados/${tecnicoId}` : `historial/${tecnicoId}`;
            axios.get(`http://localhost:4000/equipos/${endpoint}`)
                .then(response => {
                    console.log('Respuesta:', response.data);
                    setEquipos(Array.isArray(response.data) ? response.data : []);
                })
                .catch(error => {
                    console.error('Error al obtener equipos:', error);
                    setEquipos([]);
                });
        } else if (selectedKey === '6') {
            handleLogout();
        }
    }, [selectedKey, tecnicoId, handleLogout]);
    

    const onFinishClient = async (values) => {
        const clientInfo = {
            CedulaCl: values.cedula,
            NombreCl: values.nombre,
            ApellidoCl: values.apellido,
            CorreoCl: values.correo,
            ContraseñaCl: values.contraseña,
            NúmeroCl: values.telefono,
            DirecciónCl: values.direccion
        };
        
        try {
            await registerClient(clientInfo);
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Error al registrar el cliente.");
        }
    };
    
    const registerClient = async (clientInfo) => {
        const response = await axios.post('http://localhost:4000/registrar-cliente', clientInfo);
        console.log('Respuesta del servidor:', response.data);
        setClientId(response.data.id_cliente); // Suponiendo que el backend responde con el ID del cliente
        setClientData(clientInfo); // Guarda la información del cliente
        setShowEquipmentRegistration(true); // Muestra el registro de equipo
    
        message.success("Cliente registrado correctamente.");
        clientForm.resetFields(); // Limpia el formulario de cliente
    };

    const handleClean = () => {
        clientForm.resetFields();
        equipmentForm.resetFields(); // Limpia el formulario de equipo
        setClientData(null);
        setSearchCedula('');
        setShowEquipmentRegistration(false); // Oculta el registro de equipo
    };

    // Búsqueda del cliente
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/buscar-cliente/${searchCedula}`, {
                headers: {
                    'Cache-Control': 'no-cache',  // Evitar caché
                    'Pragma': 'no-cache',  // Evitar caché en HTTP/1.0
                    'Expires': '0'  // Indicar que la respuesta ha expirado
                }
            });
    
            console.log("Datos recibidos del cliente:", response.data);  // Verifica si se reciben los datos correctamente
    
            const fetchedClientData = response.data;
    
            if (fetchedClientData) {
                setClientData({
                    cedula: fetchedClientData.CedulaCl,
                    nombre: fetchedClientData.NombreCl,
                    apellido: fetchedClientData.ApellidoCl,
                    correo: fetchedClientData.CorreoCl,
                    telefono: fetchedClientData.NúmeroCl,
                    direccion: fetchedClientData.DirecciónCl
                });
    
                setMostrarBotonRegistrar(true); // Muestra el botón de registrar equipo si es necesario
            } else {
                message.error("Cliente no encontrado.");
                setMostrarBotonRegistrar(false);
            }
        } catch (error) {
            console.error('Error al buscar el cliente:', error);
            message.error("Error al buscar el cliente.");
            setMostrarBotonRegistrar(false);
        }
    };
    

    

    const onFinishEquipment = async (values) => {
        const equipmentInfo = {
            Marca: values.marca,
            Modelo: values.modelo,
            FechaCompra: values.fechaCompra,
            TipoMantenimiento: values.tipoMantenimiento,
            Revisiones: values.revisiones,
            Problemas: values.problemas,
            ID_Cliente: clientId, // Usa el ID del cliente registrado
            ID_Tecnico: tecnicoId // O el ID del técnico si es necesario
        };
    
        try {
            const response = await axios.post('http://localhost:4000/registrar-equipo', equipmentInfo, {
                headers: {
                    'Content-Type': 'application/json', // Asegúrate de que sea JSON
                }
            });
            console.log('Respuesta del servidor:', response.data);
            message.success("Equipo registrado correctamente.");
            equipmentForm.resetFields(); // Limpia el formulario de equipo.
            setShowEquipmentRegistration(false); // Oculta el formulario si es necesario.
        } catch (error) {
            console.error('Error al registrar el equipo:', error);
            message.error("Error al registrar el equipo.");
        }
    };
   

    // Función para manejar la edición del equipo
    const handleEditEquipo = (equipo) => {
        setSelectedEquipo(equipo); // Guarda el equipo seleccionado
        form.setFieldsValue({ problemas: equipo.Problemas }); // Rellena el formulario con los problemas actuales
        setIsModalVisible(true); // Muestra el modal de edición
    };

    // Función para finalizar el equipo
    const handleFinishEquipo = async () => {
        try {
        const updatedEquipo = {
            ...selectedEquipo,
            Estado: 'Finalizado',
            Problemas: form.getFieldValue('Problemas') // Obtenemos el nuevo valor de problemas
        };

        await axios.put(`http://localhost:4000/equipos/${selectedEquipo.ID_Equipo}`, updatedEquipo);
        message.success("Equipo finalizado correctamente.");
        setIsModalVisible(false);
        setSelectedEquipo(null); // Limpia el equipo seleccionado
        } catch (error) {
        console.error('Error al finalizar el equipo:', error);
        message.error("Error al finalizar el equipo.");
        }
    };

    // Cerrar el modal sin hacer cambios
    const handleCancelModal = () => {
        setIsModalVisible(false);
        setSelectedEquipo(null);
    };
  

    if (selectedKey === '2') {
        return (
            <div className="new-client-form-container">
                {!showEquipmentRegistration ? (
                    <Form layout="vertical" name="newClientForm" form={clientForm} onFinish={onFinishClient}>
                        <Typography.Title level={3} align="center" strong className="new-client-title">
                            New Client
                        </Typography.Title>
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Cedula" name="cedula" rules={[{ required: true, message: "Please input the client's cedula!" }]}>
                                    <Input placeholder="Enter cedula" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: "Please input the client's name!" }]}>
                                    <Input placeholder="Enter name" />
                                </Form.Item>
                            </Col>
                        </Row>
    
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Apellido" name="apellido" rules={[{ required: true, message: "Please input the client's last name!" }]}>
                                    <Input placeholder="Enter last name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Correo" name="correo" rules={[{ required: true, message: "Please input the client's email!" }]}>
                                    <Input placeholder="Enter email" />
                                </Form.Item>
                            </Col>
                        </Row>
    
                        <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Contraseña" name="contraseña" rules={[{ required: true, message: "Please input a password!" }]}>
                                    <Input.Password placeholder="Enter password" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: "Please input the client's phone number!" }]}>
                                    <Input placeholder="Enter phone number" />
                                </Form.Item>
                            </Col>
                        </Row>
    
                        <Form.Item label="Dirección" name="direccion" rules={[{ required: true, message: "Please input the client's address!" }]}>
                            <Input placeholder="Enter address" />
                        </Form.Item>
    
                        <Button block type="primary" htmlType="submit">
                            Register Client
                        </Button>
    
                        <Button block type="default" onClick={handleClean} style={{ marginTop: '1rem' }}>
                            Clean
                        </Button>
                    </Form>
                ) : (
                    <div className="equipment-registration">
                        <Typography.Title level={4} align="center" strong>
                            Register Equipment
                        </Typography.Title>
                        <Form layout="vertical" name="equipmentForm" form={equipmentForm} onFinish={onFinishEquipment}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Marca" name="marca" rules={[{ required: true, message: "Please input the equipment brand!" }]}>
                                        <Input placeholder="Enter brand" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Modelo" name="modelo" rules={[{ required: true, message: "Please input the equipment model!" }]}>
                                        <Input placeholder="Enter model" />
                                    </Form.Item>
                                </Col>
                            </Row>
    
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Fecha de Compra" name="fechaCompra" rules={[{ required: true, message: "Please input the purchase date!" }]}>
                                        <Input placeholder="Enter purchase date" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Tipo de Mantenimiento" name="tipoMantenimiento" rules={[{ required: true, message: "Please select a maintenance type!" }]}>
                                        <Radio.Group>
                                            <Radio value="Mantenimiento Correctivo">Mantenimiento Correctivo</Radio>
                                            <Radio value="Mantenimiento Preventivo">Mantenimiento Preventivo</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
    
                            <Form.Item label="Revisiones" name="revisiones">
                                <Checkbox.Group>
                                    <Row>
                                        <Col><Checkbox value="Motherboard">Motherboard</Checkbox></Col>
                                        <Col><Checkbox value="Procesador">Procesador</Checkbox></Col>
                                        <Col><Checkbox value="TarjetaGrafica">Tarjeta Gráfica</Checkbox></Col>
                                        <Col><Checkbox value="MemoriaRAM">Memoria RAM</Checkbox></Col>
                                        <Col><Checkbox value="Almacenamiento">Almacenamiento</Checkbox></Col>
                                        <Col><Checkbox value="MonitoryPantalla">Monitor/Pantalla</Checkbox></Col>
                                        <Col><Checkbox value="FuentedePoderyBateria">Fuente de Poder y Batería</Checkbox></Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
    
                            <Form.Item label="Problemas" name="problemas">
                                <Input.TextArea placeholder="Describe the problems..." />
                            </Form.Item>
    
                            <Button block type="primary" htmlType="submit">
                                Register Equipment
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        );
    }

    
    if (selectedKey === '3') {
        return (
            <div className="search-client-form-container">
                <Form layout="vertical" name="searchClientForm" form={form}> {/* Elimina el onFinish aquí */}
                    <Typography.Title level={3} align="center" strong className="search-client-title">
                        Search Client
                    </Typography.Title>
    
                    <Row gutter={16}>
                        <Col xs={24}>
                            <Form.Item label="Buscar por Cédula" name="searchCedula">
                                <Input 
                                    placeholder="Enter cedula"
                                    value={searchCedula}
                                    onChange={(e) => setSearchCedula(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
    
                    <Form.Item>
                        <Button 
                            block 
                            type="primary" 
                            onClick={handleSearch}  /* Llamas a handleSearch al hacer clic */
                            style={{ marginBottom: '1rem' }}
                        >
                            Buscar Cliente
                        </Button>
                    </Form.Item>
    
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
    
                            {mostrarBotonRegistrar && (
                                <Form.Item>
                                    <Button block type="default" onClick={() => setShowEquipmentRegistration(true)} style={{ marginTop: '1rem' }}>
                                        Registrar Equipo
                                    </Button>
                                </Form.Item>
                            )}
                        </>
                    )}
    
                    <Form.Item>
                        <Button block type="default" onClick={handleClean} style={{ marginTop: '1rem' }}>
                            Clean
                        </Button>
                    </Form.Item>
                </Form>
    
                {showEquipmentRegistration && (
                    <div className="equipment-registration">
                        <Typography.Title level={4} align="center" strong>
                            Register Equipment
                        </Typography.Title>
                        <Form layout="vertical" name="equipmentForm" form={equipmentForm} onFinish={onFinishEquipment}>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Marca" name="marca" rules={[{ required: true, message: "Please input the equipment brand!" }]}>
                                        <Input placeholder="Enter brand" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Modelo" name="modelo" rules={[{ required: true, message: "Please input the equipment model!" }]}>
                                        <Input placeholder="Enter model" />
                                    </Form.Item>
                                </Col>
                            </Row>
    
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Fecha de Compra" name="fechaCompra" rules={[{ required: true, message: "Please input the purchase date!" }]}>
                                        <Input placeholder="Enter purchase date" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item label="Tipo de Mantenimiento" name="tipoMantenimiento" rules={[{ required: true, message: "Please select a maintenance type!" }]}>
                                        <Radio.Group>
                                            <Radio value="Mantenimiento Correctivo">Mantenimiento Correctivo</Radio>
                                            <Radio value="Mantenimiento Preventivo">Mantenimiento Preventivo</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
    
                            <Form.Item label="Revisiones" name="revisiones">
                                <Checkbox.Group>
                                    <Row>
                                        <Col><Checkbox value="Motherboard">Motherboard</Checkbox></Col>
                                        <Col><Checkbox value="Procesador">Procesador</Checkbox></Col>
                                        <Col><Checkbox value="TarjetaGrafica">Tarjeta Gráfica</Checkbox></Col>
                                        <Col><Checkbox value="MemoriaRAM">Memoria RAM</Checkbox></Col>
                                        <Col><Checkbox value="Almacenamiento">Almacenamiento</Checkbox></Col>
                                        <Col><Checkbox value="MonitoryPantalla">Monitor/Pantalla</Checkbox></Col>
                                        <Col><Checkbox value="FuentedePoderyBateria">Fuente de Poder y Batería</Checkbox></Col>
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
    
                            <Form.Item label="Problemas" name="problemas">
                                <Input.TextArea placeholder="Describe the problems..." />
                            </Form.Item>
    
                            <Form.Item>
                                <Button block type="primary" htmlType="submit">
                                    Register Equipment
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
        );
    }
    

    const renderContent = () => {
        switch (selectedKey) {
            case '4':
                return (
                    <div>
                        <h3>Equipos Asignados</h3>
                        {/* Renderizado de equipos asignados */}
                        {equipos.map(equipo => (
                            <Button
                                key={equipo.ID_Equipo}
                                type="primary"
                                style={{ margin: '0.5rem' }}
                                onClick={() => handleEditEquipo(equipo)}
                            >
                                {`${equipo.Marca} - ${equipo.Modelo}`}
                            </Button>
                        ))}
                        {/* Modal de edición */}
                        <Modal
                            title={`${selectedEquipo?.Marca} - ${selectedEquipo?.Modelo}`}
                            open={isModalVisible}
                            onCancel={handleCancelModal}
                            footer={[
                                <Button key="back" onClick={handleCancelModal}>
                                    Cancelar
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleFinishEquipo}>
                                    Finalizar
                                </Button>
                            ]}
                        >
                            <Form form={form} layout="vertical" initialValues={{ problemas: selectedEquipo?.Problemas }}>
                                <Form.Item name="problemas" label="Problemas">
                                    <Input.TextArea rows={4} disabled={selectedKey === '5'} />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                );
                case '5':
                    return (
                        <div>
                            <h3>Historial de Equipos Revisados o Finalizados</h3>
                            {/* Renderizado de historial de equipos */}
                            {equipos.filter(equipo => equipo.Estado === 'Finalizado' || equipo.Estado === 'Revisado').map(equipo => (
                                <Button
                                    key={equipo.ID_Equipo}
                                    type="primary"
                                    style={{ margin: '0.5rem' }}
                                    onClick={() => handleEditEquipo(equipo)}
                                >
                                    {`${equipo.Marca} - ${equipo.Modelo}`}
                                </Button>
                            ))}
                        </div>
                    );
                
            default:
                return <div className="default-content">Regresaste al Dashboard</div>;
        }
    };
    
    return <>{renderContent()}</>;
    
};

MainContent.propTypes = {
    selectedKey: PropTypes.string.isRequired,
    tecnicoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default MainContent;