import AppRoutes from "./Routes/AppRoutes";

import AuthInitializer from "./Services/API/AuthInitializer";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;
