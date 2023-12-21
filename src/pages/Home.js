import React from 'react';
import Navigation from '../components/Navigation';
import Logo from '../components/Logo';

const Home = () => {
    return (
        <div>
            <Logo />
            <Navigation />
            <form >
                <input
                    type="text"
                    placeholder="Entrez quelque chose..."
                />
                <button type="submit" className="submit-button">Envoyer</button>
            </form>
        </div>
    );
};

export default Home;