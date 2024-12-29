import { useEffect } from "react";
import "../styles/EmailList.css";

export default function EmailList(props: any) {
  const { setSelectedEmail, data, setData, filter } = props;

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
    console.log(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
    setData(updatedData);
  };

  return (
    <section id="email-list" className="EmailList">
      {data?.length > 0 &&
        data.map((email: any) => {
          const emailDate = email.date;

          const day = new Date(emailDate).getDate().toString().padStart(2, "0");
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

          console.log(displayStyle)
          return (
            <div
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
              <span className="img">{email.from.name[0].toUpperCase()}</span>
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
            </div>
          );
        })}
    </section>
  );
}
