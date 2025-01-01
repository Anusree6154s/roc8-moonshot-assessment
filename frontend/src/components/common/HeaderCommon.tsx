import { useEffect, useState } from "react";
import "../../styles/common/HeaderCommon.css";
import { useLocation, useNavigate } from "react-router";


export default function HeaderCommon() {
  const [currQuesNum, setCurrQuesNum] = useState(1);
  const navigate = useNavigate();

  const location = useLocation();

  // Set the current question number based on the URL
  useEffect(() => {
    if (location.pathname === "/question1") {
      setCurrQuesNum(1);
    } else if (location.pathname === "/question2") {
      setCurrQuesNum(2);
    }
  }, [location.pathname]);

  return (
    <header className="header-common">
      <div
        className={currQuesNum === 1 ? "active" : ""}
        onClick={() => {
          setCurrQuesNum(1);
          navigate("/question1");
        }}
      >
        Question1
      </div>
      <div
        className={currQuesNum === 2 ? "active" : ""}
        onClick={() => {
          setCurrQuesNum(2);
          navigate("/question2");
        }}
      >
        Question2
      </div>
    </header>
  );
}
