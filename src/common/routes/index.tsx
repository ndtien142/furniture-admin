import { ElementType, lazy, Suspense } from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
// config
// components
import LoadingScreen from '../components/LoadingScreen';
import { PATH_AUTH, PATH_DASHBOARD } from './paths';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  const { pathname } = useLocation();

  const { isAuthenticated } = useAuth();

  const isDashboard = pathname.includes('/dashboard') && isAuthenticated;

  return (
    <Suspense fallback={<LoadingScreen isDashboard={isDashboard} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: 'register',
          element: <Register />,
        },
      ],
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'merchant',
          children: [
            {
              element: <Navigate to={PATH_DASHBOARD.merchant.root} replace />,
              index: true,
            },
            { path: 'settings', element: <AccountGeneral /> },
            { path: 'change-password', element: <AccountChangePassword /> },
          ],
        },
        {
          path: PATH_DASHBOARD.tag.root,
          children: [
            {
              path: PATH_DASHBOARD.tag.list,
              element: <TagList />,
            },
            {
              path: PATH_DASHBOARD.tag.new,
              element: <NewTag />,
            },
            {
              path: PATH_DASHBOARD.tag.edit,
              element: <EditTag />,
            },
          ],
        },
        {
          path: PATH_DASHBOARD.product.root,
          children: [
            {
              path: PATH_DASHBOARD.product.list,
              element: <ProductListContainer />,
            },
          ],
        },
      ],
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
// login
const Login = Loadable(lazy(() => import('../../auth/login/Login')));
const ForgotPassword = Loadable(
  lazy(() => import('../../auth/forgot-password/ResetPassword'))
);
const Register = Loadable(lazy(() => import('../../auth/register/Register')));

// merchant
const AccountGeneral = Loadable(
  lazy(() => import('../../profile/account-general/AccountGeneral'))
);
const AccountChangePassword = Loadable(
  lazy(() => import('../../profile/account-change-password/AccountChangePassword'))
);

const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

// Tag
const NewTag = Loadable(lazy(() => import('src/tag/new-tag/index')));
const TagList = Loadable(lazy(() => import('src/tag/tag-list/index')));

const EditTag = Loadable(lazy(() => import('src/tag/tag-edit/index')));

// Product
const ProductListContainer = Loadable(
  lazy(() => import('src/product/list-product/index'))
);
