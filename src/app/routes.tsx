import { createBrowserRouter } from "react-router";
import { AnimatePresence } from "motion/react";
import { useLocation, Outlet } from "react-router";
import { MainSite } from "./MainSite";
import { StaffPanel } from "./components/StaffPanel";
import { TicketLookup } from "./components/TicketLookup";
import { PageTransition } from "./components/PageTransition";

function AnimatedLayout() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
    </AnimatePresence>
  );
}

export const router = createBrowserRouter([
  {
    Component: AnimatedLayout,
    children: [
      { path: "/",       Component: MainSite },
      { path: "/staff",  Component: StaffPanel },
      { path: "/ticket", Component: TicketLookup },
    ],
  },
]);
