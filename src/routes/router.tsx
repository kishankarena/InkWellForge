import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { SuspenseErrorBoundary } from "./SuspenseErrorBoundary";
import InkWellForge from "src/components/InkWellForge/InkWellForge";

//lazy imports
const Home = lazy(() => import("../components/home/Home"));
const About = lazy(() => import("../components/about/About"));
const PrivateRoutes = lazy(() => import("./PrivateRouter"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <SuspenseErrorBoundary>
            <PrivateRoutes />
          </SuspenseErrorBoundary>
        }
      >
        <Route
          index
          element={
            <SuspenseErrorBoundary>
              <Home />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          path="/inkWellForge"
          element={
            <SuspenseErrorBoundary>
              <InkWellForge />
            </SuspenseErrorBoundary>
          }
        />
        <Route
          path="/about"
          element={
            <SuspenseErrorBoundary>
              <About />
            </SuspenseErrorBoundary>
          }
        />
      </Route>
    </>,
  ),
);

export default router;
