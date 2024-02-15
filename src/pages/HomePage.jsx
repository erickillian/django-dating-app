// homepage.jsx
import React from 'react';

function Header() {
    return (
        <header>
            <h1>Test Dating Site</h1>
        </header>
    );
}

function MainContent() {
    return (
        <main>
            <section>
                <h2>About</h2>
                <p>This is a simple GUI in react to test the functionality of this simple dating site</p>
            </section>
            <a href='/login'>Login Here</a>
            {/* Additional sections can be added here */}
        </main>
    );
}

function Footer() {
    return (
        <footer>
            <p>&copy;{new Date().getFullYear()} Django-Dating-App</p>
        </footer>
    );
}

function HomePage() {
    return (
        <div>
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
}

export default HomePage;
