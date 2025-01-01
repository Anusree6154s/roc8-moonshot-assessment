import { useNavigate } from "react-router";
import { backendUrl } from "../config/constants";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function Question2Signin() {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const { username, password } = e.target.elements;

      const res = await fetch(backendUrl + "/question2/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", JSON.stringify(data.data.token));
        navigate("/question2/share");
      } else {
        const error = await res.json();
        if (res.status !== 500) {
          enqueueSnackbar(error.message, { variant: "error" });
        }
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
      <h1>Sign In</h1>

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
          Sign in
        </button>
      </form>
      <p>
        Not Registered?{" "}
        <button
          style={{
            color: "var(--accent)",
            border: "none",
            background: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/question2/signup")}
        >
          Sign Up
        </button>
      </p>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
}
