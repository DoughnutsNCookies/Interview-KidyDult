import { useEffect, useState } from 'react'

function Home() {
  return (
    <main>
      <MyComponent/>
    </main>
  )
}

export default Home;

const MyComponent = () => {
  const [data, setData] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000');
        const jsonData = await response.json();
        setData(jsonData.string);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      {data}
    </div>
  );
};