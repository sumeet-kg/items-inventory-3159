import { Route, Switch } from "wouter";
import Index from "./pages/index";
import TablePage from "./pages/dashboard/table";
import AnalyticsPage from "./pages/dashboard/analytics";
import { Provider } from "./components/provider";
import { ItemsProvider } from "./context/items-context";

function App() {
  return (
    <Provider>
      <ItemsProvider>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/dashboard" component={TablePage} />
          <Route path="/dashboard/analytics" component={AnalyticsPage} />
        </Switch>
      </ItemsProvider>
    </Provider>
  );
}

export default App;
