import { EditOutlined, Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material'
import { Avatar, Dialog, Box, Card, CircularProgress, Autocomplete, Chip, CardContent, Divider, FormLabel, Grid, IconButton, styled, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import RoundButton from '../../components/Buttons/RoundButton'
import Api from '../../api/api'
import { useSnackbar } from 'notistack'
import { useTranslation } from "react-i18next";
import ChangePassword from '../client/ChangePassword';
import UploadProfileImage from '../../pages/client/UploadProfileImage'
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

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

// const InputFieldLabel = styled(Typography)(({ theme }) => ({
//     width: '6.5rem',
//     textAlign: 'left',
//     fontSize: '.9rem',
//     fontWeight: 600
// }))

const EditProfile = ({ user, getMyProfile }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [NAR, setNAR] = useState("")
    const [profilePhoto, setProfilePhoto] = useState()
    const [logo, setLogo] = useState()
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
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [openPicUpload, setOpenPicUpload] = useState(false);
    const [profilePicture] = useState();
    const [constantLocation, setConstantLocation] = useState([])
    const [search, setSearch] = useState("")

    const handleOpenImgUpload = () => {
        setOpenPicUpload(true);
    };
    const handleCloseImgUpload = () => {
        setOpenPicUpload(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (firstName === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (lastName === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (phone === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (businessName === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (businessPhone === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (address === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (businessEmail === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (location === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (serviceArea?.length < 1) {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        } else if (description === "") {
            enqueueSnackbar(t('onboard.emptyfields'), { variant: 'error' })
            setError(true)
        }
        else {
            const data = {
                firstName: firstName,
                lastName: lastName,
                NAR: NAR,
                phone: phone,
                avatar: profilePhoto,
                company: {
                    name: businessName,
                    phone: businessPhone,
                    email: businessEmail,
                    address: address,
                    location: location,
                    description: description,
                    logo: logo,
                    profession: profession,
                    serviceAreas: serviceArea
                },
                socialLinks: {
                    instagram: instagram,
                    facebook: facebook,
                    twitter: twitter,
                    linkedin: linkedin
                },
                identifications: [
                    {
                        uri: ghanaCard
                    }
                ]
            }

            setLoading(true)
            Api().patch("/me", data)
                .then((response) => {
                    setLoading(false)
                    window.location.assign("/broker/dashboard")
                })
                .catch((error) => {
                    setLoading(false)
                })
        }
    }

    useEffect(() => {

        setFirstName(user?.firstName)
        setLastName(user?.lastName)
        setPhone(user?.phone)
        setEmail(user?.email)
        setNAR(user?.NAR)
        setProfilePhoto(user?.avatar)
        setLogo(user?.company?.logo)
        setGhanaCard(user?.identifications[0]?.uri)
        setBusinessName(user?.company?.name)
        setBusinessPhone(user?.company?.phone)
        setAddress(user?.company?.address)
        setProfession(user?.company?.profession)
        setDescription(user?.company?.description)
        setFacebook(user?.socialLinks?.facebook)
        setTwitter(user?.socialLinks?.twitter)
        setInstagram(user?.socialLinks?.instagram)
        setLinkedin(user?.socialLinks?.linkedin)
        setBusinessEmail(user?.company?.email)
        setLocation(user?.company?.location)
        setServiceArea(user?.company?.serviceAreas)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

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

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Personal Details */}
                    <Grid item xs={12} sm={12} md={6} lg={3.5}>
                        <WrapCard elevation={0} >
                            <Box padding={'.9rem 2rem'}>
                                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('agentdashboard.editprofile.personaldetails.title')}</Typography>
                            </Box>
                            <Divider />
                            <CardContent sx={{ padding: '2rem', textAlign: 'center' }}>
                                <Box sx={{ position: 'relative', mb: '1.5rem' }}>
                                    <Avatar src={user?.avatar} sx={{ width: '5rem', height: '5rem' }} />
                                    <span onClick={() => { handleOpenImgUpload() }}>
                                        <IconButton sx={{
                                            position: 'absolute',
                                            top: '60%', left: { xs: '18%', sm: '9%', lg: '18%' },
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
                                        getMyProfile={getMyProfile}
                                        handleCloseImgUpload={handleCloseImgUpload}
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
                                        error={firstName?.length > 0 ? false : error}
                                        onChange={(e) => { setFirstName(e.target.value); setError(false) }}
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
                                        error={lastName?.length > 0 ? false : error}
                                        onChange={(e) => { setLastName(e.target.value); setError(false) }}
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
                                        value={user?.email}
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

                                {/* Socials */}
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

                                    <span onClick={() => setOpenChangePassword(true)}><RoundButton text={t('agentdashboard.editprofile.personaldetails.changepassword')} sx={{ padding: '.5rem 1rem', display: 'block', m: '6.7rem 0 1rem 0' }} variant='contained' color={'primary'} disableElevation /></span>
                                </Box>
                            </CardContent>
                        </WrapCard>
                    </Grid>

                    {/* Business Details */}
                    <Grid item xs={12} sm={12} md={6} lg={8.5}>
                        <WrapCard elevation={0} sx={{ height: '100%' }} >
                            <Box padding={'.9rem 2rem'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant='h6' sx={{ fontSize: '1.2rem' }}>{t('agentdashboard.editprofile.businessdetails.title')}</Typography>
                                {/* <IconButton><DeleteOutlineOutlined fontSize='small' /></IconButton> */}
                            </Box>
                            <Divider />
                            <CardContent sx={{
                                padding: { xs: '2rem', sm: '3rem', lg: '2rem 2.5rem' },
                                textAlign: 'center'
                            }}>
                                {/* Logo */}
                                <Box sx={{ position: 'relative', mb: '1.8rem', display: 'inline-block' }}>
                                    <Avatar src={user?.avatar} sx={{ width: '5.5rem', height: '5.5rem' }} />
                                    {/* <span onClick={ () => { handleOpenLogoUpload() }}>
                                        <IconButton 
                                          sx={{
                                            position: 'absolute',
                                            top: '60%', right: '-5%',
                                            padding: '.4rem',
                                            bgcolor: 'primary.main',
                                            ':hover': { bgcolor: 'primary.main' }
                                          }}>
                                        <EditOutlined sx={{ fontSize: '1rem', color: '#fff' }} />
                                        </IconButton>
                                    </span> */}
                                </Box>
                                {/* <Dialog
                                    open={openLogoUpload}
                                    onClose={handleCloseLogoUpload}
                                    fullWidth
                                    maxWidth="sm"
                                >
                                    <UploadLogo
                                        existingProfilePic={logo}
                                        getMyProfile={getMyProfile}
                                        handleCloseLogoUpload={handleCloseLogoUpload}
                                        setToggleDialog={setOpenLogoUpload}
                                    />
                                </Dialog> */}
                                {/* Other details */}
                                <Grid container spacing={{ xs: '1.5rem', sm: '2rem', lg: '3rem' }}>
                                    <Grid item xs={12} sm={12} lg={4}>
                                        <Label>{t('agentdashboard.editprofile.businessdetails.businessname')}:</Label>
                                        <InputField
                                            value={businessName}
                                            error={businessName?.length > 0 ? false : error}
                                            onChange={(e) => { setBusinessName(e.target.value); setError(false) }}
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
                                            error={address?.length > 0 ? false : error}
                                            onChange={(e) => { setAddress(e.target.value); setError(false) }}
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
                                            error={businessEmail?.length > 0 ? false : error}
                                            onChange={(e) => { setBusinessEmail(e.target.value); setError(false) }}
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
                                            error={location?.length > 0 ? false : error}
                                            onChange={(e) => { setLocation(e.target.value); setError(false) }}
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
                                            error={profession?.length > 0 ? false : error}
                                            onChange={(e) => { setProfession(e.target.value); setError(false) }}
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
                                            options={constantLocation.map((option) => option.label)} fullWidth
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
                                            error={description?.length > 0 ? false : error}
                                            onChange={(e) => { setDescription(e.target.value); setError(false) }}
                                            multiline
                                            rows={6}
                                            size='small'
                                            variant='outlined'
                                            fullWidth
                                            placeholder={t('agentdashboard.editprofile.businessdetails.businessdescription')}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: "18px" } }}
                                        />
                                        <span onClick={handleSubmit}>
                                            <RoundButton
                                                text={loading || t('agentdashboard.editprofile.businessdetails.save')}
                                                sx={{ padding: '.5rem 1.5rem', display: 'block', m: '3.5rem 0 1rem 0', float: 'right' }}
                                                variant='contained'
                                                color={'primary'}
                                                disableElevation
                                                progress={loading && (
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
                </Grid>
            </form>

            <ChangePassword openChangePassword={openChangePassword} setOpenChangePassword={setOpenChangePassword} />

        </Box>
    )
}

export default EditProfile