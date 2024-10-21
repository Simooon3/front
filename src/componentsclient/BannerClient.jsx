import { Button, Card, Flex, Typography } from 'antd';

const BannerClient = () => {
    return (
        <Card style={{height: 260, padding: '20px'}}>
            <Flex vertical gap='30px'>
                <Flex vertical align='flex-start'>
                <Typography.Title level={2} strong>
                    Hazle mantenimiento a tus productos
                </Typography.Title>
                <Typography.Text type='secondary' strong>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorum reprehenderit at temporibus nesciunt a itaque voluptate ipsa, voluptas accusantium nulla odio quidem minima officia dolorem, ex cupiditate, 
                    expedita exercitationem! Eius?
                </Typography.Text>
                </Flex>

                <Flex gap='large'>
                   <Button type='primary' size='large'>
                    Explore Mores
                   </Button>
                   <Button size='large'>Top Sellers</Button>
               </Flex>
            </Flex>
        </Card>
    );
};

export default BannerClient;