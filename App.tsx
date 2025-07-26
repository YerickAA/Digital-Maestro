import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import AuthWrapper from "@/components/auth-wrapper";
import Dashboard from "@/pages/dashboard";
import Organize from "@/pages/organize";
import Insights from "@/pages/insights";
import Settings from "@/pages/settings-simple";
import Subscribe from "@/pages/subscribe";
import Login from "@/pages/login";
import Register from "@/pages/register";
// Removed forgot password - no longer using email verification
import Welcome from "@/pages/welcome";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import MobileLayout from "@/components/mobile-layout";
import NotFound from "@/pages/not-found";
import PageTransition from "@/components/page-transition";
import InstallPrompt from "@/components/install-prompt";
import ErrorBoundary from "@/components/error-boundary";
import MobileDemo from "@/components/mobile-demo";
import Landing from "@/pages/landing";
import Showcase from "@/pages/showcase";
import Demo from "@/pages/demo";

function Router() {
  const [location] = useLocation();
  
  return (
    <PageTransition location={location}>
      <Switch>
        <Route path="/" component={Showcase} />
        <Route path="/landing" component={Landing} />
        <Route path="/showcase" component={Showcase} />
        <Route path="/demo" component={Demo} />
        <Route path="/app" component={Dashboard} />
        <Route path="/home" component={Dashboard} />
        <Route path="/organize" component={Organize} />
        <Route path="/insights" component={Insights} />
        <Route path="/settings" component={Settings} />
        <Route path="/subscribe" component={Subscribe} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/mobile-demo" component={MobileDemo} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        {/* Removed forgot password route - no longer using email verification */}
        <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <MobileLayout>
              <Router />
              <InstallPrompt />
            </MobileLayout>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
