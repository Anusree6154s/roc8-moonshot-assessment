import { useEffect, useState } from "react";
import "../styles/EmailBody.css";

export default function EmailBody({
  selectedEmail,
  setData,
}: {
  selectedEmail: any;
  setData: any;
}) {
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
          <span className="img">{selectedEmail.initial}</span>
          <div className="email-body-content">
            <div className="email-body-header">
              <div>
                <p className="email-body-title">{selectedEmail.subject}</p>
                <p>
                  {selectedEmail.date} {selectedEmail.time}
                </p>
              </div>
              <span
                className="favorite-button"
                onClick={handleFavorite}
              >
                Mark as favorite
              </span>
            </div>
            {emailBody !== null && (
              <div
                dangerouslySetInnerHTML={{ __html: emailBody }}
                className="email-body-text"
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
