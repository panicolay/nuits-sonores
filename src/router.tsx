import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { Day } from "./pages/Day";
import { Artist } from "./pages/Artist";
import { DiscoverGenres } from "./pages/DiscoverGenres";
import { DiscoverMoods } from "./pages/DiscoverMoods";
import { Filter } from "./pages/Filter";
import { Scene } from "./pages/Scene";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/jour/:dayId", element: <Day /> },
      { path: "/artiste/:slug", element: <Artist /> },
      { path: "/decouvrir/genres", element: <DiscoverGenres /> },
      { path: "/decouvrir/moods", element: <DiscoverMoods /> },
      { path: "/scene/:slug", element: <Scene /> },
      { path: "/filtre/:type/:slug", element: <Filter /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
