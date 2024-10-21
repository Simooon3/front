import { Button, Flex, Layout } from 'antd';
import { useState } from 'react';
import SidebarClient from '../../componentsclient/SidebarClient'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import CustomHeaderClient from '../../componentsclient/HeaderClient'
import './Dashboardcliente.css'
import MainContentClient from '../../componentsclient/MainContentClient';
import SideContentClient from '../../componentsclient/SideContentClient';

const { Sider, Header, Content } = Layout

const DashboardCliente = () => {

    const [collapsed, setCollapsed] = useState(false)

    return (
        <Layout>
            <Sider theme='light' trigger={null} collapsible collapsed={collapsed} className='sider'>
                <SidebarClient/>

                <Button type='text' icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/>} onClick={() => setCollapsed(!collapsed)} className="triger-btn"/>
            </Sider>

            <Layout>
                <Header className='header'>
                    <CustomHeaderClient></CustomHeaderClient>
                </Header>
                <Content className='content'>
                    <Flex gap="large">
                        <MainContentClient/>
                        <SideContentClient/>
                    </Flex>
                </Content>
            </Layout>
        </Layout>
        
    );
};

export default DashboardCliente;