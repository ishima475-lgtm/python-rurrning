import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data: { message: string }) => setMessage(data.message))
      .catch(() => setMessage("failed to reach backend"));
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>python-rurrning</h1>
      <p>Backend says: {message}</p>
    </main>
  );
}

export default App;
