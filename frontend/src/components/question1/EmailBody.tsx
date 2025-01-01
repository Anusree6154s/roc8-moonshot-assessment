import { useEffect, useState } from "react";
import "../../styles/question1/EmailBody.css";

export default function EmailBody(props: any) {
  const { selectedEmail, setData } = props;
  const [emailBody, setEmailBody] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async (id: number) => {
      try {
        const res = await fetch("https://flipkart-email-mock.now.sh/?id=" + id);
        const email = await res.json();
        setEmailBody(email.body);
      } catch (error) {
        console.error("Error fetching email body", error);
      }
    };

    if (selectedEmail) fetchEmail(selectedEmail.id);
  }, [selectedEmail]);

  const handleFavorite = () => {
    const localStorageDataString: string = localStorage.getItem("data") ?? "[]";
    const localStorageData: Array<any> = JSON.parse(localStorageDataString);
    const updatedData = localStorageData.map((item) => {
      if (item.id === selectedEmail.id) {
        return { ...item, favorite: true };
      }
      return item;
    });
    localStorage.setItem("data", JSON.stringify(updatedData));
    setData(updatedData);
  };

  return (
    <>
      {selectedEmail !== null && (
        <section className="email-body">
          <figure className="img">{selectedEmail.initial}</figure>
          <article className="email-body-content">
            <header className="email-body-header">
              <div>
                <h1 className="email-body-title">{selectedEmail.subject}</h1>
                <time dateTime={`${selectedEmail.date}T${selectedEmail.time}`}>
                  {selectedEmail.date} {selectedEmail.time}
                </time>
              </div>
              <button className="favorite-button" onClick={handleFavorite}>
                Mark as favorite
              </button>
            </header>
            {emailBody !== null && (
              <section
                dangerouslySetInnerHTML={{ __html: emailBody }}
                className="email-body-text"
              />
            )}
          </article>
        </section>
      )}
    </>
  );
}
