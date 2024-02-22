import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Carousel, Typography, Button } from 'antd';
import { DribbbleOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

// Placeholder images
const carouselImages = [
    '/homepage.jpg', // Replace with your image URLs
    '/homepage.jpg',
    '/homepage.jpg',
];

const HomePage = () => {
    return (
        <Layout className="layout-default">
            <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' }}>
                <div className="header-brand">
                    <h5>Django-Dating-App</h5>
                </div>
                <Menu mode="horizontal" defaultSelectedKeys={['1']} style={{ borderBottom: 'none' }}>
                    <Menu.Item key="1">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                </Menu>
                <Link to="/login"><Button type="primary">Login</Button></Link>
            </Header>
            <Content style={{ padding: '50px', textAlign: 'center' }}>
                <div style={{ marginTop: '20px' }}>
                    <Title>Find Your Match</Title>
                    <p>Discover love and happiness with this dating app</p>
                </div>
            </Content>
        </Layout>
    );
};

export default HomePage;
