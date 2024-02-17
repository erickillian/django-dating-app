import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMatches } from '../actions/datingActions';
import UserProfileDisplay from '../components/UserProfileDisplay';

const MatchesPage = () => {
    const dispatch = useDispatch();
    const matches = useSelector(state => state.dating.matches);

    useEffect(() => {
        dispatch(getMatches());
    }, [dispatch]);

    return (
        <div>
            <h1>My Matches</h1>
            {matches && matches.map((match, index) => (
                <UserProfileDisplay user={match.other_user} key={index} />
            ))}
            {matches && matches.length === 0 && (
                <p>No matches yet.</p>
            )}
        </div>
    );
};

export default MatchesPage;
