import "../../styles/question1/Header.css";

export default function Header(props: any) {
  const { filter, setFilter, setSelectedEmail } = props;
  return (
    <header>
      Filter By:
      <span
        className={filter.unread ? "header-clicked" : ""}
        onClick={() => {
          setFilter((prev: any) => ({
            read: false,
            favorite: false,
            unread: !prev.unread,
          }));
          setSelectedEmail(null);
        }}
      >
        Unread
      </span>
      <span
        className={filter.read ? "header-clicked" : ""}
        onClick={() => {
          setFilter((prev: any) => ({
            unread: false,
            favorite: false,
            read: !prev.read,
          }));
          setSelectedEmail(null);
        }}
      >
        Read
      </span>
      <span
        className={filter.favorite ? "header-clicked" : ""}
        onClick={() => {
          setFilter((prev: any) => ({
            read: false,
            unread: false,
            favorite: !prev.favorite,
          }));
          setSelectedEmail(null);
        }}
      >
        Favourites
      </span>
    </header>
  );
}
