import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminSignIn from "../auth/AdminSignIn";
import ChangePass from "../auth/ChangePass";
import ForgetPassword from "../auth/ForgetPassword";
import Login from "../auth/Login";
import ResetPassword from "../auth/ResetPassword";
import VerificationCode from "../auth/VerificationCode";
import DashboardPage from "../components/Dashboard/Dashboard";
import Feedback from "../components/Dashboard/Feedback";
import DashboardLayout from "../layout/DashboardLayout";
import BlockedUser from "../page/BlockedUser/BlockedUser";

import Notification from "../page/Notification/Notification";
import AboutUs from "../page/Settings/AboutUs";
import ProfilePage from "../page/Settings/Profile";
import Setting from "../page/Settings/Setting";
import Users from "../page/UserManagement/Users";
import PrivacyPolicy from "./../page/Settings/PrivacyPolicy";
import TermsAndCondition from "./../page/Settings/TermsCondition";
import Earning from "../page/Earning/Earning";
import Subscription from "../page/Subscription/Subscription";
import Cetagory from "../page/Cetagory/Cetagory";
import Blog from "../page/Blog.jsx/Blog";
import Report from "../page/Report/Report";
import Admins from "../page/UserManagement/Admins";
import Payouts from "../page/Payouts/Payouts";

function PrivateRoute({ children }) {
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return match ? decodeURIComponent(match[1]) : null;
  };
  const cookieAccess = getCookie("accessToken");
  const lsAccess =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;
  const token = cookieAccess || lsAccess;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/users",
        element: <Users />,
      },
      {
        path: "/dashboard/users/client",
        element: <Users />,
      },
      {
        path: "/dashboard/users/provider",
        element: <Users />,
      },
      {
        path: "/dashboard/admins",
        element: <Admins />,
      },
      {
        path: "/dashboard/earnings",
        element: <Earning />,
      },
      {
        path: "/dashboard/subscriptions",
        element: <Subscription />,
      },
      {
        path: "/dashboard/categories",
        element: <Cetagory />,
      },
      {
        path: "/dashboard/blogs",
        element: <Blog />,
      },
      {
        path: "/dashboard/blocked-users",
        element: <BlockedUser />,
      },
      {
        path: "/dashboard/createAdmin",
        element: <AdminSignIn />,
      },
      {
        path: "/dashboard/report",
        element: <Report />,
      },
        {
        path: "/dashboard/payouts",
        element: <Payouts/>,
      },
      {
        path: "/dashboard/feedback",
        element: <Feedback />,
      },

      {
        path: "/dashboard/Setting",
        element: <Setting />,
      },
      {
        path: "/dashboard/Setting/changePassword",
        element: <ChangePass />,
      },
      {
        path: "/dashboard/Setting/privacyPolicy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/dashboard/Setting/tramsAndCondition",
        element: <TermsAndCondition />,
      },
      {
        path: "/dashboard/Setting/aboutUs",
        element: <AboutUs />,
      },

      {
        path: "/dashboard/profile/edit-profile",
        element: <ProfilePage />,
      },
      {
        path: "/dashboard/notification/all-notifications",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify-mail",
    element: <VerificationCode />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/resetPassword",
    element: <ResetPassword />,
  },
  {
    path: "/verification-code",
    element: <VerificationCode />,
  },
]);
