import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './AuthenticatedLayout.css';
import { useLocation } from 'react-router-dom';
import NotificationComponent from '../components/NotificationComponent';

const { Header, Content, Footer } = Layout;

const AuthenticatedLayout = ({ children }) => {
    const location = useLocation();

    // Define menu items
    const menuItems = [
        { label: <Link to="/discover">Discover</Link>, key: 'discover' },
        { label: <Link to="/likes">Likes</Link>, key: 'likes' },
        { label: <Link to="/matches">Matches</Link>, key: 'matches' },
        { label: <Link to="/profile">My Profile</Link>, key: 'profile' },
        { label: <Link to="/edit">Edit Profile</Link>, key: 'edit' },
        { label: <Link to="/logout">Logout</Link>, key: 'logout' },
    ];

    return (
        <Layout className="layout">
            <NotificationComponent />
            <Header className="header">
                <div className="logo" /> {/* Add your logo or branding here */}
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location.pathname.split("/")[1]]} items={menuItems} />
            </Header>
            <Content style={{ flex: '1 0 auto' }} className="content">
                <div className="site-layout-content">
                    {children}
                </div>
            </Content>
            <Footer>
                django-dating-app ©{new Date().getFullYear()}
            </Footer>
        </Layout>
    );
};

export default AuthenticatedLayout;
