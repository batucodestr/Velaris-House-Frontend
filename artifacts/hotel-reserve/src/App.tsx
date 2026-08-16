import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

// Layout & Pages
import { Layout } from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Home from '@/pages/Home';
import Rooms from '@/pages/Rooms';
import RoomDetail from '@/pages/RoomDetail';
import Booking from '@/pages/Booking';
import MyBookings from '@/pages/MyBookings';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/odalar" component={Rooms} />
        <Route path="/odalar/:slug" component={RoomDetail} />
        <Route path="/rezervasyon" component={Booking} />
        <Route path="/rezervasyonlarim" component={MyBookings} />
        <Route path="/iletisim" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
