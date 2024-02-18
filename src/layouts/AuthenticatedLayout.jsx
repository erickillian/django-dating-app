import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './AuthenticatedLayout.css'; // Make sure to include your custom styles if needed

const { Header, Content, Footer } = Layout;

const AuthenticatedLayout = ({ children }) => {
    return (
        <Layout className="layout">
            <Header>
                <div className="logo" /> {/* Add your logo or branding here */}
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1"><Link to="/discover">Discover</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/likes">Likes</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/matches">Matches</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/profile">My Profile</Link></Menu.Item>
                    <Menu.Item key="5"><Link to="/edit">Edit Profile</Link></Menu.Item>
                    <Menu.Item key="6"><Link to="/logout">Logout</Link></Menu.Item>
                </Menu>
            </Header>
            <Content>
                <div className="site-layout-content">
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                django-dating-app ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default AuthenticatedLayout;
