type TestProps = {
  title: string;
  count: number;
  status?: 'idle' | 'loading' | 'success';
  onIncrement: (value: number) => void;
};

const Test = ({ title, count, status = 'idle', onIncrement }: TestProps) => {
  const handleClick = () => {
    onIncrement(count + 1);
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <p>Status: {status}</p>

      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default Test;
