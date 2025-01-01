import { useEffect, useState } from "react";
import "../../styles/question1/EmailList.css";

export default function EmailList(props: any) {
  const { setSelectedEmail, data, setData, filter } = props;
  const [page, setPage] = useState({ number: 1, start: 0, end: 10 });

  const handleNextPage = () => {
    setPage({ number: 2, start: 11, end: data.length });
  };

  const handlePrevPage = () => {
    setPage({ number: 1, start: 0, end: 10 });
  };

  useEffect(() => {
    const localStorageDataString: string = localStorage.getItem("data") ?? "[]";
    const localStorageData: Array<any> = JSON.parse(localStorageDataString);
    setData(localStorageData);
  }, [setData]);

  const handleOpen = (emailBodyData: any) => {
    setSelectedEmail(emailBodyData);
    const localStorageDataString: string = localStorage.getItem("data") ?? "[]";
    const localStorageData: Array<any> = JSON.parse(localStorageDataString);
    const updatedData = localStorageData.map((item) => {
      if (item.id === emailBodyData.id) {
        return { ...item, read: true };
      }
      return item;
    });
    localStorage.setItem("data", JSON.stringify(updatedData));
    setData(updatedData);
  };

  return (
    <section id="email-list" className="EmailList">
      <div className="top-section">
        {data?.length > 0 &&
          data.slice(page.start, page.end).map((email: any) => {
            const emailDate = email.date;

            const day = new Date(emailDate)
              .getDate()
              .toString()
              .padStart(2, "0");
            const month = new Date(emailDate)
              .getMonth()
              .toString()
              .padStart(2, "0");
            const year = new Date(emailDate)
              .getFullYear()
              .toString()
              .padStart(2, "0");
            const date = `${day}/${month}/${year}`;

            const time = new Date(emailDate)
              .toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .toLowerCase()
              .split(" ")
              .join("");

            const name =
              email.from.name[0].toUpperCase() +
              email.from.name.slice(1, email.from.name.length);

            let displayStyle = "";
            if (filter.unread)
              displayStyle = `${email.read === false ? "flex" : "none"}`;
            if (filter.read)
              displayStyle = `${email.read === true ? "flex" : "none"}`;
            if (filter.favorite)
              displayStyle = `${email.favorite === true ? "flex" : "none"}`;

            return (
              <article
                className={`email-card ${
                  email.read ? "email-card-read" : "email-card-unread"
                }`}
                key={email.id}
                onClick={() =>
                  handleOpen({
                    id: email.id,
                    initial: email.from.name[0].toUpperCase(),
                    subject: email.subject,
                    date,
                    time,
                  })
                }
                style={{ display: displayStyle }}
              >
                <figure className="img">
                  {email.from.name[0].toUpperCase()}
                </figure>
                <div className="email-card-content">
                  <p>
                    From:{" "}
                    <span className="email-card-content-bold">
                      {name} {`<${email.from.email}>`}
                    </span>
                  </p>
                  <p>
                    Subject:{" "}
                    <span className="email-card-content-bold">
                      {email.subject}
                    </span>
                  </p>
                  <p>{email.short_description}</p>
                  <p>
                    <span>
                      {date} {time}
                    </span>
                    <span className="email-card-content-favorite">
                      {email.favorite && "Favorite"}
                    </span>
                  </p>
                </div>
              </article>
            );
          })}
      </div>

      <nav className="pagination">
        <button onClick={handlePrevPage}>{"<"}</button>
        <span
          className={page.number === 1 ? "pagination-clicked" : ""}
          onClick={() => setPage({ number: 1, start: 0, end: 10 })}
        >
          1
        </span>
        <span
          className={page.number === 2 ? "pagination-clicked" : ""}
          onClick={() => setPage({ number: 2, start: 11, end: data.length })}
        >
          2
        </span>
        <button onClick={handleNextPage}>{">"}</button>
      </nav>
    </section>
  );
}
