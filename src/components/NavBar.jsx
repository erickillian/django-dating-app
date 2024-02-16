import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ children }) => {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/discover">Discover</Link></li>
                    <li><Link to="/likes">Likes</Link></li>
                    <li><Link to="/matches">Matches</Link></li>
                    <li><Link to="/profile">My Profile</Link></li>
                    <li><Link to="/edit">Edit Profile</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Navbar;