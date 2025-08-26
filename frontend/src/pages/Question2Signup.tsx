import { useNavigate } from "react-router";
import { backendUrl } from "../config/constants";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function Question2Signup() {
  const navigate = useNavigate();
  const tokenString = localStorage.getItem("token");

  if (tokenString) {
    const token = JSON.parse(tokenString);
    checkAuth(token);
  }

  async function checkAuth(token: string) {
    try {
      const res = await fetch(backendUrl + "/question2/checkauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        navigate("/question2/share");
      } else {
        const error = await res.json();
        console.error("Frontend check auth error:", error);
      }
    } catch (error) {
      console.error("Frontend check auth error:", error);
    }
  }

  const validateInput = (e: any) => {
    const username = e.target.elements["username"].value;
    const password = e.target.elements["password"].value;
    const confirmPassword = e.target.elements["confirmPassword"].value;

    const error = (message: string) => {
      enqueueSnackbar(message, { variant: "error" });
      return false;
    };

    if (!username) return error("Username is required");
    if (!password) return error("Password is required");
    if (password.length < 8)
      return error("Password must be minimum 8 characters long");
    if (!password.match(/\d/))
      return error("Password must include atleast one number");
    if (!password.match(/[a-zA-Z]/))
      return error("Password must include atleast one letter");
    if (!confirmPassword) return error("Confirm password is required");
    if (confirmPassword !== password)
      return error("Confirm password must match passsword");

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateInput(e)) return;

    try {
      const { username, password } = e.target.elements;
      const res = await fetch(backendUrl + "/question2/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
      if (res.ok) {
        const data = await res.json();

        if (res.status === 209)
          return enqueueSnackbar(data.message, { variant: "warning" });

        localStorage.setItem("token", JSON.stringify(data.data.token));
        navigate("/question2/share");
      } else {
        const error = await res.json();
        console.error("Frontend error signing in:", error);
      }
    } catch (error) {
      console.error("Frontend error signing in:", error);
    }
  };

  return (
    <div
      style={{
        margin: "40px auto",
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        background: "white",
        gap: "20px",
        padding: "20px 40px",
      }}
    >
      <h1>Sign Up</h1>

      <form
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        onSubmit={handleSubmit}
      >
        <fieldset style={{ padding: "0px" }}>
          <legend>Username</legend>
          <input
            type="text"
            style={{
              outline: "none",
              border: "none",
              width: "100%",
              padding: "7px",
              background: "transparent",
            }}
            name="username"
          />
        </fieldset>

        <div>
          <fieldset style={{ padding: "0px" }}>
            <legend>Password</legend>
            <input
              type="password"
              style={{
                outline: "none",
                border: "none",
                width: "100%",
                padding: "7px",
                background: "transparent",
              }}
              name="password"
            />
          </fieldset>
          <span>Minimum 8 letters including one letter and one number</span>
        </div>

        <fieldset style={{ padding: "0px" }}>
          <legend>Confirm Password</legend>
          <input
            type="password"
            style={{
              outline: "none",
              border: "none",
              width: "100%",
              padding: "7px",
              background: "transparent",
            }}
            name="confirmPassword"
          />
        </fieldset>
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            color: "white",
            fontWeight: "600",
            backgroundColor: "var(--accent)",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
      </form>
      <p>
        Already Registered?{" "}
        <button
          style={{
            color: "var(--accent)",
            border: "none",
            background: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/question2/signin")}
        >
          Sign In
        </button>
      </p>
      <SnackbarProvider
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        maxSnack={1}
      />
    </div>
  );
}
