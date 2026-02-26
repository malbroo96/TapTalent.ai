import { Outlet } from "react-router-dom";
import AppLayout from "./views/layout/AppLayout";

const App = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default App;
