import { useState } from 'react';
import './App.css';
import Test from './components/Test';

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <h1>Hello World</h1>

      <Test
        title="Strict typing check"
        count={count}
        status="loading"
        onIncrement={(value) => setCount(value)}
      />
    </>
  );
}

export default App;
