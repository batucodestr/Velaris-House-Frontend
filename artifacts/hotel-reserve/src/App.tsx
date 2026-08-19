import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { setBaseUrl } from '@workspace/api-client-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/lib/auth';

// Layout & Pages
import { Layout } from '@/components/layout/Layout';
import ScrollToTop from '@/components/layout/ScrollToTop';
import Home from '@/pages/Home';
import Rooms from '@/pages/Rooms';
import RoomDetail from '@/pages/RoomDetail';
import Booking from '@/pages/Booking';
import MyBookings from '@/pages/MyBookings';
import ReservationDetail from '@/pages/ReservationDetail';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

setBaseUrl(import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api');

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
        <Route path="/rezervasyonlarim/:id" component={ReservationDetail} />
        <Route path="/iletisim" component={Contact} />
        <Route path="/giris" component={Login} />
        <Route path="/kayit" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
