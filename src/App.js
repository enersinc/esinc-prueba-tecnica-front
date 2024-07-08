import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notification } from "antd";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: (error) => {
        notification.error({
          message: "Error",
          description: error.message,
        });
      },
    },
  },
});

function App() {
  return (
    <div className="App" style={{ margin: "10vh 20vw" }}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </QueryClientProvider>
      </Router>
    </div>
  );
}

export default App;
