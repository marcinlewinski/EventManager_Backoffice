import { Outlet, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LoginForm from "./components/loginForm/LoginForm";
import ResetPasswordForm from "./components/resetPasswordForm/ResetPasswordForm";
import {
  MainPage,
  LogoutPage,
  EventPage,
  MyEventPage,
  EmployeePage,
  MapPage,
} from "./pages/index";
import { UserProvider } from "./services/providers/LoggedUserProvider";
import { DarkModeProvider } from "./components/darkMode/DarkModeProvider";
import { RolesProvider } from "./services/providers/RolesProvider";
import { LocationsProvider } from "./services/providers/LocationsProvider";
import { EmployeesProvider } from "./services/providers/EmployeeProvider";
import { MapProvider } from "./services/providers/MapProvider";
import { ChatPage } from "./pages/chatPage/ChatPage";
import { EventsProvider } from "./services/providers/EventsManagementProvider";
import { PubNubProvider } from "pubnub-react";
import PubNub from "pubnub";

const pubnub = new PubNub({
  publishKey: `${process.env.REACT_APP_PUBNUB_PUB_KEY}`,
  subscribeKey: `${process.env.REACT_APP_PUBNUB_SUB_KEY}`,
  userId: `${process.env.REACT_APP_PUBNUB_UUID}`,
});

pubnub.addListener({
  message: function (m) {
    // handle messages
  },
  presence: function (p) {
    // handle presence
  },
  signal: function (s) {
    // handle signals
  },
  objects: (objectEvent) => {
    // handle objects
  },
  messageAction: function (ma) {
    // handle message actions
  },
  file: function (event) {
    // handle files
  },
  status: function (s) {
    // handle status
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DarkModeProvider>
        <UserProvider>
          <RolesProvider value={{ roles: [] }}>
            <MapProvider value={{ map: [] }}>
              <LocationsProvider value={{ locations: [] }}>
                <EmployeesProvider value={{ employees: [] }}>
                  <EventsProvider value={{ events: [] }}>
                    <Outlet />
                  </EventsProvider>
                </EmployeesProvider>
              </LocationsProvider>
            </MapProvider>
          </RolesProvider>
        </UserProvider>
      </DarkModeProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LoginForm />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/main",
        element: <MainPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/my-events/event",
        element: <MyEventPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/event-management/event",
        element: <EventPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/staff-management",
        element: (
          <PubNubProvider client={pubnub}>
            <EmployeePage />
          </PubNubProvider>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/map-config/map",
        element: <MapPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordForm />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/chat",
        element: (
          <PubNubProvider client={pubnub}>
            <ChatPage />
          </PubNubProvider>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/logout",
        element: <LogoutPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
