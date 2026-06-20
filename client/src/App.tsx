import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import Home from "@/pages/Home";
import GameRound from "@/pages/GameRound";
import Challenge from "@/pages/Challenge";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/challenge" component={Challenge} />
      <Route path="/play/:mode" component={GameRound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Apply the persisted theme (light/dark) as early as the app mounts.
  useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
