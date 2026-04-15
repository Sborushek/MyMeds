import { createBrowserRouter } from 'react-router';
import App from './App';
import { HomeView } from './pages/HomeView';
import { CalendarView } from './pages/CalendarView';
import { AchievementsView } from './pages/AchievementsView';
import { ShopView } from './pages/ShopView';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },
]);
