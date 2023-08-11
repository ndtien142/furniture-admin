// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Link, Stack, Typography } from '@mui/material';
// components
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { dispatch, useDispatch } from 'src/common/redux/store';
import { PATH_AUTH, PATH_DASHBOARD } from 'src/common/routes/paths';
import {
  FormProvider,
  RHFCheckbox,
  RHFTextField,
} from '../../../common/components/hook-form';
import Iconify from '../../../common/components/Iconify';
import { defaultValues } from '../constants';
import { useAuthlogin } from '../hook/useLogin';
import { IFormLoginValuesProps } from '../interface/interface';
import {
  setShowPassword,
  showPasswordSelector,
  setEmail,
  setPolicies,
} from '../login.slice';
import { LoginSchema } from '../schema/login.schema';
import { setMerchantInfo } from 'src/profile/common/reducers/merchant-profile.slice';
import { useGetMerchantInfo } from '../hook/useGetMerchantInfo';
import useDeepEffect from 'src/common/hooks/useDeepEffect';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useDeepCompareEffect } = useDeepEffect();
  const showPassword = useSelector(showPasswordSelector);
  const dispatch = useDispatch();
  const methods = useForm<IFormLoginValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();
  const onSuccess = () => {
    enqueueSnackbar(t('auth.login.loginSuccess'), {
      variant: 'success',
      autoHideDuration: 1000,
    });
  };
  const onError = () => {
    enqueueSnackbar(t('auth.login.loginFailure'), {
      variant: 'error',
    });
  };

  const { mutate, isSuccess } = useAuthlogin({ onSuccess, onError });
  const { data } = useGetMerchantInfo(isSuccess);

  useDeepCompareEffect(() => {
    if (isSuccess && data) {
      dispatch(setMerchantInfo(data));
      navigate(PATH_DASHBOARD.root);
    }
  }, [isSuccess, data]);
  const onSubmit = (data: IFormLoginValuesProps) => {
    dispatch(setEmail(data.email));
    mutate({ email: data.email, password: data.password });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email" />
        <RHFTextField
          name="password"
          label={t('auth.login.labelPassword')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => dispatch(setShowPassword(!showPassword))}
                  edge="end"
                >
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <RHFCheckbox name="remember" label={t('auth.login.labelRememberMe')} />
        {/* <Typography sx={{ fontSize: '13px' }}>
          <Link to={PATH_AUTH.forgotPassword}>Forgot Password</Link>
        </Typography> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ borderRadius: '60px' }}
      >
        {t('auth.login.btnLogin')}
      </LoadingButton>
      <Typography textAlign={'center'} sx={{ mt: '20px' }}>
        {t('auth.login.dont_have_account')}{' '}
        <Link href={PATH_AUTH.register} underline="hover">
          {t('auth.login.get_started')}
        </Link>
      </Typography>
    </FormProvider>
  );
}
