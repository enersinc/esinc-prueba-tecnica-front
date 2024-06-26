import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App" style={{ margin: "10vh 20vw" }}>
      {/* <HomePage /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/search" element={<Search />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
