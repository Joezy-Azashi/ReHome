import { Edit } from '@mui/icons-material';
import { alpha, Box, CircularProgress, MenuItem, styled, TextField, Typography, Grid } from '@mui/material'
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RoundButton from '../../components/Buttons/RoundButton';
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

const InputField = styled(TextField)(({ theme }) => ({
    margin: '.7rem 0',

    '& .MuiOutlinedInput-root': {
        borderRadius: '15px',
        background: '#fff',
    }
}))


const Profile = ({ firstName, setFirstName, lastName, setLastName, contact, setContact, gender, setGender, city, setCity, edit, user, loading, editProfile, setOpenChangePassword, toggleMode }) => {
    const { t } = useTranslation();


    return (
        <div>
            <>
                <Box sx={{ padding: '2.5rem 2rem', background: alpha('#1267B1', .05), display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid lighgrey' }}>
                    <Box>
                        <Typography variant='h6'>{t('dashboard.profile.myprofile')}</Typography>
                        <Typography variant='body2'>{edit ? "" : (firstName === "" || lastName === "" || contact === "" || gender === "" || city === "") ? t('dashboard.profile.uncompletedprofile') : t('dashboard.profile.completeprofile')}</Typography>
                    </Box>
                    <div onClick={() => setOpenChangePassword(true)}><RoundButton size={'small'} sx={{ padding: '0.5rem 1rem' }} text={t('dashboard.profile.changepasswordbtn')} variant='outlined' /></div>
                </Box>
                {!edit ?
                    <Box sx={{ padding: '1.5rem' }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mb={5}>
                            <Typography variant='h6'>{t('dashboard.profile.profiletitle')}</Typography>

                            <span onClick={toggleMode}>
                                <RoundButton
                                    startIcon={<Edit fontSize='small' />}
                                    type="submit"
                                    sx={{ display: 'flex', marginLeft: 'auto' }}
                                    text={t('dashboard.profile.edit')}
                                    progress={loading && (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "black"
                                            }}
                                        />
                                    )}
                                    variant='outlined'
                                    disableElevation
                                />
                            </span>
                        </Box>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '11rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.firstname')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{firstName}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '11rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.lastname')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{lastName}</Typography>
                            </Grid>


                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '6rem' }}>{t('dashboard.profile.email')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{user.email}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '16rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.contact')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{contact}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem' }}>{t('dashboard.profile.gender')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{gender}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ display: "flex" }} mb={3}>
                                <Typography color={'textSecondary'} sx={{ width: '5rem' }}>{t('dashboard.profile.city')}:</Typography>
                                <Typography sx={{ textOverflow: "ellipsis", width: "100%", whiteSpace: "nowrap", overflow: "hidden" }}>{city}</Typography>
                            </Grid>
                        </Grid>
                    </Box> : ""}


                {/* Edit Profile */}
                {edit ?
                    <Box sx={{ padding: '1.5rem' }}>
                        <Typography variant='h6' mb={2}>{t('dashboard.profile.profiletitle')}</Typography>
                        <form onSubmit={editProfile}>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.firstname')}</Typography>
                                <InputField
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                    inputProps={{ readOnly: !edit ? true : false, }}
                                    type="text"
                                    size="small"
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t('dashboard.profile.firstnameplaceholder')}
                                />
                            </Box>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.lastname')}</Typography>
                                <InputField
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value) }}
                                    inputProps={{ readOnly: !edit ? true : false, }}
                                    type="text"
                                    size="small"
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t('dashboard.profile.lastnameplaceholder')}
                                />
                            </Box>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem' }}>{t('dashboard.profile.email')}</Typography>
                                <InputField
                                    value={user.email}
                                    disabled
                                    size="small"
                                    variant='outlined'
                                    type={'email'}
                                    fullWidth
                                />
                            </Box>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem', whiteSpace: "nowrap" }}>{t('dashboard.profile.contact')}</Typography>
                                {/* <InputField
                                    value={contact}
                                    type="number"
                                    onKeyDown={(e) => {
                                        if (e.keyCode === 38 || e.keyCode === 40) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onWheel={(e) => e.target.blur()}
                                    size="small"
                                    onBlur={
                                        () => {
                                            if (contact?.length > 0 && contact?.length < 10) {
                                                enqueueSnackbar(t('phonevalidationalert'), { variant: 'error' })
                                                setError(true)
                                            } else {
                                                setError(false)
                                            }
                                        }}
                                    error={contact?.length > 0 && contact?.length < 10 ? error : false}
                                    onChange={(e) => { setContact(e.target.value) }}
                                    inputProps={{ readOnly: !edit ? true : false, }}
                                    variant='outlined'
                                    fullWidth
                                    placeholder={t('dashboard.profile.contactplaceholder')}
                                /> */}
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                                    international
                                    initialValueFormat="national"
                                    countryCallingCodeEditable={false}
                                    defaultCountry="GH"
                                    value={contact}
                                    onChange={setContact}
                                    style={{
                                        border: "1px solid #0000003b",
                                        borderRadius: "15px",
                                        padding: "8.5px 14px",
                                        backgroundColor: "#fff",
                                        width: "100%"
                                    }}
                                    className={"input-phone-number"}
                                />
                            </Box>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem' }}>{t('dashboard.profile.gender')}</Typography>
                                <InputField
                                    value={gender}
                                    onChange={(e) => { setGender(e.target.value) }}
                                    inputProps={{ readOnly: !edit ? true : false, }}
                                    variant='outlined'
                                    size="small"
                                    select
                                    fullWidth
                                >
                                    {
                                        ['Male', 'Female'].map((gen, index) => {
                                            return (
                                                <MenuItem key={index} value={gen}>{gen}</MenuItem>
                                            )
                                        })
                                    }
                                </InputField>
                            </Box>
                            <Box display={{ xs: 'block', sm: 'block', lg: 'flex' }} gap='2rem' mb={2.5} alignItems={'center'}>
                                <Typography color={'textSecondary'} sx={{ width: '7rem' }}>{t('dashboard.profile.city')}</Typography>
                                <InputField
                                    value={city}
                                    onChange={(e) => { setCity(e.target.value) }}
                                    inputProps={{ readOnly: !edit ? true : false, }}
                                    variant='outlined'
                                    type={'text'}
                                    size="small"
                                    fullWidth
                                    placeholder={t('dashboard.profile.cityplaceholder')}
                                />
                            </Box>

                            <span onClick={editProfile}>
                                <RoundButton
                                    type="submit"
                                    sx={{ padding: '.5rem 1.5rem', display: 'flex', marginLeft: 'auto', mt: '1rem' }}
                                    text={loading || t('dashboard.profile.save')}
                                    progress={loading && (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: "black"
                                            }}
                                        />
                                    )}
                                    variant='outlined'
                                    disableElevation
                                />
                            </span>
                        </form>
                    </Box> : ""}
            </>
        </div>
    )
}

export default Profile