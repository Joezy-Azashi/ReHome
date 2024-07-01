import { Close, Search } from '@mui/icons-material'
import { Box, Button, Container, Divider, Grid, Radio, InputAdornment, FormControlLabel, RadioGroup, Pagination, TextField, Typography, styled, Hidden, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Finder from '../assets/images/finder.png'
import FinderAgent from '../assets/images/finderRt.png'
import AgentCard from '../components/AgentCard'
import RoundButton from '../components/Buttons/RoundButton'
import Api from '../api/api'
import LoadingPropertyItem from '../components/LoadingPropertyItem'
import { useTranslation } from "react-i18next";
import NoList from '../assets/images/noListing.png'
import { isLoggedIn } from '../services/auth';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'

const pageLimit = 12
const Banner = styled(Box)(({ theme }) => (
    {
        //padding: '5rem 0',
        height: '100%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundImage: `linear-gradient( 180deg, rgba(3,37,76, 60%), rgba(3,37,76, 80%)), url(${Finder})`,
    }
));

const AgentFinder = () => {
    const { t } = useTranslation();
    const [data, setData] = useState()
    const navigate = useNavigate()
    const [pageNumber, setpageNumber] = useState(1);
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const pathname = window.location.pathname;
    const [value, setValue] = React.useState('all');

    const handleChange = (event) => {
        setValue(event.target.value);
        setpageNumber(1)
    };

    const getBrokers = (clear) => {
        setLoading(true)

        let wherequery = { 
            and: [
                { 
                    suspended: false, 
                    deactivated: false 
            }] 
        }

        if(value === 'all'){
            wherequery.and.push({ userType: { inq: ["agent", "developer", "realtor"] }, })
        }

        // where realtor has NAR
        else if(value === 'realtor'){
            wherequery.and.push({ userType: { inq:  ["realtor", "agent"] }})
        }

        // where realtor has NAR
        else if(value === 'agent'){
            wherequery.and.push({ userType: { inq:  ["agent", "realtor"] }, NAR: "" })
        }

        else {
            wherequery.and.push({ userType: { inq: [value] }, })
        }

        if (clear) {

        } else
            if (searchTerm) {
                let pattern = { like: ".*" + searchTerm + ".*", options: "i" };
                wherequery.and.push({
                    or: [
                        { firstName: pattern },
                        { lastName: pattern },
                        { email: pattern },
                    ]
                })
            }

        Api().get('/users/active-agents', {
            params: {
                filter: {
                    limit: pageLimit, skip: (pageNumber - 1) * pageLimit,
                    where: wherequery,
                    include: ['agencies', 'rehomeProperties']
                }
            }
        })
            .then((response) => {
                setData(response?.data)
                setLoading(false)
            })
            .catch((error) => { })

        Api().get('/users/active-agents', {
            params: {
                filter: {
                    where: wherequery
                },
                count: true
            }
        })
            .then((res) => {
                setCount(res?.data?.count)
            })
            .catch((error) => { })
    }

    useEffect(() => {
        getBrokers()
        window.scrollTo({ top: 470, behavior: 'smooth' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, value])

    const clearSearch = () => {
        getBrokers("clear")
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Banner */}
            <Banner>
                <Container maxWidth='xl'>
                    <Grid container spaing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={5}>
                            <Box mt={'5rem'} mb={'3rem'} sx={{ width: '100%', height: 'inherit', textAlign: 'left', }}>
                                <Typography variant='h4' mb={2}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: { xs: '1.8rem', sm: '2.1rem', lg: '2.5rem' },
                                        color: '#fff',
                                    }}>{t('findanagent.banner.maintext')}</Typography>
                                <Divider sx={{
                                    bgcolor: 'primary.main',
                                    height: '5px',
                                    border: 'none',
                                    width: '45%'
                                }} />
                                <Typography mt={3} mb={4} variant='body1' paragraph sx={{ color: '#fff' }}>{t('findanagent.banner.subtext')}</Typography>
                                {
                                    isLoggedIn() ? null :
                                        <RoundButton disableElevation={true} color={'primary'} onClick={() => navigate('/signup')} variant='contained' text={t('findanagent.banner.button')} />
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Banner>

            <Box bgcolor={'#F7F7F7'} padding={'4rem 0'}>
                <Container maxWidth='xl'>
                    {/* clear search & Search */}
                    <Grid container spacing={3} mb={'3rem'}>
                        <Grid item xs={12} md={7} mb={2} sx={{display: "flex", alignItems: "center"}}>
                            <RadioGroup
                                name="controlled-radio-buttons-group"
                                value={value}
                                onChange={(e) => handleChange(e)}
                                row
                            >
                                <FormControlLabel
                                    value="all"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('findanagent.mainpage.all')}
                                />
                                <FormControlLabel
                                    value="realtor"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('findanagent.mainpage.realtor')}
                                />
                                <FormControlLabel
                                    value="developer"
                                    control={
                                        <Radio
                                            size="small"
                                        />
                                    }
                                    label={t('findanagent.mainpage.developer')}
                                />
                            </RadioGroup>
                        </Grid>

                        <Grid item xs={12} md={5} mb={2}>
                            <TextField fullWidth sx={{
                                // width: { xs: '100%', sm: '80%', lg: '35%' },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px'
                                }
                            }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant='outlined'
                                placeholder={t('findanagent.mainpage.searchplaceholder')}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>
                                        {searchTerm.length > 0 && <IconButton size='small' onClick={() => { clearSearch(); setSearchTerm("") }}><Close fontSize='small' /></IconButton>}
                                        <Button
                                            sx={{ margin: '2rem 0', marginRight: '-14px', borderRadius: '50px', textTransform: 'none', width: { xs: '3.5rem', sm: '3.5rem', md: '5rem', lg: '5rem' }, height: '3.5rem', fontWeight: 600 }}
                                            onClick={() => { getBrokers(); setpageNumber(1) }}
                                            variant='contained'
                                            disableElevation
                                        >
                                            <Search sx={{ color: '#fff' }} />
                                        </Button>
                                    </InputAdornment>
                                }} />
                        </Grid>
                    </Grid>

                    {/* Agent List */}
                    <Grid container spacing={3}>
                        {loading ?

                            [...Array(12)].map(ld => {
                                return (
                                    <Grid sx={{ mt: '-3rem' }} item xs={12} sm={6} md={4} lg={3} key={ld}>
                                        <LoadingPropertyItem />
                                    </Grid>
                                )
                            })
                            :
                            data?.length <= 0 ?
                                <Box sx={{ padding: '3rem 5rem', margin: "auto" }}>
                                    <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                    <Typography mt={3} mb={3} textAlign={'center'}>{t('findanagent.mainpage.noagent')}</Typography>
                                </Box>
                                :
                                data?.map((el) => {
                                    return (
                                        <Grid key={el?.id} item xs={12} sm={6} md={4} lg={3}>
                                            <AgentCard el={el} userType={el?.userType} />
                                        </Grid>
                                    )
                                })
                        }
                    </Grid>
                    <Box mt={'4rem'} mb={'4rem'} display='flex' justifyContent={'flex-end'}>
                        {
                            data?.length ?
                                <Pagination sx={{
                                    '& ul': {
                                        marginLeft: 'auto'
                                    }
                                }}
                                    color='primary'
                                    page={pageNumber}
                                    count={Math.ceil(count / pageLimit)}
                                    onChange={(event, value) => setpageNumber(value)}
                                    variant="text"
                                    shape="rounded"
                                />
                                :
                                null
                        }
                    </Box>
                </Container>

                {/* <Box sx={{ padding: '4rem 0' }} textAlign='center' bgcolor={'#fff'}>
                    <Container>
                        <Typography variant='body1' paragraph color={'primary'}>{t('findanagent.mainpage.testimonials.title')}</Typography>
                        <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: '2rem', color: '#03254C' }}>{t('findanagent.mainpage.testimonials.say')}</Typography>

                        <Testimonial
                            name={'Roland O.'}
                            content={t('findanagent.mainpage.testimonials.testimony')}
                        />
                    </Container>
                </Box> */}
            </Box>
        </motion.div>
    )
}

export default AgentFinder