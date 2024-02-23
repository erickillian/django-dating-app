import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches } from '../actions/datingActions';
import { List, Typography, Avatar, Row, Col, Empty, Spin } from 'antd';
import MatchComponent from '../components/MatchComponent';
import "./MatchesPage.css";

const MatchesPage = () => {
    const dispatch = useDispatch();
    const matches = useSelector(state => state.dating.matches);

    useEffect(() => {
        dispatch(getMatches());
    }, [dispatch]);

    if (matches === null) {
        return <Spin tip="Loading matches..." />;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {matches.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={matches}
                    renderItem={match => (
                        <List.Item>
                            <MatchComponent match={match} />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="No matches yet." />
            )}
        </div>
    );
};

export default MatchesPage;
