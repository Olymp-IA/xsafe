import { SceneProvider } from './context';
import { SceneController, Header } from './components';
import { OlympiaFooter } from './components/footer/OlympiaFooter';
import { Routes, Route } from 'react-router-dom';
import Equipment from './pages/Equipment';
import Garage from './pages/Garage';
import Contact from './pages/Contact';
import './App.css';

/**
 * X-SAFE Ecommerce App
 * 
 * Main application component that wraps everything
 * in the SceneProvider context
 */
function App() {
  return (
    <SceneProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<SceneController />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div className="footer-container" style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 10 }}>
          <OlympiaFooter variant="full" />
        </div>
      </div>
    </SceneProvider>
  );
}

export default App;
