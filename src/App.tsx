import React from 'react'
import BottomNav from './components/layout/BottomNav';

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <main className="flex-grow px-4">
                {/* Your main content will go here */}
            </main>
            <BottomNav />
        </div>
    )
}

export default App