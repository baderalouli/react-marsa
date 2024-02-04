import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className="Navigation">
            <ul>
                <NavLink to="/"  >
                    <li>Acceuill</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation;