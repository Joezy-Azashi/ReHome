import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, FormLabel, MenuItem, Dialog, DialogContent, CircularProgress, Grid, Typography, TextField, Button, Backdrop, alpha, IconButton, Divider } from '@mui/material'
import { LocalPhone, Close, CheckCircle, Cancel } from '@mui/icons-material';
import RoundButton from '../components/Buttons/RoundButton';
import { motion } from "framer-motion";
import Api from "../api/api"
import { useSnackbar } from 'notistack';
import { useTranslation } from "react-i18next";
import RateContext from '../contexts/rateContext';
import login from '../assets/images/loginIcon.png';
import signUp from '../assets/images/signUpIcon.png';
import PillButton from './Buttons/PillButton';
import { isLoggedIn } from '../services/auth';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

function MortgageCalculator() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const rate = useContext(RateContext);
  const { enqueueSnackbar } = useSnackbar();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [where, setWhere] = useState("")
  const [location, setLocation] = useState("")
  const [homeValue, setHomeValue] = useState("")
  const [salary, setSalary] = useState("")
  const [repayment, setRepayment] = useState("")
  const [deposit, setDeposit] = useState("")
  const [age, setAge] = useState(1)
  const [error, setError] = useState(false)
  const [openCal, setOpenCal] = useState(false)
  const [user, setUser] = useState()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [loginPrompt, setLoginPrompt] = useState(false)

  const startOver = () => {
    setOpenCal(false)
    setWhere("")
    setLocation("")
    setHomeValue("")
    setSalary("")
    setRepayment("")
    setDeposit("")
    setAge(1)
  }

  const calcMortgage = async () => {
    if (!isLoggedIn()) {
      setLoginPrompt(true)
    } else if (where === "" ||
      location === "" ||
      homeValue === "" ||
      salary === "" ||
      repayment === "" ||
      deposit === "" ||
      age === "") {
      setError(true)
      enqueueSnackbar(t('mortgage.calculator.form.alert'), { variant: 'error' })
    } else {
      const token = await executeRecaptcha('loginForm')

      if (token.length > 0) {

        const data = {
          stage: where,
          location: location,
          home_value: Number(homeValue),
          income: Number(salary),
          currency: rate?.preferredCurrency,
          tenure: repayment,
          deposit: Number(deposit),
          age: age,
          recaptcha: token
        }

        setLoading(true)
        Api().post(`/users/${user?.id}/mortgages`, data)
          .then((res) => {
            setResult(res?.data)
            setLoading(false)
            setOpenCal(true)
          })
          .catch((error) => {
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    Api().get('/me')
      .then((res) => {
        setUser(res?.data)
      })
      .catch((error) => {

      })
  }, [])

  const contactSpecialist = async () => {
    const token = await executeRecaptcha('loginForm')

    if (token.length > 0) {
      const data = {
        mortgageId: result?.mortgageId,
        recaptcha: token
      }

      setLoading(true)
      Api().post('/emails/mortgage', data)
        .then((res) => {
          enqueueSnackbar((res?.data), { variant: 'success' })
          setLoading(false)
        })
        .catch((error) => { 
          enqueueSnackbar(error?.response?.data?.error?.message, { variant: 'warning' });
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ paddingTop: "70px", backgroundColor: "#D3D3D3", minHeight: "98vh", overflow: "auto" }}>
        <Container maxWidth='xl'>
          <Grid container spacing={2}>
            <Grid xs={12} md={4} item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Box sx={{
                backgroundColor: "tertiary.main",
                width: "20rem",
                height: "20rem",
                borderRadius: "50%",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "2.3rem",
                margin: "auto"
              }}>
                <Box>
                  <Typography variant={"h6"} textAlign={'center'}>{t('mortgage.calculator.circle.title')}</Typography>
                  <Typography textAlign={'center'} sx={{ fontSize: "13px" }}>{t('mortgage.calculator.circle.note')}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid xs={12} md={7.5} item id="getInTouchForm">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q1')}</FormLabel>
                  <TextField
                    select
                    sx={{
                      marginBottom: '1rem',
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        borderRadius: '50px'
                      }
                    }}
                    size="small"
                    value={where}
                    error={where?.length > 0 ? false : error}
                    onChange={(e) => { setWhere(e.target.value); setError(false) }}
                    label={where?.length > 0 ? "" : t('mortgage.calculator.form.q1placeholder')}
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                  >
                    <MenuItem value="Just Researching">{t('mortgage.calculator.form.q1option1')}</MenuItem>
                    <MenuItem value="SPA(Sales and purchase agreement)">{t('mortgage.calculator.form.q1option2')}</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q2')}</FormLabel>
                  <TextField
                    sx={{
                      marginBottom: '1rem',
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        borderRadius: '50px'
                      }
                    }}
                    size="small"
                    value={location}
                    error={location?.length > 0 ? false : error}
                    onChange={(e) => { setLocation(e.target.value); setError(false) }}
                    fullWidth
                    placeholder='eg. East Legon'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q3')} ({rate?.preferredCurrency === "GHS" ? <span>&#x20B5;</span> : <span>$</span>})</FormLabel>
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
                    value={homeValue}
                    error={homeValue?.length > 0 ? false : error}
                    onChange={(e) => { setHomeValue(e.target.value); setError(false) }}
                    fullWidth
                    placeholder='eg. 2000'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q4')} ({rate?.preferredCurrency === "GHS" ? <span>&#x20B5;</span> : <span>$</span>})</FormLabel>
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
                    value={salary}
                    error={salary?.length > 0 ? false : error}
                    onChange={(e) => { setSalary(e.target.value); setError(false) }}
                    fullWidth
                    placeholder='eg. 4000'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q5')}</FormLabel>
                  <TextField
                    select
                    sx={{
                      marginBottom: '1rem',
                      '& .MuiOutlinedInput-root': {
                        background: '#fff',
                        borderRadius: '50px'
                      }
                    }}
                    size="small"
                    value={repayment}
                    error={repayment > 0 ? false : error}
                    onChange={(e) => { setRepayment(e.target.value); setError(false) }}
                    label={repayment !== "" ? "" : t('mortgage.calculator.form.q1placeholder')}
                    InputLabelProps={{ shrink: false }}
                    fullWidth
                  >
                    {[...Array(40)].map((el, i) => {
                      return (
                        <MenuItem key={i} value={i + 1}>{i + 1} {t('mortgage.calculator.form.year')}{i + 1 > 1 ? "s" : ""}</MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q6')} ({rate?.preferredCurrency === "GHS" ? <span>&#x20B5;</span> : <span>$</span>})</FormLabel>
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
                    value={deposit}
                    error={deposit?.length > 0 ? false : error}
                    onChange={(e) => { setDeposit(e.target.value); setError(false) }}
                    fullWidth
                    placeholder='eg. 1000'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ color: "#000", marginLeft: "1.5rem" }}>{t('mortgage.calculator.form.q7')}</FormLabel>
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
                    value={age}
                    error={age?.length > 0 ? false : error}
                    onChange={(e) => { setAge(Number(e.target.value)); setError(false) }}
                    fullWidth
                    placeholder='eg. 35'
                  />
                </Grid>

                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "end" }}>
                  <RoundButton
                    onClick={() => { calcMortgage() }}
                    size={'small'}
                    disableElevation={true}
                    color={'primary'}
                    variant='contained'
                    sx={{ margin: '1.6rem 0 1rem 1rem', height: "2.6rem" }}
                    text={loading || t('mortgage.calculator.form.button')}
                    progress={loading && (
                      <CircularProgress
                        size={20}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: "white"
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5} />
            <Grid item xs={12} md={7}>
              <Typography variant='body2' my={4}><LocalPhone sx={{ fontSize: "14px" }} />{t('mortgage.calculator.form.needhelp')} <a href={'mailto:help@rehomeafrica.com'} target="_blank" rel="noreferrer" style={{ color: "blue" }}>help@rehomeafrica.com</a></Typography>
            </Grid>
          </Grid>
        </Container>

        {/* Eliibility Result */}
        <Backdrop open={openCal} sx={{ bgcolor: alpha('#03254C', .9), zIndex: 20, alignItems: "center" }}>
          <Box sx={{ marginTop: !result?.eligibility ? '6rem' : '' }}>
            <Box sx={{ height: "50%", width: { xs: "20rem", sm: "24rem", lg: "30rem" }, backgroundColor: "#fff" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "500", textAlign: "center", width: "100%" }}>{result?.eligibility ? t('mortgage.calculator.result.eligible') : t('mortgage.calculator.result.noteligible')}</Typography>
                <Box sx={{ width: "10rem", height: "3.5rem", backgroundColor: result?.eligibility ? "primary.main" : "red", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}><span>{result?.eligibility ? <CheckCircle sx={{ fontSize: '2rem' }} color='#fff' /> : <Cancel sx={{ fontSize: '2rem', color: "#fff" }} />}</span></Box>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "500", textAlign: "center", width: "100%" }}>{t('mortgage.calculator.result.monthlypayment')}</Typography>
                <Box sx={{ width: "10rem", height: "3.5rem", bgcolor: "tertiary.main", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}><span>{rate?.preferredCurrency === "GHS" ? <span>&#x20B5; </span> : <span>$ </span>}{result?.monthly_payment}</span></Box>
              </Box>
            </Box>

            {!result?.eligibility ?
              <Box padding='1.5rem' mt={.5} sx={{ height: "50%", bgcolor: "#fff", width: { xs: "20rem", sm: "24rem", lg: "30rem" } }}>
                <Typography sx={{ fontSize: "14px" }}>{t('mortgage.calculator.result.noteligiblereason')}</Typography>
              </Box> : ""}

            <Box padding='1.5rem' mt={.5} sx={{ height: "50%", bgcolor: "#fff", width: { xs: "20rem", sm: "24rem", lg: "30rem" } }}>
              <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>{t('mortgage.calculator.result.disclaimer')}:</Typography>
              <Typography sx={{ fontSize: "14px" }}>{t('mortgage.calculator.result.note')}</Typography>

              <Box mt={2} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "600", fontSize: "14px" }}>{t('mortgage.calculator.result.rate')}: </Typography>
                <span style={{ fontSize: "14px", marginLeft: "5px" }}>{result?.annual_interest * 100}%</span>
              </Box>
            </Box>

            {/* <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <RoundButton
                onClick={() => { }}
                size={'small'}
                disableElevation={true}
                color={'primary'}
                variant='contained'
                sx={{ marginLeft: '0.5rem' }}
                text={t('mortgage.calculator.result.banks')}
              />
            </Box> */}

            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <RoundButton
                onClick={() => contactSpecialist()}
                size={'small'}
                disableElevation={true}
                color={'primary'}
                variant='contained'
                sx={{ marginLeft: '0.5rem' }}
                text={loading || t('mortgage.calculator.result.specialist')}
                progress={loading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: "white"
                    }}
                  />
                )}
              />
            </Box>

            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Button onClick={() => { startOver() }} disableRipple sx={{ textTransform: 'none', color: "#fff" }}
                variant='text' size='small'>{t('mortgage.calculator.result.startover')}
              </Button>
            </Box>
          </Box>
          <IconButton sx={{ position: 'relative', marginTop: '-24rem' }} onClick={() => setOpenCal(false)}>
            <Close color='paper' fontSize='small' />
          </IconButton>
        </Backdrop>

        {/* Login prompt */}
        <Dialog open={loginPrompt} onClose={() => { setLoginPrompt(false) }} fullWidth maxWidth='xs'>
          <DialogContent>
            <IconButton sx={{ position: "absolute", right: "5px", top: "5px" }} onClick={() => setLoginPrompt(false)}><Close /></IconButton>
            <Typography textAlign={"center"}>{t('loginprompt.note1')}</Typography>

            <Box mt={2} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/login')}>
              <PillButton
                text={t('navbar.login')}
                size="small"
                width={{ xs: '100px', sm: '140px', md: '140px', lg: "140px" }}
                borderColor=""
                color="#FFFFFF"
                backgroundColor="#1267B1"
                startIcon={login}
                variant="contained"
              />
            </Box>

            <Typography mt={1} textAlign={"center"}>{t('loginprompt.note2')}</Typography>

            <Box mt={1} sx={{ display: "flex", justifyContent: "center" }} onClick={() => navigate('/signup')}>
              <PillButton
                text={t('navbar.signup')}
                size="small"
                width="140px"
                borderColor="rgba(0, 0, 0, 0.3)"
                color="#000000"
                startIcon={signUp}
                variant="outlined"
              />
            </Box>

            <Typography mt={1} textAlign={"center"}>{t('loginprompt.note5')}</Typography>
          </DialogContent>
        </Dialog>
      </Box>
    </motion.div>
  )
}

export default MortgageCalculator