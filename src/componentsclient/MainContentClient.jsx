import { Flex } from "antd";
import BannerClient from "./BannerClient";


const MainContentClient = () => {
    return (
        <div style={{flex: 1}}>
            <Flex vertical gap='2.3rem'>
                <BannerClient/>
            </Flex>
            
        </div>
    );
};

export default MainContentClient;