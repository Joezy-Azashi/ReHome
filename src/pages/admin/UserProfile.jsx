import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Box, Card, Autocomplete, Avatar, Container, Chip, CardContent, Divider, CircularProgress, Dialog, DialogActions, DialogContent, FormLabel, Grid, IconButton, styled, TextField, Typography } from '@mui/material'
import { EditOutlined, Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material'
import { motion } from "framer-motion";
import Api from '../../api/api';
import { useTranslation } from "react-i18next";
import UploadProfileImage from '../../pages/client/UploadProfileImage'
import RoundButton from '../../components/Buttons/RoundButton';
import UserListing from './UserListing';
import { useSnackbar } from 'notistack';
import { getUserType } from '../../services/auth';
import moment from "moment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WrapCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
}))

const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
  alignItems: 'center',
  justifyContent: 'flex-end',
  '& input': {
    fontSize: '.9rem !important',
  }
}))

const InputField = styled(TextField)(({ theme }) => ({
  margin: '.7rem 0',
}))

const Label = styled(FormLabel)(({ theme }) => ({
  display: 'block',
  textAlign: 'left',
  fontWeight: '600',
  color: '#000',
  fontSize: '1rem'
}))

function UserProfile() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const loc = useLocation();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [NAR, setNAR] = useState("")
  const [avatar, setAvatar] = useState("")
  const [profilePhoto, setProfilePhoto] = useState()
  const [logo, setLogo] = useState()
  const [user, setUser] = useState()
  const [ghanaCard, setGhanaCard] = useState()
  const [businessName, setBusinessName] = useState("")
  const [businessPhone, setBusinessPhone] = useState("")
  const [address, setAddress] = useState("")
  const [businessEmail, setBusinessEmail] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [profession, setProfession] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [twitter, setTwitter] = useState("")
  const [serviceArea, setServiceArea] = useState([])
  const [openPicUpload, setOpenPicUpload] = useState(false);
  const [profilePicture] = useState();
  const [constantLocation, setConstantLocation] = useState([])
  const [loadingPersonal, setLoadingPersonal] = useState(false)
  const [loadingBusiness, setLoadingBusiness] = useState(false)
  const [loadingReset, setLoadingReset] = useState(false)
  const [loadingSub, setLoadingSub] = useState(false)
  const [openSubPrompt, setOpenSubPrompt] = useState(false)
  const [search, setSearch] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const [chartData, setChartData] = useState()
  const [subData, setSubData] = useState({
    start_date: moment().toISOString(),
    status: "disabled",
    subscription_code: "fake",
    email_token: "fake",
    subscription_amount: 0,
    next_payment_date: moment().toISOString(),
    plan_code: "fake",
    plan_name: "None",
    plan_currency: "GHS",
  })


  const propertyTypes = [
    {
        name: 'Sell Form',
        Properties: chartData?.sell_form_total
    },
    {
        name: 'Find a Broker',
        Properties: chartData?.find_an_agent_form_total
    },
    {
        name: 'Property Form',
        Properties: chartData?.property_form_total
    },
    {
        name: 'Calls',
        Properties: chartData?.caller_total
    },
];

  const handleOpenImgUpload = () => {
    setOpenPicUpload(true);
  };
  const handleCloseImgUpload = () => {
    setOpenPicUpload(false);
    GetUserData();
  };

  const handleSubmit = (e, type) => {
    e.preventDefault()

    const personalData = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      avatar: profilePhoto,
      socialLinks: {
        instagram: instagram,
        facebook: facebook,
        twitter: twitter,
        linkedin: linkedin
      }
    }

    const businessData = {
      name: businessName,
      phone: businessPhone,
      email: businessEmail,
      address: address,
      location: location,
      description: description,
      logo: logo,
      profession: profession,
      serviceAreas: serviceArea
    }

    if (type === 'personal') {
      setLoadingPersonal(true)
      Api().patch(`/users/${loc?.state?.id}`, personalData)
        .then((response) => {
          setLoadingPersonal(false)
          // window.location.assign("/agent/dashboard")
        })
        .catch((error) => {
          setLoadingPersonal(false)
        })
    } else {
      setLoadingBusiness(true)
      Api().patch(`/agencies/${user?.agencies[0]?.id}`, businessData)
        .then((response) => {
          setLoadingBusiness(false)
          // window.location.assign("/agent/dashboard")
        })
        .catch((error) => {
          setLoadingBusiness(false)
        })
    }

  }

  const getChartData = (id, sub) => {
    Api().get(`/users/${id}/leads`,{params: {
      filter: {
        where: {
          and: [
            {createdAt: {gte: sub.start_date}},
            {createdAt: {lte: moment().endOf('day').toISOString()}}
          ]
          
        }
      }
    }})
        .then((res) => {
          const sell_form_total = res.data.filter(l => l.type === 'sell_request').length;
          const find_an_agent_form_total = res.data.filter(l => l.type === 'find_an_agent').length;
          const property_form_total = res.data.filter(l => l.type === 'property_request').length;
          const caller_total = res.data.filter(l => l.type === 'caller').length;
            setChartData({
              sell_form_total,find_an_agent_form_total,property_form_total,caller_total
            })
        })
        .finally(() => {
        })
}

  const GetUserData = () => {
    if(!loc?.state?.id){
      loc.state = {id: loc.pathname.split("/")[3]}
    }
    Api().get(`users/${loc?.state?.id}`, {
      params: {
        filter: {
          include: ["agencies", "subscription"]
        }
      }
    })
      .then((res) => {
        setUser(res?.data)
        setAvatar(res?.data?.avatar)
        setFirstName(res?.data?.firstName)
        setLastName(res?.data?.lastName)
        setPhone(res?.data?.phone)
        setEmail(res?.data?.email)
        setProfilePhoto(res?.data?.avatar)
        setLogo(res?.data?.agencies[0]?.logo)
        setGhanaCard(res?.data?.identifications[0]?.uri)
        setBusinessName(res?.data?.agencies[0]?.name)
        setBusinessPhone(res?.data?.agencies[0]?.phone)
        setAddress(res?.data?.agencies[0]?.address)
        setProfession(res?.data?.agencies[0]?.profession)
        setDescription(res?.data?.agencies[0]?.description)
        setFacebook(res?.data?.socialLinks?.facebook)
        setTwitter(res?.data?.socialLinks?.twitter)
        setInstagram(res?.data?.socialLinks?.instagram)
        setLinkedin(res?.data?.socialLinks?.linkedin)
        setBusinessEmail(res?.data?.agencies[0]?.email)
        setLocation(res?.data?.agencies[0]?.location)
        setServiceArea(res?.data?.agencies[0]?.serviceAreas)
        setSubData(res?.data?.subscription)
        getChartData(res?.data?.id, res?.data?.subscription)
      })
  }



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(GetUserData, [])

  useEffect(() => {
    //get locations

    if (!search) {
      setConstantLocation([])
      return
    }
    setSearchLoading(true)
    let wherequery = { active: true }
    if (search) {
      let pattern = { like: "^" + search + ".*", options: "i" };
      wherequery.label = pattern
    }

    Api().get('/constants/atlas/locations', {
      params: {
        filter: {
          text: search,
          limit: 10
        }
      }
    })
      .then((res) => {
        setConstantLocation(res?.data)
        setSearchLoading(false)
      })
      .catch((error) => {
        setSearchLoading(false)
      })

  }, [search])


  const ResetPassword = () => {
    setLoadingReset(true)
    Api().post("/request-password", { email: email.toLowerCase() })
      .then((response) => {
        setLoadingReset(false)
        enqueueSnackbar(t('admindashboard.users.table.checkemail'), { variant: 'success' });
      })
      .catch((error) => {
        setLoadingReset(false)
        enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
      })
  }

  const cancelSubscription = () => {
    setLoadingSub(true)
    Api().delete(`/subscriptions/cancel/${user?.id}`)
      .then((res) => {
        enqueueSnackbar(res?.data, { variant: 'error' });
        setOpenSubPrompt(false)
        setLoadingSub(false)
      })
      .catch((error) => {
        enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'error' });
        setOpenSubPrompt(false)
        setLoadingSub(false)
      })
  }

  const editSubscription = () => {
    if(getUserType() !== 'admin'){
      enqueueSnackbar("Only Admins can edit subscription", { variant: 'error' });
      return
    }

    setShowEditForm(true);
  }

  const saveSubscription = () => {
    if(getUserType() !== 'admin'){
      enqueueSnackbar("Only Admins can edit subscription", { variant: 'error' });
      return
    }

    const patchData = {
      start_date: subData.start_date,
      status: subData.status,
      subscription_code: subData.subscription_code,
      email_token: subData.email_token,
      subscription_amount: Number(subData.subscription_amount),
      next_payment_date: subData.next_payment_date,
      plan_code: subData.plan_code,
      plan_name: subData.plan_name,
      plan_currency: subData.plan_currency,
    }

    Api().patch(`subscriptions/${user?.subscription?.id}`, patchData)
    .then((res)=>{
      GetUserData();
      setShowEditForm(false);
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth='xl'>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3.5}>
            <WrapCard elevation={0} >
              <Box padding={'.9rem 2rem'}>
                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('agentdashboard.editprofile.personaldetails.title')}</Typography>
              </Box>
              <Divider />
              <CardContent sx={{ padding: '2rem', textAlign: 'center' }}>
                <Box sx={{ position: 'relative', mb: '1.5rem' }}>
                  <Avatar src={avatar} sx={{ width: '5rem', height: '5rem' }} />
                  <span onClick={() => { handleOpenImgUpload() }}>
                    <IconButton sx={{
                      position: 'absolute',
                      top: '60%', left: '50px',
                      padding: '.4rem',
                      bgcolor: 'primary.main',
                      ':hover': { bgcolor: 'primary.main' }
                    }}><EditOutlined sx={{ fontSize: '1rem', color: '#fff' }} />
                    </IconButton>
                  </span>
                </Box>
                <Dialog
                  open={openPicUpload}
                  onClose={handleCloseImgUpload}
                  fullWidth
                  maxWidth="xs"
                >
                  <UploadProfileImage
                    existingProfilePic={profilePicture}
                    getMyProfile={()=>{}}
                    handleCloseImgUpload={handleCloseImgUpload}
                    userId={user?.id}
                    setToggleDialog={setOpenPicUpload}
                  />
                </Dialog>
                <Box sx={{ '& input': { fontSize: '.9rem !important' } }}>
                  <Typography sx={{ fontSize: '.9rem', fontWeight: 600, textAlign: "left" }}>{t('agentdashboard.editprofile.personaldetails.firstname')}:</Typography>
                  <InputField
                    type="text"
                    size='small'
                    variant='standard'
                    fullWidth
                    placeholder={t('agentdashboard.editprofile.personaldetails.firstname')}
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value) }}
                  />
                </Box>
                <Box sx={{ '& input': { fontSize: '.9rem !important' } }}>
                  <Typography sx={{ fontSize: '.9rem', fontWeight: 600, textAlign: "left" }}>{t('agentdashboard.editprofile.personaldetails.lastname')}:</Typography>
                  <InputField
                    type="text"
                    size='small'
                    variant='standard'
                    fullWidth
                    placeholder={t('agentdashboard.editprofile.personaldetails.lastname')}
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value) }}
                  />
                </Box>
                <Box sx={{ '& input': { fontSize: '.9rem !important' } }}>
                  <Typography sx={{ fontSize: '.9rem', fontWeight: 600, textAlign: "left" }}>{t('agentdashboard.editprofile.personaldetails.phone')}:</Typography>
                  <PhoneInput
                      placeholder={t('agentdashboard.editprofile.personaldetails.phone')}
                      labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                      international
                      initialValueFormat="national"
                      countryCallingCodeEditable={false}
                      defaultCountry="GH"
                      value={phone}
                      onChange={setPhone}
                      style={{
                          borderBottom: "1px solid #949494",
                          marginBottom: "1rem",
                          paddingBottom: "5px",
                          margin: "0.7rem 0"
                      }}
                      className={"input-phone-number"}
                  />
                </Box>
                <Box sx={{ '& input': { fontSize: '.9rem !important' } }}>
                  <Typography sx={{ fontSize: '.9rem', fontWeight: 600, textAlign: "left" }}>{t('agentdashboard.editprofile.personaldetails.email')}:</Typography>
                  <InputField
                    size='small'
                    variant='standard'
                    type={'email'}
                    fullWidth
                    value={email}
                    disabled
                  />
                </Box>

                {/* NAR number for realtors */}
                {user?.userType === 'realtor' ? <>
                    <Box sx={{ '& input': { fontSize: '.9rem !important' } }}>
                        <Typography sx={{ fontSize: '.9rem', fontWeight: 600, textAlign: "left" }}>{t('agentdashboard.editprofile.personaldetails.nar')}:</Typography>
                        <InputField
                            type="text"
                            value={NAR}
                            onChange={(e) => { setNAR(e.target.value) }}
                            size='small'
                            variant='standard'
                            fullWidth
                            placeholder={t('agentdashboard.editprofile.personaldetails.nar')}
                        />
                    </Box>
                    <Typography sx={{ fontSize: '12px', color: 'red', fontStyle: 'italic' }}>{t('onboard.tab1.nardisclaimer')}</Typography>
                </> : <></>}

                <Box mt={'2rem'}>
                  <Typography textAlign={'left'} sx={{ fontWeight: 600, fontSize: { xs: '1.2rem', sm: '1.2rem', lg: '1rem' } }}>{t('agentdashboard.editprofile.personaldetails.social')}</Typography>
                  <FlexBox>
                    <Facebook color='primary' />
                    <InputField
                      type="url"
                      value={facebook}
                      onChange={(e) => { setFacebook(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={'wwww.facebook.com'} />
                  </FlexBox>
                  <FlexBox>
                    <Instagram color='primary' />
                    <InputField
                      type="url"
                      value={instagram}
                      onChange={(e) => { setInstagram(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={'www.instagram.com'}
                    />
                  </FlexBox>
                  <FlexBox>
                    <LinkedIn color='primary' />
                    <InputField
                      type="url"
                      value={linkedin}
                      onChange={(e) => { setLinkedin(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={'www.linkedin.com'}
                    />
                  </FlexBox>
                  <FlexBox>
                    <Twitter color='primary' />
                    <InputField
                      type="url"
                      value={twitter}
                      onChange={(e) => { setTwitter(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={'wwww.twitter.com'}
                    />
                  </FlexBox>

                  {/* Reset user password */}
                  <span onClick={(e) => ResetPassword()}>
                    <RoundButton
                      text={loadingReset || t('admindashboard.users.table.resetpassword')}
                      sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2rem 0 1rem 0' }}
                      variant='contained'
                      color={'primary'}
                      disableElevation
                      progress={loadingReset && (
                        <CircularProgress
                          size={20}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: "white",
                            margin: "3px 0"
                          }}
                        />
                      )}
                    />
                  </span>

                  {/* Save personal details */}
                  <span onClick={(e) => handleSubmit(e, "personal")}>
                    <RoundButton
                      text={loadingPersonal || t('admindashboard.users.table.savepersonal')}
                      sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2.6rem 0 1rem 0' }}
                      variant='contained'
                      color={'primary'}
                      disableElevation
                      progress={loadingPersonal && (
                        <CircularProgress
                          size={20}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: "white",
                            margin: "3px 0"
                          }}
                        />
                      )}
                    />
                  </span>
                </Box>
              </CardContent>
            </WrapCard>
          </Grid>

          <Grid item xs={12} lg={8.5}>
            <WrapCard elevation={0} sx={{ height: '100%' }} >
              <Box padding={'.9rem 2rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('agentdashboard.editprofile.businessdetails.title')}</Typography>
              </Box>
              <Divider />
              <CardContent sx={{
                padding: { xs: '2rem', sm: '3rem', lg: '2rem 2.5rem' },
                textAlign: 'center'
              }}>
                {/* Logo */}
                <Box sx={{ position: 'relative', mb: '1.8rem', display: 'inline-block' }}>
                  <Avatar src={logo} sx={{ width: '5.5rem', height: '5.5rem' }} />
                </Box>
                {/* Other details */}
                <Grid container spacing={{ xs: '1.5rem', sm: '2rem', lg: '3rem' }}>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businessname')}:</Label>
                    <InputField
                      value={businessName}
                      onChange={(e) => { setBusinessName(e.target.value) }}
                      type="text"
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.businessdetails.businessname')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businessphone')}:</Label>
                    <PhoneInput
                        placeholder={t('agentdashboard.editprofile.businessdetails.businessphone')}
                        labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                        international
                        initialValueFormat="national"
                        countryCallingCodeEditable={false}
                        defaultCountry="GH"
                        value={businessPhone}
                        onChange={setBusinessPhone}
                        style={{
                            borderBottom: "1px solid #949494",
                            marginBottom: "1rem",
                            paddingBottom: "5px",
                            margin: "0.7rem 0"
                        }}
                        className={"input-phone-number"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businessaddress')}:</Label>
                    <InputField
                      type="text"
                      value={address}
                      onChange={(e) => { setAddress(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.businessdetails.businessaddress')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businessemail')}:</Label>
                    <InputField
                      value={businessEmail}
                      onChange={(e) => { setBusinessEmail(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.businessdetails.businessemail')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businesslocation')}:</Label>
                    <InputField
                      type="text"
                      value={location}
                      onChange={(e) => { setLocation(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.businessdetails.businesslocation')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <Label>{t('agentdashboard.editprofile.personaldetails.profession')}:</Label>
                    <InputField
                      type="text"
                      value={profession}
                      onChange={(e) => { setProfession(e.target.value) }}
                      size='small'
                      variant='standard'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.personaldetails.profession')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.servicearea')}:</Label>
                    <Autocomplete
                      multiple
                      limitTags={1}
                      includeInputInList
                      id="tags-filled"
                      getOptionLabel={(option) => option}
                      loading={searchLoading}
                      options={constantLocation.map((option) => option.label)}
                      fullWidth
                      value={serviceArea || ""}
                      sx={{ '& .MuiAutocomplete-inputRoot': { flexWrap: "nowrap" } }}
                      onChange={(event, newValue) => {
                        setServiceArea(newValue);
                      }}
                      freeSolo
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                      }
                      renderInput={(params) => (
                        <InputField
                          InputLabelProps={{ shrink: true }}
                          {...params}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '15px',
                              background: '#fff',
                            },
                            margin: '.1rem 0'
                          }}
                          variant="standard"
                          placeholder={t('onboard.tab2.serviceareas')}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Label>{t('agentdashboard.editprofile.businessdetails.businessdescription')}:</Label>
                    <InputField
                      value={description}
                      onChange={(e) => { setDescription(e.target.value) }}
                      multiline
                      rows={6}
                      size='small'
                      variant='outlined'
                      fullWidth
                      placeholder={t('agentdashboard.editprofile.businessdetails.businessdescription')}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: "18px" } }}
                    />
                    <span onClick={(e) => handleSubmit(e, "business")}>
                      <RoundButton
                        text={loadingBusiness || t('admindashboard.users.table.savebusiness')}
                        sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2.5rem 0 1rem 0', float: 'right' }}
                        variant='contained'
                        color={'primary'}
                        disableElevation
                        progress={loadingBusiness && (
                          <CircularProgress
                            size={20}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: "white",
                              margin: "3px 0"
                            }}
                          />
                        )}
                      />
                    </span>
                  </Grid>
                </Grid>

              </CardContent>
            </WrapCard>
          </Grid>

          <Grid item xs={12}>
            <WrapCard elevation={0} sx={{ height: '100%', padding: "2rem" }}>
              <Box padding={'.9rem 0rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('admindashboard.subscription.title')}</Typography>
                <RoundButton
                    onClick={() => !showEditForm ? editSubscription() : saveSubscription()}
                    text={!showEditForm ? t('admindashboard.subscription.edit') :  t('admindashboard.subscription.save')}
                    disableElevation
                    variant={'contained'}
                    sx={{ padding: '.5rem 1.5rem', minWidth: "4rem" }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.name')}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                    <TextField
                      sx={{
                          '& .MuiOutlinedInput-root': {
                              background: '#fff',
                              borderRadius: '50px'
                          }
                      }}
                      value={subData.plan_name}
                      onChange={(e) => setSubData({...subData, plan_name: e.target.value})}
                      size="small"
                      fullWidth
                      placeholder='Enter Plan Name'
                  /> : 
                  user?.subscription?.plan_name}
                </Grid>

                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.code')}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        value={subData.subscription_code}
                        onChange={(e) => setSubData({...subData, subscription_code: e.target.value})}
                        size="small"
                        fullWidth
                        placeholder='Enter Subscription Code'
                    />
                  : user?.subscription?.subscription_code}
                </Grid>

                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.amount')+"(GHS)"}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        value={subData.subscription_amount}
                        onChange={(e) => setSubData({...subData, subscription_amount: Number(e.target.value)})}
                        size="small"
                        fullWidth
                        placeholder='Enter Subscription Amount'
                    /> : 
                  user?.subscription?.subscription_amount}
                </Grid>

                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.status')}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        value={subData.status}
                        onChange={(e) => setSubData({...subData, status: e.target.value})}
                        size="small"
                        fullWidth
                        placeholder='Enter Status'
                    /> : 
                  user?.subscription?.status}
                </Grid>


                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.start')}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                      <DatePicker
                          format="DD/MM/YYYY"
                          slotProps={{ textField: { size: 'small', fullWidth: true } }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                          value={dayjs(subData.start_date)}
                          onChange={(newValue) => {
                            setSubData({...subData, start_date: newValue.toISOString()})
                          }}
                      />
                  </DemoContainer>
              </LocalizationProvider> : 
                  moment(`${user?.subscription?.start_date}`).format("L")}
                </Grid>

                <Grid item xs={6} mb={2}>
                  {t('admindashboard.subscription.end')}:
                </Grid>
                <Grid item xs={6} mb={2}>
                  {showEditForm ? 
                  
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                        <DatePicker
                            format="DD/MM/YYYY"
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                            value={dayjs(subData.next_payment_date)}
                            onChange={(newValue) => {
                              setSubData({...subData, next_payment_date: newValue.toISOString()})
                            }}
                        />
                    </DemoContainer>
                </LocalizationProvider>: 
                  moment(`${user?.subscription?.next_payment_date}`).format("L")}
                </Grid>
              </Grid>
              {showEditForm ? 
                  <></> : 
                <span onClick={(e) => setOpenSubPrompt(true)}>
                  <RoundButton
                    text={loadingSub || t('admindashboard.subscription.cancel')}
                    sx={{ padding: '.5rem 1.5rem', display: 'block', m: '2.5rem 0 0rem 0' }}
                    variant='contained'
                    color={'primary'}
                    disableElevation
                    progress={loadingSub && (
                      <CircularProgress
                        size={20}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: "white",
                          margin: "3px 0"
                        }}
                      />
                    )}
                  />
                </span>
            }
            </WrapCard>
          </Grid>



          <Grid item xs={12}>
            <WrapCard elevation={0} sx={{ height: '100%', padding: "2rem" }}>
              <Box padding={'.9rem 0rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>Leads</Typography>
              </Box>

              {/* Bar chart */}
              <Grid item xs={12} lg={12}>
                <Box>
                    <ResponsiveContainer width="95%" height={400}>
                        <BarChart
                            data={propertyTypes}
                            margin={{
                                top: 20,
                                right: 14,
                                left: 0,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Properties" fill="#1267B1" />
                        </BarChart>
                    </ResponsiveContainer>
                    <Box sx={{ display: { xs: 'block', md: 'flex' }, flexDirection: 'row', justifyContent: 'space-between', paddingRight: '30px' }}>
                        <Typography fontWeight={'400'} mt={2} fontSize={'1.2rem'}>Total Leads: <span style={{ fontWeight: "500" }}>{
                            chartData?.sell_form_total +
                            chartData?.find_an_agent_form_total +
                            chartData?.property_form_total +
                            chartData?.caller_total
                        }</span>
                        </Typography>
                        <Typography fontWeight={'400'} mt={2} fontSize={'1.2rem'}>
                         {moment(subData.start_date).format('LL')} - {moment().endOf('day').format('LL')}
                        </Typography>
                    </Box>
                </Box>
              </Grid>
            </WrapCard>
          </Grid>
        </Grid>

        <Box mt={5}>
          <UserListing id={loc?.state?.id} user={user} />
        </Box>
      </Container>

      <Dialog open={openSubPrompt} onClose={() => setOpenSubPrompt(false)} fullWidth maxWidth="xs">
        <DialogContent>
          {t('admindashboard.subscription.question')}
        </DialogContent>
        <DialogActions sx={{ padding: "0 20px 20px 0" }}>
          <RoundButton onClick={() => setOpenSubPrompt(false)} text={t('admindashboard.subscription.no')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
          <RoundButton
            onClick={() => cancelSubscription()}
            text={loadingSub || t('admindashboard.subscription.yes')}
            progress={loadingSub && (
              <CircularProgress
                size={20}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: "primary"
                }}
              />
            )}
            disableElevation
            variant={'outlined'}
            sx={{ padding: '.5rem 1.5rem' }}
          />
        </DialogActions>
      </Dialog>
    </motion.div>
  )
}

export default UserProfile