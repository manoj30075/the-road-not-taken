import Home from './pages/Home';

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <main className="flex-grow px-4">
                <Home />
            </main>
            {/*<BottomNav />*/}
        </div>
    )
}

export default App