import { Avatar, Button, Flex, List, Typography } from "antd";

const data = [
    {
        name: 'Ed Brown',
        ordertime: '1',
        
    },
    {
        name: 'John Brown',
        ordertime: '2',
        
    },

     {
        name: 'Joe Black',  
        ordertime: '3',
        
    },
    {
        name: 'Jim Green',  
        ordertime: '4',
        
    },
    {
        name: 'Jim Red',  
        ordertime: '5',
        
    },
];

const Activity = () => {
    return (
        <Flex vertical gap='small'>
            <Flex align="center" justify="space-between" gap='large'>
                <Typography.Title level={3} strong className='primary--color'>
                        Recent Activity
                    </Typography.Title>
                    <Button type='link' className='gray--color'>
                        View All
                    </Button>    
            </Flex>      

            <List 
                pagination 
                dataSource={data} 
                renderItem = {(user, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                                />
                            }
                            title={<a href="#">{user.name}</a>}
                            description="Nuevo Mantenimiento a Equipo"
                        ></List.Item.Meta>
                        <span className="gray--color">
                            {user.ordertime} {user.ordertime == 1 ? 'day ago' : 'days ago'}
                        </span>
                    </List.Item>
                )}
            />               
        </Flex>
    );
};

export default Activity;