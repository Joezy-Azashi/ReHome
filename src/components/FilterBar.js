import React, { useState, useEffect } from 'react'
import { Box, Button, Card, CardActions, Switch, CardContent, Checkbox, Divider, FormControlLabel, Grid, Hidden, ListItemText, MenuItem, Popover, Slider, styled, TextField, Typography, Drawer, Toolbar, IconButton, ButtonGroup } from '@mui/material'
import { AccountBalanceWalletOutlined, Close, HomeOutlined, ImportExport, RadioButtonChecked, RadioButtonUnchecked, KeyboardArrowDown, KingBedOutlined, PlaceOutlined, Search, Tune, ViewStreamOutlined } from '@mui/icons-material'
import RoundButton from '../components/Buttons/RoundButton'
import { grey } from '@mui/material/colors'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import Api from '../api/api'
import { isMobile } from 'react-device-detect'
import PageLoader from './PageLoader'

const drawerWidth = 340

const FlexWrap = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '.5rem',
    background: '#fff',
    borderRadius: '50px'
}))

const StyledBtn = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    color: '#000',
    '&:hover': {
        background: 'transparent'
    }
}))

const FilterBar = ({
    title,
    type,
    shortlet,
    lng,
    setLng,
    lat,
    setLat,
    location,
    setLocation,
    sliderRadius,
    setSliderRadius,
    amenities,
    setAmenities,
    propertyType,
    setPropertyType,
    setTransactionType,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    sortby,
    setSortby,
    orderby,
    setOrderby,
    getListings,
    setPageNumber,
    getMapData,
    setCords,
    ExContext,
    clearFilter,
    search,
    setSearch
}) => {
    const { t } = useTranslation();

    // const allAmenities = [{ title: 'wifi', description: t('agentdashboard.addlisting.amenities.wifi') }, { title: 'gym', description: t('agentdashboard.addlisting.amenities.gym') }, { title: 'pet_friendly', description: t('agentdashboard.addlisting.amenities.petfriendly') }, { title: 'guest_room', description: t('agentdashboard.addlisting.amenities.guestroom') }, { title: 'play_ground', description: t('agentdashboard.addlisting.amenities.playground') }, { title: 'car_park', description: t('agentdashboard.addlisting.amenities.carpark') }, { title: 'library', description: t('agentdashboard.addlisting.amenities.library') }, { title: 'restaurant', description: t('agentdashboard.addlisting.amenities.restaurant') }, { title: 'bar', description: t('agentdashboard.addlisting.amenities.bar') }, { title: 'bath', description: t('agentdashboard.addlisting.amenities.bath') }]
    const allSort = [{ title: t('filter.sort.mostrecent'), value: "recent" }, { title: t('filter.sort.popularity'), value: "popularity" }, { title: t('filter.sort.price'), value: "price" }, { title: t('filter.sort.size'), value: "size" }]
    const salePropertyType = [{ title: t('filter.propertytype.apartments'), description: "apartment" }, { title: t('filter.propertytype.houses'), description: "house" }]

    const navigate = useNavigate()
    const path = useLocation().pathname.split('/')[1]
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState()
    const [isCheckAllPropertyType, setIsCheckAllPropertyType] = React.useState(false);
    const open = Boolean(anchorEl);
    const [orderState, setOrderState] = React.useState(false)
    const [constantLocation, setConstantLocation] = useState([])
    const [loading, setLoading] = useState(false)
    const [openMobileDrawer, setOpenMobileDrawer] = useState(false)
    const [allAmenities, setAllAmenities] = useState()
    const [sliderValue, setSliderValue] = useState([minPrice, maxPrice])
    const [sliderSize, setSliderSize] = useState([minSize, maxSize])
    const [searchLocation, setSearchLocation] = useState("")
    const [showingFilter, setShowingFilter] = useState("all")

    // reducer State
    // const [filterInput, filterDispatch] = useReducer(filterReducer, filterState)

    const handleClick = (e, val) => {
        setAnchorEl(e.currentTarget)
        setFilter(val)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSliderChange = (event, newValue) => {
        // filterDispatch({ type: 'BUDGET', payload: newValue })
        setSliderValue([newValue[0], newValue[1]])
        setMinPrice(event.target.value[0])
        setMaxPrice(event.target.value[1])

    };
    const handleSqFeetChange = (event, newValue) => {
        // filterDispatch({ type: 'SQFEET', payload: newValue })
        setSliderSize([newValue[0], newValue[1]])
        setMinSize(event.target.value[0])
        setMaxSize(event.target.value[1])
    };

    const handleChange = (val) => {
        setCords([])
        if (val === 'sale') {
            setTransactionType("sale")
            clearFilter()
            handleClose()
            navigate('/buy');
            setPageNumber(1)
        }
        if (val === 'rent') {
            setTransactionType("rent")
            clearFilter()
            handleClose()
            navigate('/rent');
            setPageNumber(1)
        } if (val === 'off-plan') {
            clearFilter()
            handleClose()
            navigate('/off-plan')
            setPageNumber(1)
        }
    }

    const handleLocationChange = (el) => {
        setLng(el?.longitude)
        setLat(el?.latitude)
        setSearch(el.label)
        setLocation(el.label)
        setConstantLocation([])
    };

    const getPropertyType = (e) => {
        if (e.target.checked) {
            setPropertyType((prevState) => [...prevState, e.target.value])
        } else {
            setPropertyType(propertyType.filter(item => item !== e.target.value));
        }
    }

    const handleSelectAllPropertyType = (e) => {
        setIsCheckAllPropertyType(!isCheckAllPropertyType)
        setPropertyType(salePropertyType.map(li => li.description));
        if (isCheckAllPropertyType) {
            setPropertyType([]);
        }
    };

    const getAmenities = (e) => {
        if (e.target.checked) {
            setAmenities((prevState) => [...prevState, e.target.value])
        } else {
            setAmenities(amenities.filter(item => item !== e.target.value));
        }
    }

    const getSort = (e) => {
        if (e.target.checked) {
            setSortby((prev) => [...prev, e.target.value])
        } else {
            setSortby(sortby.filter(item => item !== e.target.value));
        }
    }

    const filterLocations = (search_term) => {
        setSearch(search_term);
        if (!search_term) {
            setConstantLocation([])
            return
        }
        setLoading(true)
        let wherequery = { active: true }
        if (search_term) {
            let pattern = { like: "^" + search_term + ".*", options: "i" };
            wherequery.label = pattern
        }

        Api().get('/constants/atlas/locations', {
            params: {
                filter: {
                    text: search_term,
                    limit: 10
                }
            }
        })
            .then((res) => {
                setConstantLocation(res?.data)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }

    // useEffect(() => {
    //     //get locations

       

    // }, [search])

    useEffect(() => {
        //get Amenities
        Api().get('constants/default_amenities')
            .then((res) => {
                setAllAmenities(res?.data)
            })
    }, [])

    const handleOrderBy = () => {
        setOrderState(!orderState)
        if (orderState) {
            setOrderby('asc')
        } else {
            setOrderby('desc')
        }
    }

    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                setPageNumber(1);
                getMapData()
                getListings();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [lng, lat, sliderRadius, propertyType, bedrooms, bathrooms, minPrice, maxPrice, sortby, orderby, minSize, maxSize, amenities]);

    return (
        <>
            <Hidden mdDown>
                <FlexWrap>
                    <Box display={'flex'} padding='.6rem' flex={1} justifyContent='space-evenly' >
                        <Hidden smDown>
                            <StyledBtn onClick={(e) => handleClick(e, 'location')} disableRipple startIcon={<PlaceOutlined fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.location.title')}</StyledBtn>
                            <Divider orientation='vertical' flexItem />
                            <StyledBtn onClick={(e) => handleClick(e, 'property')} disableRipple startIcon={<ViewStreamOutlined fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.propertytype.title')}</StyledBtn>
                            <Divider orientation='vertical' flexItem />
                        </Hidden>
                        <Hidden mdDown>
                            <StyledBtn onClick={(e) => handleClick(e, 'bedbath')} disableRipple startIcon={<KingBedOutlined fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.bedbath.title')}</StyledBtn>
                            <Divider orientation='vertical' flexItem />
                            <StyledBtn onClick={(e) => handleClick(e, 'budget')} disableRipple startIcon={<AccountBalanceWalletOutlined fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.budget.title')}</StyledBtn>
                            <Divider orientation='vertical' flexItem />
                        </Hidden>
                        <Hidden lgDown>
                            <StyledBtn onClick={(e) => handleClick(e, 'sort')} disableRipple startIcon={<ImportExport fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.sort.title')}</StyledBtn>
                            <Divider orientation='vertical' flexItem />
                        </Hidden>
                        <StyledBtn onClick={(e) => handleClick(e, 'more')} disableRipple startIcon={<Tune fontSize='small' />} endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.more.title')}</StyledBtn>
                    </Box>
                    <RoundButton onClick={() => { getListings(); setPageNumber(1); getMapData() }} sx={{ padding: '.5rem 2rem', height: 'auto', width: { xs: '3.5rem', sm: '3.5rem', md: '7rem', lg: '7rem' } }} disableElevation variant={'contained'} color={'primary'} text={<Search color='paper' fontSize='medium' />} />
                </FlexWrap>
            </Hidden>
            <Hidden mdUp>
                <Box sx={{  overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <div className="flex gap-2" style={{ minWidth: '100%' }}>
                        <div style={{ minWidth: '110px' }}><RoundButton onClick={(e) => {setShowingFilter('location'); setOpenMobileDrawer(true)}} size={'small'} disableElevation text={t('filter.location.title')} variant='outlined' sx={{backgroundColor: 'secondary.main', color: 'white'}}/></div>
                        <div style={{ minWidth: '150px' }}><RoundButton onClick={(e) => {setShowingFilter('property_type'); setOpenMobileDrawer(true)}} size={'small'} disableElevation text={t('filter.propertytype.title')}  variant='outlined' sx={{backgroundColor: 'secondary.main', color: 'white'}}/></div>
                        <div style={{ minWidth: '130px' }}><RoundButton onClick={(e) => {setShowingFilter('bed_bath'); setOpenMobileDrawer(true)}} size={'small'} disableElevation text={t('filter.bedbath.title')}  variant='outlined' sx={{backgroundColor: 'secondary.main', color: 'white'}}/></div>
                        {/* <div style={{ minWidth: '100px' }}><RoundButton onClick={(e) => {setShowingFilter('budget'); setOpenMobileDrawer(true)}} size={'small'} disableElevation text={t('filter.budget.title')}  variant='outlined' /></div> */}
                        <div style={{ minWidth: '90px' }}><RoundButton onClick={(e) => {setShowingFilter('all'); setOpenMobileDrawer(true)}} size={'small'} disableElevation text={t('filter.more.title')}  variant='outlined' sx={{backgroundColor: '#1267B1', color: 'white'}} /></div>
                        {/* Add more buttons with the same minWidth style */}
                    </div>
                </Box>
            </Hidden>

            <Popover open={open} anchorEl={anchorEl} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                transformOrigin={{ vertical: 'top', horizontal: 'center', }}
            >
                <Card variant='outlined'>

                    {
                        filter === 'type' &&
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '.5rem', pb: '.5rem !important', width: 'auto' }}>
                            {
                                [{ title: t('filter.transactiontype.forsale'), val: "sale" }, { title: t('filter.transactiontype.forrent'), val: "rent" }, { title: t('filter.transactiontype.offplan'), val: "off-plan" }].map((el, index) => {
                                    return (
                                        <MenuItem key={index} value={el?.val} sx={{
                                            borderRadius: '5px',
                                            color: path === 'rent' || path === 'buy' ? 'primary.main' : 'black',
                                            '&:hover': {
                                                bgcolor: grey[200],
                                                color: 'ButtonText'
                                            }
                                        }} onClick={() => handleChange(el.val)}>{<Typography variant='body2'>{el.title}</Typography>} </MenuItem>
                                    )
                                })
                            }
                        </CardContent>
                    }

                    {
                        filter === 'location' &&
                        <>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                <TextField sx={{ mb: 1 }} value={search} fullWidth autoFocus variant='outlined' size='small' placeholder={t('filter.search')} onChange={(e) => { filterLocations(e.target.value) }} />

                                {
                                    loading ? <Box sx={{ margin: ".7rem 0" }}><PageLoader /></Box> :
                                        constantLocation.filter((el) => el?.label?.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((el, index) => {
                                            return (
                                                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} mb={2} onClick={() => handleLocationChange(el)}>
                                                    {lng === el?.longitude && lat === el?.latitude ? <RadioButtonChecked color="primary" sx={{ fontSize: "1.3rem", marginRight: ".5rem" }} /> : <RadioButtonUnchecked sx={{ fontSize: "1.3rem", marginRight: ".5rem" }} />}
                                                    <Typography>{el?.label}{el?.country ? `, ${t('agentdashboard.addlisting.tab1.country.'+el?.country)}` : ''}</Typography>
                                                </Box>
                                            )
                                        })
                                }

                                <Divider />
                            </CardContent>
                            <CardActions sx={{ padding: '1.5rem', marginTop: '-1.5rem' }}>
                                <Slider
                                    defaultValue={sliderRadius}
                                    valueLabelDisplay="auto"
                                    step={5}
                                    marks
                                    min={5}
                                    max={100}
                                    onChange={(e) => setSliderRadius(e.target.value)}
                                />
                            </CardActions>
                            <Typography sx={{ textAlign: "center" }} mb={1.5} mt={-2}>{t('filter.location.radius')}: {sliderRadius}KM</Typography>
                        </>
                    }
                    {
                        filter === 'property' &&
                        <>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    type === 'rent' &&
                                    salePropertyType?.map((el, index) => {
                                        return (
                                            <FormControlLabel key={index}
                                                control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                                label={<Typography variant='body2'>{el?.title}</Typography>} />
                                        )
                                    })

                                }
                                {
                                    type === 'sale' &&
                                    salePropertyType?.map((el, index) => {
                                        return (
                                            <FormControlLabel key={index}
                                                control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                                label={<Typography variant='body2'>{el?.title}</Typography>} />
                                        )
                                    })

                                }
                                {
                                    type === 'development' &&
                                    salePropertyType?.map((el, index) => {
                                        return (
                                            <FormControlLabel key={index}
                                                control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                                label={<Typography variant='body2'>{el?.title}</Typography>} />
                                        )
                                    })

                                }
                            </CardContent>
                            <CardActions sx={{ padding: '1rem', marginTop: '-1.5rem' }}>
                                <RoundButton onClick={(e) => handleSelectAllPropertyType(e)} size={'small'} fullWidth disableElevation text={t('filter.selectall')} variant='contained' color={'tertiary'} sx={{ color: '#fff' }} />
                            </CardActions>
                        </>
                    }
                    {
                        filter === 'bedbath' &&
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '0 !important', width: 'auto' }}>
                            <Box bgcolor={grey[200]} sx={{ padding: '15px' }}>
                                <Typography variant='body2' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('filter.bedbath.bedrooms')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '1rem' }}>
                                {
                                    [0, 1, 2, 3, 4].map((el, index) => {
                                        return (
                                            <Button size='small' onClick={() => setBedrooms(el)}
                                                variant={bedrooms === el ? 'contained' : 'outlined'}
                                                sx={{ borderRadius: '50px', width: '2rem', height: '2.5rem', textTransform: 'none' }} key={index}>{el === 0 ? t('filter.bedbath.any') : el}{el === 4 ? '+' : ""}</Button>
                                        )
                                    })
                                }

                            </Box>
                            <Box bgcolor={grey[200]} sx={{ padding: '15px' }}>
                                <Typography variant='body2' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('filter.bedbath.bath')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '1rem' }}>
                                {
                                    [0, 1, 2, 3, 4].map((el, index) => {
                                        return (
                                            <Button size='small' onClick={() => setBathrooms(el)}
                                                variant={bathrooms === el ? 'contained' : 'outlined'}
                                                sx={{ borderRadius: '50px', width: '1rem', height: '2.5rem', textTransform: 'none' }} key={index}>{el === 0 ? "Any" : el}{el === 4 ? '+' : null}</Button>
                                        )
                                    })
                                }

                            </Box>
                        </CardContent>
                    }
                    {
                        filter === 'budget' &&
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '0 !important', width: '18rem' }}>
                            <Box bgcolor={grey[200]} sx={{ padding: '15px' }}>
                                <Typography variant='body2' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('filter.budget.heading2')}</Typography>
                            </Box>
                            <Box sx={{ padding: '1rem 2rem' }}>
                                <Typography mb={1} mt={1} textAlign={'center'} variant='body2'>{ExContext?.preferredCurrency} {minPrice} - {ExContext?.preferredCurrency} {maxPrice}</Typography>
                                <Slider marks color='primary' disableSwap step={type === 'rent' ? 1000 : 25000} sx={{ mb: '-1rem' }}
                                    value={sliderValue} min={0} max={type === 'rent' ? 100000 : 10000000} onChange={handleSliderChange} />
                            </Box>
                            <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', padding: '1rem 1.5rem' }}>
                                <TextField size='small' value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type={'number'} variant='outlined' label={t('filter.budget.minprice')} />
                                <TextField size='small' value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type={'number'} variant='outlined' label={t('filter.budget.maxprice')} />
                            </Box>
                        </CardContent>
                    }
                    {
                        filter === 'sort' &&
                        <>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    allSort.map((el, index) => {
                                        return (
                                            <FormControlLabel key={index} control={<Checkbox value={el?.value} checked={sortby.includes(el?.value)} onChange={getSort} size='small' sx={{ fontSize: '1.2rem' }} />} label={<Typography variant='body2'>{el.title}</Typography>} />
                                        )
                                    })
                                }
                            </CardContent>
                            <CardActions sx={{ padding: '1rem', marginTop: '-1.5rem' }}>
                                <RoundButton onClick={handleOrderBy} size={'small'} fullWidth disableElevation text={t(!orderState ? 'filter.sort.ascending' : 'filter.sort.descending')} variant='contained' color={'tertiary'} sx={{ color: '#fff' }} />
                            </CardActions>
                        </>
                    }
                    {
                        filter === 'more' &&
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '0 !important', width: '21rem' }}>
                            <Box bgcolor={grey[200]} sx={{ padding: '15px' }}>
                                <Typography variant='body2' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('filter.more.heading1')}</Typography>
                            </Box>
                            <Box sx={{ padding: '1rem 2rem' }}>
                                <Typography mb={1} mt={1} textAlign={'center'} variant='body2'>{minSize} - {maxSize}</Typography>
                                <Slider marks color='primary' disableSwap step={500} sx={{ mb: '-1rem' }}
                                    value={sliderSize} min={0} max={10000} onChange={handleSqFeetChange} />
                            </Box>
                            <Box bgcolor={grey[200]} sx={{ padding: '15px' }}>
                                <Typography variant='body2' textAlign={'center'} sx={{ fontWeight: 600 }}>{t('filter.more.select')}</Typography>
                            </Box>
                            <Box>
                                <Typography></Typography>
                            </Box>
                            <Box sx={{ padding: '1rem 1.5rem' }}>
                                <Grid container spacing={1}>
                                    {
                                        allAmenities?.map((el, index) => {
                                            return (
                                                <Grid key={index} item sm={6}>
                                                    <FlexWrap>
                                                        <Switch color='primary' value={el.key} checked={amenities?.some((ed) => ed === el?.key)} onChange={(e) => getAmenities(e)} />
                                                        <ListItemText><Typography variant='body2'>{el.label}</Typography></ListItemText>
                                                    </FlexWrap>

                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Box>
                            {/* <Button sx={{ textTransform: 'none', mb: '1rem' }} size='small' endIcon={<KeyboardArrowDown fontSize='small' />}>{t('filter.more.title')}</Button> */}
                        </CardContent>
                    }
                </Card>
            </Popover>

            {/* Mobile Drawer */}
            <Drawer anchor='right' sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, },
            }} open={openMobileDrawer} classes={{ paper: drawerWidth }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, right: '-3%', background: '#fff', zIndex: 99 }}>
                    <IconButton onClick={() => setOpenMobileDrawer(false)}><Close fontSize='small' /></IconButton>
                    <Button variant='contained' color='primary' disableElevation sx={{ textTransform: 'none', borderRadius: '50px' }} onClick={() => { getListings(); setPageNumber(1); getMapData(); setOpenMobileDrawer(false) }}>{t('filter.search2')}</Button>
                </Toolbar>
                {/* Location Filter */}
                {["all","location"].includes(showingFilter) && <>
                    <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                        <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.location.title')}</Typography>
                        <TextField sx={{ mb: 1 }} value={search} fullWidth autoFocus variant='outlined' size='small' placeholder={t('filter.search')} onChange={(e) => { filterLocations(e.target.value) }} />

                        {
                            loading ? <Box sx={{ margin: ".7rem 0" }}><PageLoader /></Box> :
                                constantLocation.filter((el) => el?.label?.toLocaleLowerCase().includes(search.toLocaleLowerCase())).map((el, index) => {
                                    return (
                                        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} mb={2} onClick={() => handleLocationChange(el)}>
                                            {lng === el?.longitude && lat === el?.latitude ? <RadioButtonChecked color="primary" sx={{ fontSize: "1.3rem", marginRight: ".5rem" }} /> : <RadioButtonUnchecked sx={{ fontSize: "1.3rem", marginRight: ".5rem" }} />}
                                            <Typography>{el?.label}</Typography>
                                        </Box>
                                    )
                                })
                        }

                        <Slider
                            defaultValue={sliderRadius}
                            valueLabelDisplay="auto"
                            step={5}
                            marks
                            min={5}
                            max={100}
                            onChange={(e) => setSliderRadius(e.target.value)}
                        />

                        <Typography sx={{ textAlign: "center" }} my={1.5}>{t('filter.location.radius')}: {sliderRadius}KM</Typography>
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Property type Filter */}
                {["all","property_type"].includes(showingFilter) && <>
                    <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                        <div className='flex justify-between items-center'>
                            <Typography variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.propertytype.title')}</Typography>
                            <span className='flex items-center'>
                                <Checkbox onChange={(e) => handleSelectAllPropertyType(e)} size='small' sx={{ fontSize: '1.2rem' }} />
                                <Typography variant='body2'>{t('filter.selectall')}</Typography>
                                {/* <RoundButton onClick={(e) => handleSelectAllPropertyType(e)} size={'small'} fullWidth disableElevation text={t('filter.selectall')} variant='contained' color={'tertiary'} sx={{ color: '#fff' }} /> */}
                            </span>
                        </div>
                    
                        {
                            type === 'rent' &&
                            salePropertyType.map((el, index) => {
                                return (
                                    <FormControlLabel key={index} sx={{ width: '100%' }}
                                        control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                        label={<Typography variant='body2'>{el?.title}</Typography>} />
                                )
                            })

                        }
                        {
                            type === 'sale' &&
                            salePropertyType.map((el, index) => {
                                return (
                                    <FormControlLabel key={index} sx={{ width: '100%' }}
                                        control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                        label={<Typography variant='body2'>{el?.title}</Typography>} />
                                )
                            })

                        }
                        {
                            type === 'development' &&
                            salePropertyType.map((el, index) => {
                                return (
                                    <FormControlLabel key={index} sx={{ width: '100%' }}
                                        control={<Checkbox checked={propertyType.includes(el.description)} value={el?.description} onChange={getPropertyType} size='small' sx={{ fontSize: '1.2rem' }} />}
                                        label={<Typography variant='body2'>{el?.title}</Typography>} />
                                )
                            })

                        }
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Bed/Bathroom Filter */}
                {["all","bed_bath"].includes(showingFilter) && <>
                    <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                        <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.bedbath.bedrooms')}</Typography>
                        <ButtonGroup variant='outlined' fullWidth>
                            {
                                [0, 1, 2, 3, 4].map((el, index) => {
                                    return (
                                        <Button size='small' onClick={() => setBedrooms(el)}
                                            variant={bedrooms === el ? 'contained' : 'outlined'} fullWidth disableElevation
                                            sx={{ borderRadius: '50px', height: '2.5rem', textTransform: 'none' }} key={index}>{el === 0 ? "Any" : el}{el === '4' ? '+' : null}</Button>
                                    )
                                })
                            }
                        </ButtonGroup>
                        <Typography mt={2} mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.bedbath.bath')}</Typography>
                        <ButtonGroup variant='outlined' fullWidth>
                            {
                                [0, 1, 2, 3, 4].map((el, index) => {
                                    return (
                                        <Button size='small' onClick={() => setBathrooms(el)}
                                            variant={bathrooms === el ? 'contained' : 'outlined'} fullWidth disableElevation
                                            sx={{ borderRadius: '50px', height: '2.5rem', textTransform: 'none' }} key={index}>{el === 0 ? "Any" : el}{el === '4' ? '+' : null}</Button>
                                    )
                                })
                            }
                        </ButtonGroup>
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Budget Filter */}
                {["all","budget"].includes(showingFilter) && 
                <>
                    <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                        <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.budget.heading2')}</Typography>
                        <Box mb={2}>
                            <Slider marks color='primary' disableSwap step={25000} sx={{ mt: '-5px' }}
                                value={sliderValue} min={0} max={10000000} onChange={handleSliderChange} />
                        </Box>
                        <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem' }}>
                            <TextField size='small' value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type={'number'} variant='outlined' label={t('filter.budget.minprice')} />
                            <TextField size='small' value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type={'number'} variant='outlined' label={t('filter.budget.maxprice')} />
                        </Box>
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Size Filter */}
                {["all","size"].includes(showingFilter) && 
                <>
                    <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                        <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.more.heading1')}</Typography>
                        <Box>
                            <Typography mb={1} mt={1} textAlign={'center'} variant='body2'>{minSize} - {maxSize}</Typography>
                            <Slider marks color='primary' disableSwap step={500} sx={{ mb: '1rem' }}
                                value={sliderSize} min={0} max={10000} onChange={handleSqFeetChange} />
                        </Box>
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Amenities Filter */}
                {["all","amenities"].includes(showingFilter) && <>
                    <Box sx={{ padding: '1rem 1.5rem' }}>
                        <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.more.select')}</Typography>
                        <Grid container spacing={1}>
                            {
                                allAmenities?.map((el, index) => {
                                    return (
                                        <Grid key={index} item xs={12}>
                                            <FlexWrap>
                                                <Switch color='primary' value={el.key} checked={amenities?.some((ed) => ed === el?.key)} onChange={(e) => getAmenities(e)} />
                                                <ListItemText><Typography variant='body2'>{el.label}</Typography></ListItemText>
                                            </FlexWrap>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>
                    <Divider sx={{ my: '10px' }} />
                </>}
                {/* Sort Filter */}
                <Box sx={{ width: '100%', padding: '1rem 1.5rem' }}>
                    <Typography mb={1} variant='h6' sx={{ fontSize: '1.1rem' }}>{t('filter.sort.title')}</Typography>
                    {
                        allSort.map((el, index) => {
                            return (
                                <FormControlLabel key={index} sx={{ width: '100%' }}
                                    control={<Checkbox value={el.value} onChange={getSort} size='small' sx={{ fontSize: '1.2rem' }} />} label={<Typography variant='body2'>{el.title}</Typography>} />
                            )
                        })
                    }
                </Box>

            </Drawer>

        </>
    )
}

export default FilterBar