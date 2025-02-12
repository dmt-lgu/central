import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from './redux/store';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import { Suspense, lazy } from 'react';

import NotFound from './screens/notFound';
import Loader from './components/loader/loader';
import ErrorBoundary from './errorGate.tsx';

const UtiStatus = lazy(() =>
  wait(300).then(() => import('./screens/centralOffice/utistatus/UtiStatus.tsx'))
);

const ROutiStatus = lazy(() =>
  wait(300).then(() => import('./screens/centralOffice/roUtiStatus/RoUtil.tsx'))
);


const LGU = lazy(() =>
  wait(300).then(() => import('./screens/centralOffice/lgu/Lgu.tsx'))
);
const CentralF = lazy(() =>
  wait(300).then(() => import('./screens/centralOffice/Central.tsx'))
);

const App = lazy(() => wait(300).then(() => import('./App.tsx')));

const router = createBrowserRouter([
  {
    path: '/central/',
    element: <App />,
    children: [
      {
        path: '/central/',
        element: <Navigate to="/central/reports" />,
      },
      {
        path: '/central/reports',
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <CentralF />
            </Suspense>
          </>
        ),
      },
      {
        path: '/central/utilization',
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <UtiStatus />
            </Suspense>
          </>
        ),
      },
      {
        path: '/central/ro-utilization',
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <ROutiStatus />
            </Suspense>
          </>
        ),
      },
      {
        path: '/central/lgu',
        element: (
          <>
            <Suspense fallback={<Loader />}>
              <LGU />
            </Suspense>
          </>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>

  
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
      </Suspense>
        
      </PersistGate>
    </Provider>
  </React.StrictMode></ErrorBoundary>
);
