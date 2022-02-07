import { useEffect } from 'react';
import './App.css';
import Sketch from './script'

function App() {

  useEffect(() => {
    new Sketch()
  }, [])

  return (
    <div className="App">
       
    </div>
  );
}

export default App;
