import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Grid, IconButton, Typography, alpha } from '@mui/material'
import RoundButton from '../../components/Buttons/RoundButton'
import { useTranslation } from 'react-i18next';
import { AddCircle, EditOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropertyItem from '../../components/PropertyItem';
import RateContext from '../../contexts/rateContext';
import Api from '../../api/api';
import NoList from '../../assets/images/noListing.png'
import PageLoader from '../../components/PageLoader';

function Listings({firstName, lastName}) {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const ExContext = useContext(RateContext);

  const [load, setLoad] = useState(false)
  const [favs, setFavs] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)

  const getListings = (wherequery = {}) => {
    setProperties([])
    setLoading(true)
    Api().get("/me")
      .then((response) => {
        Api().get(`users/${response?.data?.id}/rehome-properties`, {
          params: {
            filter: {
              order: ["createdAt DESC"]
            }
          }
        })
          .then((response) => {
            setProperties(response?.data)
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
          })
      })
  }

  useEffect(() => {
    getListings()
  }, [])

  return (
    <Box>
      <Box sx={{ padding: '2.5rem 2rem', background: alpha('#1267B1', .05), display: { xs: 'block', sm: "flex" }, justifyContent: 'space-between', width: '100%', borderBottom: '1px solid lighgrey' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }} mb={{ xs: 2, sm: 0 }}>
          <Typography variant='h6'>{t('dashboard.listings.title')}</Typography>
          <Typography variant='body2'>{t('dashboard.listings.manage')}</Typography>
        </Box>
        <Box sx={{ display: { xs: 'block', sm: "flex" }, gap: 3 }}>
          <Box mb={{ xs: 2, sm: 0 }}>
            <RoundButton onClick={() => navigate('/rules-for-uploading')} text={t('agentdashboard.home.rules')} fullWidth disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
          </Box>
          <Box>
            <RoundButton onClick={() => navigate('/client/add-listing', { state: { onetime: "onetime" } })} text={t('dashboard.listings.add')} fullWidth startIcon={<AddCircle fontSize='small' sx={{ color: '#fff', }} />} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
          </Box>
        </Box>
      </Box>

      <Box>
        <Box sx={{ padding: '2rem', overflowY: 'scroll', height: '33rem' }}>
          <Grid container spacing={2}>
            {loading ?
              <Box sx={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "6rem" }}>
                <PageLoader />
              </Box>
              :
              properties?.length < 1 ?
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "6rem", width: "100%", }}>
                  <Box>
                    <img src={NoList} width='15%' style={{ margin: '0 auto', display: 'block' }} alt='no-listing' />
                    <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.home.nolisting')}</Typography>
                    <RoundButton onClick={() => navigate('/client/add-listing', { state: { onetime: "onetime" } })} text={t('dashboard.listings.add')} fullWidth startIcon={<AddCircle fontSize='small' sx={{ color: '#fff', }} />} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                  </Box>
                </Box>
                :
                properties.map((el, index) => {
                  return (
                    <Grid item xs={12} sm={6} lg={4} mb={2} key={index}>
                      <IconButton onClick={() => navigate('/client/edit-listing', { state: { id: el?.id, onetime: "onetime", mode: "editMode" } })}>
                        <EditOutlined />
                      </IconButton>

                      <PropertyItem
                        el={el}
                        name={el?.name}
                        address={el?.geoAddress}
                        price={el?.price}
                        images={el?.pictures}
                        wifi
                        bed={{ number: el?.bedrooms }}
                        bath={{ number: el?.bathrooms }}
                        garage={{ number: '1' }}
                        agentName={firstName + " " + lastName}
                        agentImage={el?.user?.avatar}
                        verified
                        type={el?.transactionType}
                        ExContext={ExContext}
                        currency={el?.currency}
                        // toggleWishlist={toggleWishlist}
                        load={load}
                        favs={favs}
                        clientuser="Client"
                      />
                    </Grid>
                  )
                })}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default Listings