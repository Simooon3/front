import { Card, Flex, Image, Typography } from 'antd';

const ContentSidebar = () => {
    return (
        <div>
            <Card className='card'>
                <Flex vertical gap='large'>
                    <Typography.Title level={4} strong>
                        Today <br />5 orders
                    </Typography.Title>
                    <Typography.Title level={4} strong>
                        This Month <br />
                        240 orders
                    </Typography.Title>
                </Flex>
                <Image 
                    // Insertar imagen de computadores o mantenimiento 
                />
            </Card>
        </div>
        
    );
};

export default ContentSidebar;