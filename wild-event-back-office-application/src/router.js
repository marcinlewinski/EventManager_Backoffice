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
import { PubNubUserProvider } from "./services/providers/pubnubAPI/PubNubUser";


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
                    <PubNubUserProvider>
                      <Outlet />
                    </PubNubUserProvider>
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
        element: <EmployeePage />,
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
        element: <ChatPage />,
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
