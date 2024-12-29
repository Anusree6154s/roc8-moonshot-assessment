import { useEffect, useState } from "react";
import { fetchData } from "./api/email-api";
import EmailBody from "./components/EmailBody";
import EmailList from "./components/EmailList";
import Header from "./components/Header";
import "./styles/App.css";

function App() {
  const [selectedEmailId, setSelectedEmailId] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      const emailData = await fetchData();
      setData(emailData.list);
      // console.log(emailData);
    };

    fetchEmails();
  }, []);

  return (
    <div className="App">
      <Header />
      <main className="Content">
        <EmailList setSelectedEmailId={setSelectedEmailId} data={data} />
        <EmailBody selectedEmailId={selectedEmailId} />
      </main>
    </div>
  );
}

export default App;
