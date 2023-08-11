import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// pages
// components
import LoadingScreen from '../components/LoadingScreen';
import {
  default as useMessage,
  default as useShowSnackbar,
} from 'src/common/hooks/useMessage';
import { useSelector } from 'react-redux';
import {
  accessTokenSelector,
  loginSelector,
  setAccessToken,
  setLogin,
} from 'src/auth/login/auth.slice';
import Login from 'src/auth/login/Login';
import { dispatch } from 'src/common/redux/store';
import { isValidToken } from 'src/common/utils/jwt';
import { PATH_AUTH } from '../routes/paths';
import axiosInstance from '../utils/axios';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useSelector(loginSelector);
  const accessToken = useSelector(accessTokenSelector);
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       if (accessToken && isValidToken(accessToken)) {
  //         dispatch(setAccessToken(accessToken));
  //         dispatch(setLogin(true));
  //       } else {
  //         dispatch(setLogin(false));
  //       }
  //     } catch (err) {
  //       dispatch(setLogin(false));
  //     }
  //   };

  //   initialize();
  // }, []);

  if (!isAuthenticated) {
    // if (pathname !== requestedLocation) {
    //   setRequestedLocation(pathname);
    // }
    return <Login />;
  }

  // if (requestedLocation && pathname !== requestedLocation) {
  //   setRequestedLocation(null);
  //   return <Navigate to={requestedLocation} />;
  // }

  return <>{children}</>;
}
