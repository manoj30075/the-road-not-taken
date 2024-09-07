import React from 'react';
import Home from './pages/Home';
import InfoPopup from './components/InfoPopup';

function App() {
    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <main className="container mx-auto px-4 py-8">
                <Home />
            </main>
            <InfoPopup />
        </div>
    )
}

export default App;