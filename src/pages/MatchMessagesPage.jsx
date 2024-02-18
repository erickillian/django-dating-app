import React from 'react';
import { useParams } from 'react-router-dom';

const MatchMessagesPage = () => {
    const { match_id } = useParams(); // Extracting matchId from the URL

    return (
        <div>
            <h1>Match Messages {match_id}</h1>
            {/* Add your match messages UI here */}
        </div>
    );
};

export default MatchMessagesPage;
