import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import Question1 from "./pages/Question1";
import Question2 from "./pages/Question2";
import HeaderCommon from "./components/common/HeaderCommon";
import Question2Signup from "./pages/Question2Signup";
import Question2Signin from "./pages/Question2Signin";
import Question2Share from "./pages/Question2Share";

const LayoutWithHeader = () => (
  <>
    <HeaderCommon />
    <Outlet />
  </>
);

const LayoutWithoutHeader = () => <Outlet />;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutWithHeader />}>
          <Route path="/" element={<Navigate to="/question1" />} />
          <Route path="/question1" element={<Question1 />} />
          <Route path="/question2" element={<Question2 />} />
        </Route>
        <Route element={<LayoutWithoutHeader />}>
          <Route path="/question2/signup" element={<Question2Signup />} />
          <Route path="/question2/signin" element={<Question2Signin />} />
          <Route path="/question2/share" element={<Question2Share />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
