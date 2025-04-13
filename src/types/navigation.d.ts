import { Location, NavigateFunction } from 'react-router-dom';

export interface RouteParams {
  userId?: string;
  chatId?: string;
  matchId?: string;
  streamId?: string;
}

export interface NavigationProps {
  navigate: NavigateFunction;
  location: Location;
}

export type AppRoutes = {
  home: undefined;
  profile: { userId?: string };
  chat: { chatId: string };
  matches: undefined;
  settings: undefined;
  stream: { streamId: string };
  map: undefined;
}; 