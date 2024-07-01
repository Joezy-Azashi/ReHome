import React, { useState, useEffect } from 'react'
import { Box, TextField, FormLabel, Paper, Grid, Typography, ListItemIcon, ListItemText, MenuItem, CircularProgress, IconButton, Checkbox } from '@mui/material'
import { DeleteOutline, FiberManualRecord } from '@mui/icons-material'
import RoundButton from '../../components/Buttons/RoundButton'
import { useTranslation } from 'react-i18next';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Api from '../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import moment from "moment";
import PhoneInput from 'react-phone-number-input'
import en from 'react-phone-number-input/locale/en'
import fr from 'react-phone-number-input/locale/fr'

function AddToSalesDB() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const location = useLocation()
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [error, setError] = useState(false)
    const [firstName, setFirstName] = useState(location?.state?.data?.first_name || "")
    const [lastName, setLastName] = useState(location?.state?.data?.last_name || "")
    const [title, setTitle] = useState(location?.state?.data?.title || "")
    const [phone, setPhone] = useState(location?.state?.data?.phone_number || "")
    const [email, setEmail] = useState(location?.state?.data?.email || "")
    const [address, setAddress] = useState(location?.state?.data?.address || "")
    const [age, setAge] = useState(location?.state?.data?.age || "")
    const [gender, setGender] = useState(location?.state?.data?.gender || "")
    const [dob, setDob] = useState(dayjs(location?.state?.data?.DOB) || dayjs())
    const [marital, setMarital] = useState(location?.state?.data?.marital_status || "")
    const [nationality, setNationality] = useState(location?.state?.data?.nationality || "")
    const [occupation, setOccupation] = useState(location?.state?.data?.occupation || "")
    const [companyName, setCompanyName] = useState(location?.state?.data?.company_name || "")
    const [companySize, setCompanySize] = useState(location?.state?.data?.company_size || "")
    const [companyLocation, setCompanyLocation] = useState(location?.state?.data?.company_location || "")
    const [companyTitle, setCompanyTitle] = useState(location?.state?.data?.company_title || "")
    const [companyDepartment, setCompanyDepartment] = useState(location?.state?.data?.company_department || "")
    const [industry, setIndustry] = useState(location?.state?.data?.industry || "")
    const [linkedin, setLinkedin] = useState(location?.state?.data?.linkedIn || "")
    const [twitter, setTwitter] = useState(location?.state?.data?.twitter || "")
    const [facebook, setFacebook] = useState(location?.state?.data?.facebook || "")
    const [instagram, setInstagram] = useState(location?.state?.data?.instagram || "")
    const [website, setWebsite] = useState(location?.state?.data?.website || "")
    const [portfolio, setPortfolio] = useState(location?.state?.data?.portfolio || "")
    const [educationLevel, setEducationLevel] = useState(location?.state?.data?.eductation_level || "")
    const [pcc, setPcc] = useState(location?.state?.data?.preferred_communication_channel || "")
    const [pct, setPct] = useState(location?.state?.data?.preferred_communication_time || "")
    const [housingPref, setHousingPref] = useState(location?.state?.data?.housing_preference || "")
    const [specificReq, setSpecificReq] = useState(location?.state?.data?.specific_requirements || "")
    const [leadSource, setLeadSource] = useState(location?.state?.data?.lead_source || "")
    const [rating, setRating] = useState(location?.state?.data?.rating || "")
    const [budget, setBudget] = useState(location?.state?.data?.budget_in_cedis || "")
    const [hobbies, setHobbies] = useState(location?.state?.data?.hobbies ? location?.state?.data?.hobbies[0] : "")
    const [Certifications, setCertification] = useState(location?.state?.data?.certificates ? JSON.parse(location?.state?.data?.certificates) : [])
    const [certName, setCertName] = useState("")
    const [certDate, setCertDate] = useState(dayjs())
    const [profHistory, setProfHistory] = useState(location?.state?.data?.professional_history ? JSON.parse(location?.state?.data?.professional_history) : [])
    const [comName, setComName] = useState("")
    const [position, setPosition] = useState("")
    const [startDate, setStartDate] = useState(dayjs())
    const [endDate, setEndDate] = useState(dayjs().add(30, 'day'))
    const [purchHistory, setPurchHistory] = useState(location?.state?.data?.purchase_history ? JSON.parse(location?.state?.data?.purchase_history) : [])
    const [eventattended, setEventAttended] = useState(location?.state?.data?.events ? JSON.parse(location?.state?.data?.events) : [])
    const [previousInteractions, setPreviousInteractions] = useState(location?.state?.data?.previous_interaction || [])
    const [prename, setPrename] = useState("")
    const [predate, setPredate] = useState(dayjs())
    const [purchDate, setPurchDate] = useState(dayjs())
    const [product, setProduct] = useState("")
    const [amount, setAmount] = useState(0)
    const [isClean, setIsClean] = useState(location?.state?.data?.is_clean || false)
    const [eventDate, setEventDate] = useState(dayjs())
    const [event, setEvent] = useState("")

    const addPurchaseHistory = () => {
        if (purchDate !== "" || product !== "" || amount !== "") {
            setPurchHistory([...purchHistory, { date: purchDate.format("YYYY-MM-DD"), product_name: product, amount_in_cedis: Number(amount) }]);
            setPurchDate('')
            setProduct('')
            setAmount('')
        }
    };

    const addProfessionalHistory = () => {
        if (comName !== "" || position !== "" || startDate !== "" || endDate !== "") {
            setProfHistory([...profHistory, { company_name: comName, position: position, start_date: startDate.format("YYYY-MM-DD"), end_date: endDate.format("YYYY-MM-DD") }]);
            setComName('')
            setPosition('')
            setStartDate('')
            setEndDate('')
        }
    }

    const addEvent = () => {
        if (eventDate !== "" || event !== "") {
            setEventAttended([...eventattended, { date: eventDate.format("YYYY-MM-DD"), name: event }]);
            setEventDate('')
            setEvent('')
        }
    }

    const addCertification = () => {
        if (certName !== "" || certDate !== "") {
            setCertification([...Certifications, { name: certName, date: certDate.format("YYYY-MM-DD") }]);
            setCertName('')
            setCertDate('')
        }
    }

    const addPreviousInter = () => {
        if (prename !== "" || predate !== "") {
            setPreviousInteractions([...previousInteractions, { name: prename, date: predate.format("YYYY-MM-DD") }]);
            setPrename('')
            setPredate('')
        }
    }

    const postToSalesDB = () => {
        const data = {
            first_name: firstName,
            last_name: lastName,
            title: title,
            phone_number: phone,
            email: email,
            address: address,
            age: Number(age),
            gender: gender,
            DOB: dob.format("YYYY-MM-DD"),
            marital_status: marital,
            nationality: nationality,
            occupation: occupation,
            company_name: companyName,
            company_size: Number(companySize),
            company_location: companyLocation,
            company_title: companyTitle,
            company_department: companyDepartment,
            industry: industry,
            linkedIn: linkedin,
            twitter: twitter,
            facebook: facebook,
            instagram: instagram,
            website: website,
            portfolio: portfolio,
            education_level: educationLevel,
            preferred_communication_channel: pcc,
            preferred_communication_time: pct,
            housing_preference: housingPref,
            specific_requirements: specificReq,
            lead_source: leadSource,
            rating: Number(rating),
            budget_in_cedis: Number(budget),
            professional_history: profHistory,
            purchase_history: purchHistory,
            certificates: Certifications,
            hobbies: [hobbies],
            events: eventattended,
            previous_interaction: previousInteractions,
            is_clean: isClean
        }

        if (firstName === '' || lastName === '' || email === '') {
            enqueueSnackbar(t('admindashboard.salesdb.emptyfield'), { variant: 'error' });
            setError(true)
        } else {
            setLoading(true)
            Api().post('/sales', data)
                .then((res) => {
                    enqueueSnackbar("Customer Search updated successfully", { variant: 'success' });
                    navigate('/admin/customer-search')
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                    enqueueSnackbar("Error, try again", { variant: 'error' });
                })
        }
    }

    const deleteSalesRecord = () => {
        setDeleteLoading(true)
        Api().delete(`/sales/${location?.state?.data?.email}`)
            .then((res) => {
                enqueueSnackbar("Record deleted successfully", { variant: 'success' });
                navigate('/admin/customer-search')
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
                    <Typography fontWeight={600}>Personal Details</Typography>
                </Grid>
                <Grid item xs={12} md={4}>

                    <FormLabel sx={{ color: "#000" }}>First Name</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={firstName}
                        error={firstName !== "" ? false : error}
                        onChange={(e) => { setFirstName(e.target.value); setError(false) }}
                        fullWidth
                        placeholder='First Name'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Last Name</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={lastName}
                        error={lastName !== "" ? false : error}
                        onChange={(e) => { setLastName(e.target.value); setError(false) }}
                        fullWidth
                        placeholder='Last Name'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Title</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        placeholder='Title'
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
                        onChange={(e) => setAddress(e.target.value)}
                        fullWidth
                        placeholder='Address'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Age</FormLabel>
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
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        fullWidth
                        placeholder='Age'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Gender</FormLabel>
                    <TextField
                        select
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size='small'
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        fullWidth
                        placeholder='Gender'
                    >
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'female'}>Female</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Date of Birth</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                            <DatePicker
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                value={dob}
                                onChange={(newValue) => {
                                    setDob(newValue)
                                }}
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Marital Status</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={marital}
                        onChange={(e) => setMarital(e.target.value)}
                        fullWidth
                        placeholder='Marital Status'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Nationality</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        fullWidth
                        placeholder='Nationality'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Occupation</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        fullWidth
                        placeholder='Nationality'
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography fontWeight={600} mt={2}>Company Details</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Company Title</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={companyTitle}
                        onChange={(e) => setCompanyTitle(e.target.value)}
                        fullWidth
                        placeholder='Company Title'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Company Name</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        fullWidth
                        placeholder='Company Name'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
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
                        onChange={(e) => setIndustry(e.target.value)}
                        fullWidth
                        placeholder='Industry'
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormLabel sx={{ color: "#000" }}>Professional History</FormLabel>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Company Name</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={comName}
                                onChange={(e) => setComName(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Company Name'
                            />
                        </Grid>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Position</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Position'
                            />
                        </Grid>

                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>start Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={startDate}
                                        onChange={(newValue) => {
                                            setStartDate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>End Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={endDate}
                                        onChange={(newValue) => {
                                            setEndDate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={2} display={"flex"} alignItems={"center"} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addProfessionalHistory()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} fullWidth={true} />
                            </Box>
                        </Grid>

                        {
                            profHistory.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.company_name}</ListItemText>
                                        <ListItemText>{el?.position}</ListItemText>
                                        <ListItemText>{el?.start_date}</ListItemText>
                                        <ListItemText>{el?.end_date}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setProfHistory(prev => { return prev.filter((n, i) => i !== index) }) }}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </ListItemText>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
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
                    <FormLabel sx={{ color: "#000" }}>Personal Website</FormLabel>
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
                        placeholder='Personal Website'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Blog/Portfolio URL</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        fullWidth
                        placeholder='Blog/Portfolio URL'
                    />
                </Grid>

                <Grid item xs={12}>
                    <Typography fontWeight={600} mt={2}>Education</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Education Background</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        fullWidth
                        placeholder='Education Background'
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormLabel sx={{ color: "#000" }}>Certifications</FormLabel>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Name</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={certName}
                                onChange={(e) => setCertName(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Name'
                            />
                        </Grid>
                        <Grid item xs={12} md={5} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={certDate}
                                        onChange={(newValue) => {
                                            setCertDate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={2} display={"flex"} alignItems={"center"} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addCertification()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} fullWidth={true} />
                            </Box>
                        </Grid>

                        {
                            Certifications.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.name}</ListItemText>
                                        <ListItemText>{el?.date}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setCertification(prev => { return prev.filter((n, i) => i !== index) }) }}>
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
                    <FormLabel sx={{ color: "#000" }}>Interests and Hobbies</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                        fullWidth
                        placeholder='Interests and Hobbies'
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormLabel sx={{ color: "#000" }}>Purchase History</FormLabel>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={purchDate}
                                        onChange={(newValue) => {
                                            setPurchDate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Product</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Product'
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Amount</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                size="small"
                                type="number"
                                onKeyDown={(e) => {
                                    if (e.keyCode === 38 || e.keyCode === 40) {
                                        e.preventDefault();
                                    }
                                }}
                                onWheel={(e) => e.target.blur()}
                                fullWidth
                                placeholder='Amount'
                            />
                        </Grid>

                        <Grid item xs={12} md={4} lg={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addPurchaseHistory()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                        </Grid>

                        {
                            purchHistory.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.date}</ListItemText>
                                        <ListItemText>{el?.product_name}</ListItemText>
                                        <ListItemText>{el?.amount_in_cedis}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setPurchHistory(prev => { return prev.filter((n, i) => i !== index) }) }}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </ListItemText>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography fontWeight={600} mt={2}>Company</Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Company Size</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        type="number"
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        fullWidth
                        placeholder='Company Size'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Company Location</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={companyLocation}
                        onChange={(e) => setCompanyLocation(e.target.value)}
                        fullWidth
                        placeholder='Company Location'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Department</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={companyDepartment}
                        onChange={(e) => setCompanyDepartment(e.target.value)}
                        fullWidth
                        placeholder='Department'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Preferred Communication Channel</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={pcc}
                        onChange={(e) => setPcc(e.target.value)}
                        fullWidth
                        placeholder='Preferred Communication Channel'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Preferred Communication Time</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={pct}
                        onChange={(e) => setPct(e.target.value)}
                        fullWidth
                        placeholder='Preferred Communication Time'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Housing Preferences</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={housingPref}
                        onChange={(e) => setHousingPref(e.target.value)}
                        fullWidth
                        placeholder='Housing Preferences'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Specific Requirement</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={specificReq}
                        onChange={(e) => setSpecificReq(e.target.value)}
                        fullWidth
                        placeholder='Specific Requirement'
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormLabel sx={{ color: "#000" }}>Events/Conferences Attended</FormLabel>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={eventDate}
                                        onChange={(newValue) => {
                                            setEventDate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Event</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Event'
                            />
                        </Grid>

                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addEvent()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                        </Grid>

                        {
                            eventattended.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.name}</ListItemText>
                                        <ListItemText>{el?.date}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setEventAttended(prev => { return prev.filter((n, i) => i !== index) }) }}>
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
                    <FormLabel sx={{ color: "#000" }}>Lead Source</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={leadSource}
                        onChange={(e) => setLeadSource(e.target.value)}
                        fullWidth
                        placeholder='Lead Source'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Rating</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        type="number"
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        fullWidth
                        placeholder='Rating'
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormLabel sx={{ color: "#000" }}>Budget</FormLabel>
                    <TextField
                        sx={{
                            marginBottom: '1rem',
                            '& .MuiOutlinedInput-root': {
                                background: '#fff',
                                borderRadius: '50px'
                            }
                        }}
                        size="small"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        type="number"
                        onKeyDown={(e) => {
                            if (e.keyCode === 38 || e.keyCode === 40) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                        fullWidth
                        placeholder='Budget'
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormLabel sx={{ color: "#000" }}>Previous Interactions</FormLabel>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Name</FormLabel>
                            <TextField
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: '#fff',
                                        borderRadius: '50px'
                                    }
                                }}
                                value={prename}
                                onChange={(e) => setPrename(e.target.value)}
                                size="small"
                                fullWidth
                                placeholder='Name'
                            />
                        </Grid>
                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <FormLabel sx={{ color: "#000" }}>Date</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']} sx={{ paddingTop: "0" }}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: "50px" } }}
                                        value={predate}
                                        onChange={(newValue) => {
                                            setPredate(newValue)
                                        }}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={4} display={"flex"} alignItems={"center"} gap={'15px'} mt={.5}>
                            <Box my={4} sx={{ display: "flex", justifyContent: "end" }}>
                                <RoundButton onClick={() => addPreviousInter()} text={t('agentdashboard.addlisting.button.add')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                            </Box>
                        </Grid>

                        {
                            previousInteractions.map((el, index) => {
                                return (
                                    <Grid item xs={12} key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                                        <ListItemIcon sx={{ minWidth: '30px' }}><FiberManualRecord color='primary' sx={{ fontSize: '.7rem' }} /></ListItemIcon>
                                        <ListItemText>{el?.name}</ListItemText>
                                        <ListItemText>{el?.date}</ListItemText>
                                        <ListItemText>
                                            <IconButton onClick={() => { setPreviousInteractions(prev => { return prev.filter((n, i) => i !== index) }) }}>
                                                <DeleteOutline />
                                            </IconButton>
                                        </ListItemText>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Box my={4} sx={{ display: { xs: "block", md: "flex" }, justifyContent: "end", gap: "15px" }}>
                        {location?.state?.data ?
                            <RoundButton
                                onClick={() => deleteSalesRecord()}
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
                            onClick={() => postToSalesDB()}
                            text={loading || (location?.state?.data ? "Update" : "Submit to Sales Database")}
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

export default AddToSalesDB