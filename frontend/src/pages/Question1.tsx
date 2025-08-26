import { useEffect, useState } from "react";
import { fetchData } from "../api/email-api";
import EmailBody from "../components/question1/EmailBody";
import EmailList from "../components/question1/EmailList";
import Header from "../components/question1/Header";
import "../styles/question1/Question1.css";

function Question1() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [data, setData] = useState<Array<any>>([]);
  const [filter, setFilter] = useState({
    unread: false,
    read: false,
    favorite: false,
  });

  useEffect(() => {
    const localStorageDataString: string | null = localStorage.getItem("data");

    if (localStorageDataString) {
      setData(JSON.parse(localStorageDataString));
    } else {
      const fetchEmails = async () => {
        const emailData = await fetchData();
        const data = emailData.list.map((email: any) => ({
          read: false,
          favorite: false,
          ...email,
        }));
        localStorage.setItem("data", JSON.stringify(data));
        setData(emailData.list);
      };

      fetchEmails();
    }
  }, []);

  return (
    <div className="question1">
      <Header
        filter={filter}
        setFilter={setFilter}
        setSelectedEmail={setSelectedEmail}
      />
      <main
        className="Content"
        style={{ display: selectedEmail !== null ? "flex" : "block" }}
      >
        <EmailList
          setSelectedEmail={setSelectedEmail}
          setData={setData}
          data={data}
          filter={filter}
        />
        <EmailBody selectedEmail={selectedEmail} setData={setData} />
      </main>
    </div>
  );
}

export default Question1;
