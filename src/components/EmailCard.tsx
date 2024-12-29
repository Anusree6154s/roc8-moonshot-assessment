import React from "react";

export default function EmailCard(props: any) {
  const { email, handleOpen, date, time, name } = props;
  
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
          <span className="email-card-content-bold">{email.subject}</span>
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
}
