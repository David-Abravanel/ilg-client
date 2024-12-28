import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Table from "./components/table";

const router = createBrowserRouter([
  {
    path: "/posts",
    element: <Table />,
    errorElement: <div>404 Not Found</div>,
  },
]);

export const RoutingRoot = () => {
  return <RouterProvider router={router} />;
};
