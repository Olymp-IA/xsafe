import { SceneProvider } from './context';
import { SceneController, Header, Footer } from './components';
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
        <SceneController />
        <Footer />
      </div>
    </SceneProvider>
  );
}

export default App;
