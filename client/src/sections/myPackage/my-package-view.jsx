import React, { useState, useEffect } from 'react';
import { axiosInstance } from 'src/utils/axiosInstance';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export default function MyPackageView() {
  const navigate = useNavigate();
  const [userPackage, setUserPackage] = useState({ name: '' });
  const [packageStatus, setPackageStatus] = useState('Cancelled');

  const { isLoading: isLoadingPackage } = useQuery(
    'myPackages',
    () =>
      axiosInstance
        .get('/me/package')
        .then((res) => {
          console.log(res.data);
          setUserPackage(res.data.userPackage || { name: '' });
          setPackageStatus(res.data.packageStatus || 'Cancelled');
        })
        .catch((error) => console.log(error.message)),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  );

  const { isLoading, mutate: unsubscribe } = useMutation(() => axiosInstance.post('me/package', { cancel: true }), {
    onSuccess: () => {
      navigate('/packages');
    }
  });

  if (isLoadingPackage) return 'Loading...';
  console.log(userPackage);

  const StyledPackageContainer = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }));

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Packages
      </Typography>

      <Grid container spacing={3} direction="row" justifyContent="center" alignItems="center" sx={{ mb: 3, mt: 5 }}>
        <StyledPackageContainer key={userPackage._id}>
          <Typography sx={{ mb: 2 }}>Status: {packageStatus || ''}</Typography>
          {userPackage.name ? (
            <>
              <Typography variant="h6" sx={{ mt: -2, mb: 3, textAlign: 'center' }}>
                {userPackage.name || ' '}
              </Typography>
              <Typography sx={{ mb: 2 }}>Price: {userPackage.price || ''}</Typography>
              <Typography sx={{ mb: 2 }}>Session Discount: {userPackage.sessionDiscount || ''}</Typography>
              <Typography sx={{ mb: 2 }}>Medicine Discount: {userPackage.medicineDiscount || ''}</Typography>
              <Typography sx={{ mb: 2 }}>Family Discount: {userPackage.familyDiscount || ''}</Typography>

              <LoadingButton
                onClick={unsubscribe}
                loading={isLoading}
                loadingIndicator="Loading…"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
              >
                Cancel
              </LoadingButton>
            </>
          ) : (
            <></>
          )}
        </StyledPackageContainer>
      </Grid>
    </Container>
  );
}
