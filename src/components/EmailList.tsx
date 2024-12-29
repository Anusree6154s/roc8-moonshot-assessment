export default function EmailList({
  setSelectedEmailId,
  data,
}: {
  setSelectedEmailId: any;
  data: Array<number>;
}) {
  console.log(data);
  return (
    <section id="email-list" className="EmailList">
      {data.length > 0 &&
        data.map((email) => (
          <div className="email-card">
            {email}
            {/* <div className="img">{email.from.name[0]}</div>
            <div>
                <p>From: <span>{email.from.name} {}</span></p>
            </div> */}
          </div>
        ))}
    </section>
  );
}
