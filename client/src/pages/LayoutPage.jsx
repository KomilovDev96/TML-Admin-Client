import { Link, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/photo_2025-03-18_12-14-35.jpg'
import React from 'react';
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
const { Header, Content, Footer, Sider } = Layout;

const LayoutPage = () => {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    const navigate = useNavigate();
    const handleLogout = () => {
        toast.success('Выход выполнен!');
        // 2. Через 1 секунду:
        setTimeout(() => {
            localStorage.removeItem('token'); // Удаляем токен
            navigate('/login'); // Редирект
        }, 1000); // 1000 мс = 1 секунда
    }



    const generateSiderLink = (label, path) => {
        return <>{label}<Link to={path} /></>

    }
    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const UserItems = [
        getItem('Games', '1', <PieChartOutlined />, [
            {
                label: generateSiderLink('List games', '/games'),
                key: "2"
            },
            {
                label: generateSiderLink('List games', '/games'),
                key: "3"
            },
            {
                label: generateSiderLink('Информация о транзакции выплат', '/admin/info'),
                key: "4"
            },
        ]),
        getItem('Users', 'sub', <PieChartOutlined />, [
            {
                label: generateSiderLink('Lists users', '/users'),
                key: "5"
            },
            {
                label: generateSiderLink('Exel Export users', '/users/exl'),
                key: "6"
            },
            {
                label: generateSiderLink('Информация о транзакции выплат', '/admin/info'),
                key: "7"
            },
        ]),
        getItem('Cheks', 'pirce', <PieChartOutlined />, [
            {
                label: generateSiderLink('Cheks', '/admin/create'),
                key: "8"
            },
            {
                label: generateSiderLink('Получить истории выплат за заданный период', '/admin/pay'),
                key: "9"
            },
            {
                label: generateSiderLink('Информация о транзакции выплат', '/admin/info'),
                key: "10"
            },
        ]),
        getItem('Notifications', 'notifika', <PieChartOutlined />, [
            {
                label: generateSiderLink('Cheks', '/admin/create'),
                key: "11"
            },
            {
                label: generateSiderLink('Получить истории выплат за заданный период', '/admin/pay'),
                key: "12"
            },
            {
                label: generateSiderLink('Информация о транзакции выплат', '/admin/info'),
                key: "13"
            },
        ]),
        getItem('Settings', 'setigns', <PieChartOutlined />, [
            {
                label: generateSiderLink('Cheks', '/admin/create'),
                key: "14"
            },
            {
                label: generateSiderLink('Получить истории выплат за заданный период', '/admin/pay'),
                key: "15"
            },
        ]),
    ]
    return (
        <Layout>
            <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link to={"/"} style={{ height: " 50px" }}>
                    <img style={{ maxWidth: "50px", height: "50px", borderRadius: "50%" }} src={logo} alt='png' />
                </Link>
                <div>
                    <Button >
                        <Link to={"/"}>
                            Главная страница
                        </Link>
                    </Button>
                </div>
                <Button onClick={handleLogout}>
                    Выход
                </Button>
            </Header>
            <div style={{ padding: '0' }}>

                <Layout
                    style={{ padding: '0', background: colorBgContainer, borderRadius: borderRadiusLG }}
                >

                    <Sider width={200} style={{ background: colorBgContainer }}>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                            items={UserItems}
                        />
                    </Sider>
                    <Content style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 800,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}>
                        <Outlet />
                    </Content>
                </Layout>
            </div>
            <Footer style={{ textAlign: 'center', padding: "10px" }}>
                {new Date().getFullYear()} Created by  <a href="https://t.me/fructik">Komilov96</a>
            </Footer>
            <ToastContainer />
        </Layout>
    );
};
export default LayoutPage