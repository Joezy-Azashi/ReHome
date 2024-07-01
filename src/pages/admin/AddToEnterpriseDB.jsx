import React, { useState } from 'react'
import { Box, TextField, FormLabel, Paper, Grid, Typography, ListItemIcon, ListItemText, CircularProgress, IconButton, Checkbox } from '@mui/material'
import { DeleteOutline, FiberManualRecord } from '@mui/icons-material'
import RoundButton from '../../components/Buttons/RoundButton'
import { useTranslation } from 'react-i18next';
import Api from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

function AddToEnterpriseDB() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const location = useLocation()
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [error, setError] = useState(false)
    const [name, setName] = useState(location?.state?.data?.name || "")
    const [address, setAddress] = useState(location?.state?.data?.address || "")
    const [city, setCity] = useState(location?.state?.data?.city || "")
    const [state, setState] = useState(location?.state?.data?.state || "")
    const [country, setCountry] = useState(location?.state?.data?.country || "")
    const [postalCode, setPostalCode] = useState(location?.state?.data?.postal_code || "")
    const [industry, setIndustry] = useState(location?.state?.data?.industry || "")
    const [email, setEmail] = useState(location?.state?.data?.email || "")
    const [phone, setPhone] = useState(location?.state?.data?.phone_number || "")
    const [fax, setFax] = useState(location?.state?.data?.fax_number || "")
    const [description, setDescription] = useState(location?.state?.data?.description || "")
    const [year, setYear] = useState(location?.state?.data?.year_established || "")
    const [revenue, setRevenue] = useState(location?.state?.data?.annual_revenue || "")
    const [employees, setEmployees] = useState(location?.state?.data?.employees_count || "")
    const [linkedin, setLinkedin] = useState(location?.state?.data?.linkedIn || "")
    const [twitter, setTwitter] = useState(location?.state?.data?.twitter || "")
    const [facebook, setFacebook] = useState(location?.state?.data?.facebook || "")
    const [instagram, setInstagram] = useState(location?.state?.data?.instagram || "")
    const [website, setWebsite] = useState(location?.state?.data?.website || "")
    const [accuracy, setAccuracy] = useState(location?.state?.data?.contact_accuracy || "")
    const [contacts, setContacts] = useState(location?.state?.data?.contacts ? JSON.parse(location?.state?.data?.contacts) : [])
    const [contactName, setContactName] = useState("")
    const [contactPosition, setContactPosition] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [contactDecider, setContactDecider] = useState(false)
    const [isClean, setIsClean] = useState(location?.state?.data?.is_clean || false)

    const addContact = () => {
        if (contactName !== "" || contactPosition !== "" || contactEmail !== "" || contactPhone !== "") {
            setContacts([...contacts, { name: contactName, position: contactPosition, email: contactEmail, phone_number: contactPhone, decider: contactDecider }]);
            setContactName('')
            setContactPosition('')
            setContactEmail('')
            setContactPhone('')
            setContactDecider(false)
        }
    };

    const postToEnterpriseDB = () => {
        const data = {
            name: name,
            address: address,
            city: city,
            state: state,
            country: country,
            postal_code: postalCode,
            industry: industry,
            email: email,
            phone_number: phone,
            fax_number: fax,
            description: description,
            year_established: year,
            annual_revenue: revenue,
            employees_count: Number(employees),
            linkedIn: linkedin,
            twitter: twitter,
            facebook: facebook,
            instagram: instagram,
            website: website,
            contact_accuracy: Number(accuracy),
            contacts: contacts,
            is_clean: isClean
        }

        if (name === '' || email === '') {
            enqueueSnackbar(t('admindashboard.enterprisedb.emptyfield'), { variant: 'error' });
            setError(true)
        } else {
            setLoading(true)
            Api().post('/enterprises', data)
                .then((res) => {
                    enqueueSnackbar("Enterprise Search updated successfully", { variant: 'success' });
                    navigate('/admin/enterprise-search')
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                    enqueueSnackbar("Error, try again", { variant: 'error' });
                })
        }
    }

    const deleteEnterpriseRecord = () => {
        setDeleteLoading(true)
        Api().delete(`/enterprises/${location?.state?.data?.email}`)
            .then((res) => {
                enqueueSnackbar("Record deleted successfully", { variant: 'success' });
                navigate('/admin/enterprise-search')
                setDeleteLoading(false)
            })
            .catch((error) => {
                setDeleteLoading(false)
                enqueueSnackbar("Error, try again", { variant: 'error' });
            })
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', padding: "1.5rem" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                    <Checkbox
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        checked={isClean}
                        onChange={(e) => setIsClean(e.target.checked)}
                        size="small"
                        fullWidth
                    />
                    <FormLabel sx={{ color: "#000" }}>Good to Display to Users</FormLabel>
                </Grid>
                <Grid item xs={12} mt={2}>
                    <Typography fontWeight={600}>Company Information</Typography>
                </Grid>

                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>Name</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={name}
                        error={name !== "" ? false : error}
                        onChange={(e) => { setName(e.target.value); setError(false) }}
                        fullWidth
                        placeholder='Name'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Email</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={email}
                        disabled={location?.state?.data?.email && true}
                        error={email !== "" ? false : error}
                        onChange={(e) => { setEmail(e.target.value); setError(false) }}
                        fullWidth
                        placeholder='Email'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Phone</FormLabel>
                    {/* <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        size="small"
                        fullWidth
                        placeholder='Phone'
                    /> */}
                    <PhoneInput
                        placeholder="Enter phone number"
                        labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                        international
                        initialValueFormat="national"
                        countryCallingCodeEditable={false}
                        defaultCountry="GH"
                        value={phone}
                        onChange={setPhone}
                        style={{
                            border: "1px solid #0000003b",
                            borderRadius: "15px",
                            padding: "7.5px 14px",
                            backgroundColor: "#fff",
                            width: "100%",
                            borderRadius: '50px'
                        }}
                        className={"input-phone-number"}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Fax</FormLabel>
                    <PhoneInput
                        placeholder="Enter Fax number"
                        labels={localStorage.getItem('i18nextLng') === 'en' ? en : fr}
                        international
                        initialValueFormat="national"
                        countryCallingCodeEditable={false}
                        defaultCountry="GH"
                        value={fax}
                        onChange={setFax}
                        style={{
                            border: "1px solid #0000003b",
                            borderRadius: "15px",
                            padding: "7.5px 14px",
                            backgroundColor: "#fff",
                            width: "100%",
                            borderRadius: '50px'
                        }}
                        className={"input-phone-number"}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <FormLabel sx={{ color: "#000" }}>Description</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '25px'
                            }
                        }}
                        size="small"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={6}
                        placeholder='Description'
                    />
                </Grid>


                <Grid item xs={12} mt={2}>
                    <Typography fontWeight={600}>Company Location</Typography>
                </Grid>

                <Grid item xs={12} md={8}>

                    <FormLabel sx={{ color: "#000" }}>Address</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={address}
                        onChange={(e) => { setAddress(e.target.value) }}
                        fullWidth
                        placeholder='Address'
                    />
                </Grid>

                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>Postal Code</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={postalCode}
                        onChange={(e) => { setPostalCode(e.target.value) }}
                        fullWidth
                        placeholder='Postal Code'
                    />
                </Grid>

                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>City</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={city}
                        onChange={(e) => { setCity(e.target.value) }}
                        fullWidth
                        placeholder='City'
                    />
                </Grid>

                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>State</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={state}
                        onChange={(e) => { setState(e.target.value) }}
                        fullWidth
                        placeholder='State'
                    />
                </Grid>

                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>Country</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={country}
                        onChange={(e) => { setCountry(e.target.value) }}
                        fullWidth
                        placeholder='Country'
                    />
                </Grid>


                <Grid item xs={12} mt={2}>
                    <Typography fontWeight={600}>About Company</Typography>
                </Grid>

                <Grid item xs={12} md={3}>

                    <FormLabel sx={{ color: "#000" }}>Industry</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={industry}
                        onChange={(e) => { setIndustry(e.target.value) }}
                        fullWidth
                        placeholder='Industry'
                    />
                </Grid>

                <Grid item xs={12} md={3}>

                    <FormLabel sx={{ color: "#000" }}>Year Established</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={year}
                        onChange={(e) => { setYear(e.target.value) }}
                        fullWidth
                        placeholder='Year Established'
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormLabel sx={{ color: "#000" }}>Annual Revenue</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        type="number"
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        size="small"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        fullWidth
                        placeholder='Annual Revenue'
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormLabel sx={{ color: "#000" }}>Number of Employees</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        type="number"
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        size="small"
                        value={employees}
                        onChange={(e) => setEmployees(e.target.value)}
                        fullWidth
                        placeholder='Number of Employees'
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography fontWeight={600} mt={2}>Social Media</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>LinkedIn Profile</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        fullWidth
                        placeholder='LinkedIn Profile'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Twitter Handle</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        fullWidth
                        placeholder='Twitter Handle'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Facebook profile</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        fullWidth
                        placeholder='Facebook profile'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Instagram Handle</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        fullWidth
                        placeholder='Instagram Handle'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Company Website</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        placeholder='Company Website'
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography fontWeight={600} mt={2}>Contacts</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Name</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Name'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Email</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Email'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Phone</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Phone'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Position</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={contactPosition}
                                onChange={(e) => setContactPosition(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Position'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <Checkbox
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={contactDecider}
                                onChange={(e) => setContactDecider(e.target.checked)}
                                size="small"
                                fullWidth
                            />
                            <FormLabel sx={{ color: "#000" }}>Decision Maker</FormLabel>
                        </Grid>

                        <Grid item xs={12} md={4} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addContact()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                        </Grid>

                        {
                            contacts.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.name}</ListItemText>
                                        <ListItemText>{el?.email}</ListItemText>
                                        <ListItemText>{el?.phone}</ListItemText>
                                        <ListItemText>{el?.position}</ListItemText>
                                        <ListItemText>{el?.decider.toString()}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setContacts(prev => { return prev.filter((n, i) => i !== index) }) }}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </ListItemText>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Accuracy</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={accuracy}
                        onChange={(e) => setAccuracy(e.target.value)}
                        fullWidth
                        placeholder='Accuracy'
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box my={4} sx={{ display: { xs: "block", md: "flex" }, justifyContent: "end", gap: "15px" }}>
                        {location?.state?.data ?
                            <RoundButton
                                onClick={() => deleteEnterpriseRecord()}
                                text={deleteLoading || "Delete"}
                                disableElevation
                                variant={'outlined'}

                                sx={{ padding: '.5rem 1.5rem', minWidth: "16rem", marginBottom: { xs: "1rem", md: "0" } }}
                                progress={deleteLoading && (
                                    <CircularProgress
                                        size={20}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: "#fff",
                                            margin: "3px 0"
                                        }}
                                    />
                                )}
                            /> : ""}

                        <RoundButton
                            onClick={() => postToEnterpriseDB()}
                            text={loading || (location?.state?.data ? "Update" : "Submit to Enterprise Database")}
                            disableElevation
                            variant={'contained'}
                            sx={{ padding: '.5rem 1.5rem', minWidth: "18rem" }}
                            progress={loading && (
                                <CircularProgress
                                    size={20}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: "#fff",
                                        margin: "3px 0"
                                    }}
                                />
                            )}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddToEnterpriseDB