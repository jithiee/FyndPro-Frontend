import React, { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./features/app/store.js";

// Layout & Pages
import Layout from "./layoutpage/Layout.jsx";
import Home from "./features/home/Home.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OtpVerifyPage from "./pages/OtpVerifyPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// ROUTE GUARDS
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";

// LAZY COMPONENTS
const EmployeeDash = React.lazy(() =>
  import("./features/dashboard/employee/EmployeeDash.jsx")
);
const PostsProfileView = React.lazy(() =>
  import("./features/dashboard/employee/PostsProfileView.jsx")
);
const EmployeeLists = React.lazy(() =>
  import("./features/booking/EmployeeLists.jsx")
);
const BookingForm = React.lazy(() =>
  import("./features/booking/BookingForm.jsx")
);
const PaymentOptions = React.lazy(() =>
  import("./features/booking/UPIPayment.jsx")
);
const UserDash = React.lazy(() =>
  import("./features/dashboard/user/UserDash.jsx")
);
const About = React.lazy(() => import("./features/about/About.jsx"));
const PostView = React.lazy(() => import("./features/posts/PostView.jsx"));

// LOADER COMPONENT
const PageLoader = () => (
  <div className="flex items-center justify-center w-full min-h-[60vh]">
    <div className="relative flex justify-center items-center">
      <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
    </div>
  </div>
);

//----------ROUTER-----------
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      {/* PUBLIC ROUTES — (blocked for logged-in users) */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/otpverify"
        element={
          <PublicRoute>
            <OtpVerifyPage />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* WEBSITE MAIN LAYOUT */}
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />

        {/* Posts — only logged users */}
        <Route
          path="posts"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <PostView />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route
          path="about"
          element={
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          }
        />
      </Route>

      {/* EMPLOYEE DASHBOARD (role: employee) */}
      <Route
        path="/employeedashboard"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <Suspense fallback={<PageLoader />}>
              <EmployeeDash />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE POSTS DETAIL */}
      <Route
        path="/employeedashboard/:employeeId"
        element={
          <ProtectedRoute allowedRoles={ "client"}>
            <Suspense fallback={<PageLoader />}>
              <PostsProfileView />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* BOOKING (logged users only) */}
      <Route
        path="/bookingview/:employeeId"
        element={
          <ProtectedRoute allowedRoles={ "client"}>
            <Suspense fallback={<PageLoader />}>
              <BookingForm />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* PAYMENT */}
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <PaymentOptions />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* USER DASHBOARD (role: client) */}
      <Route
        path="/userdashboard"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <Suspense fallback={<PageLoader />}>
              <UserDash />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE LISTS (only logged users) */}
      <Route
        path="/employeelists"
        element={
          <ProtectedRoute allowedRoles={ "client"}>
            <Suspense fallback={<PageLoader />}>
              <EmployeeLists />
            </Suspense>
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);






















// import React from "react";
// import { StrictMode, Suspense } from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   RouterProvider,
//   Route
// } from 'react-router-dom';

// import App from './App.jsx';
// import Layout from './layoutpage/Layout.jsx';
// import Home from './features/home/Home.jsx';
// import { store } from './features/app/store.js';
// import { Provider } from "react-redux";
// import RegisterPage from "./pages/RegisterPage.jsx";
// import OtpVerifyPage from "./pages/OtpVerifyPage.jsx";
// import LoginPage from "./pages/LoginPage.jsx";



// // LAZY LOADED COMPONENTS
// const EmployeeDash = React.lazy(() => import('./features/dashboard/employee/EmployeeDash.jsx'));
// const PostsProfileView = React.lazy(() => import('./features/dashboard/employee/PostsProfileView.jsx'));
// const EmployeeLists = React.lazy(() => import('./features/booking/EmployeeLists.jsx'));
// const BookingForm = React.lazy(() => import('./features/booking/BookingForm.jsx'));
// const PaymentOptions = React.lazy(() => import('./features/booking/UPIPayment.jsx'));
// const UserDash = React.lazy(() => import('./features/dashboard/user/UserDash.jsx'));
// const About = React.lazy(() => import('./features/about/about.jsx'));
// const PostView = React.lazy(() => import('./features/posts/PostView.jsx'));


// //  PROFESSIONAL (LOADER...) COMPONENT
// const PageLoader = () => (
//   <div className="flex items-center justify-center w-full min-h-[60vh]">
//     <div className="relative flex justify-center items-center">
//       <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-20"></div>
//       <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
//     </div>
//   </div>
// );

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route>
//       <Route path="/register" element={<RegisterPage />} />
//       <Route path="/otpverify" element={<OtpVerifyPage/>} />
//       <Route path="/login" element={<LoginPage />} />

//       <Route path="/" element={<Layout />}>
//         <Route index element={
//           <Suspense fallback={<PageLoader />}>
//             <Home />
//           </Suspense>
//         } />

//         <Route path="/posts" element={
//           <Suspense fallback={<PageLoader />}>
//             <PostView />
//           </Suspense>
//         } />

//         <Route path="/about" element={
//           <Suspense fallback={<PageLoader />}>
//             <About />
//           </Suspense>
//         } />
//       </Route>

//       {/* Employee Dashboard */}
//       <Route path="/employeedashboard" element={
//         <Suspense fallback={<PageLoader />}>
//           <EmployeeDash />
//         </Suspense>
//       } />

//       {/* Single employee posts */}
//       <Route path="/employeedashboard/:employeeId" element={
//         <Suspense fallback={<PageLoader />}>
//           <PostsProfileView />
//         </Suspense>
//       } />

//       {/* Booking */}
//       <Route path="/bookingview/:employeeId" element={
//         <Suspense fallback={<PageLoader />}>
//           <BookingForm />
//         </Suspense>
//       } />

//       {/* Payment */}
//       <Route path="/payment" element={
//         <Suspense fallback={<PageLoader />}>
//           <PaymentOptions />
//         </Suspense>
//       } />

//       {/* User dashboard */}
//       <Route path="/userdashboard" element={
//         <Suspense fallback={<PageLoader />}>
//           <UserDash />
//         </Suspense>
//       } />

//       {/* Employee lists view  */}
//       <Route path="/employeelists" element={
//         <Suspense fallback={<PageLoader />}>
//           <EmployeeLists />
//         </Suspense>
//       } />
//     </Route>
//   )
// );

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </StrictMode>
// );  















