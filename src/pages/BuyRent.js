import { Box, Button, ButtonGroup, Container, Grid, Hidden, Pagination, Skeleton, styled, Typography } from '@mui/material'
import FilterBar from '../components/FilterBar'
import PropertyItem from '../components/PropertyItem'
import { Place, ViewModule, Map, List, Close } from '@mui/icons-material'
import { useState, useEffect, useContext } from 'react'
import LoadingPropertyItem from '../components/LoadingPropertyItem'
import NoImage from '../assets/images/no-image.jpg'
import mapboxgl from 'mapbox-gl'
import Api from '../api/api'
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import NoList from '../assets/images/noListing.png'
import bed from "../assets/images/bed.png"
import shower from "../assets/images/shower.png"
import RateContext from '../contexts/rateContext'
import { isMobile } from 'react-device-detect';
import { isLoggedIn } from '../services/auth'
import { useSnackbar } from 'notistack';
import { motion } from "framer-motion";
import * as turf from "@turf/turf";
import ReactGA from 'react-ga4'

import AddCustomerRequest from '../pages/admin/AddCustomerRequest';
import RoundButton from '../components/Buttons/RoundButton'

const FilterWrap = styled(Box)(({ theme }) => ({
    background: theme.palette.secondary.main,
    padding: '1rem 0',
    [theme.breakpoints.down('md')]: {
        padding: '1rem 0',
    },
    position: 'sticky',
    top: '75px',
    zIndex: 99,
    width: '100%',
}))

const pageLimit = 20

const BuyRent = ({ type, shortlet }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const loc = useLocation()
    const ExContext = useContext(RateContext);
    const pathname = window.location.pathname

    const [view, setView] = useState('map')
    const [loading, setLoading] = useState(false)
    const [properties, setProperties] = useState([])
    const [recommendedProperties, setRecommendedProperties] = useState([])
    const [lng, setLng] = useState(-0.2);
    const [lat, setLat] = useState(5.55);
    const [sliderRadius, setSliderRadius] = useState(25)
    const [pageNumber, setPageNumber] = useState(1);
    const [count, setCount] = useState(1)
    
    const [location, setLocation] = useState(loc?.state?.search ? [loc?.state?.search] : [])
    const [amenities, setAmenities] = useState([])
    const [propertyType, setPropertyType] = useState([])
    const [transactionType, setTransactionType] = useState()
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [minSize, setMinSize] = useState(0)
    const [maxSize, setMaxSize] = useState(10000)
    const [currency, setCurrency] = useState(ExContext?.preferredCurrency)
    const [sortby, setSortby] = useState([])
    const [orderby, setOrderby] = useState("asc")
    const [cords, setCords] = useState([])
    const [openAddCustomerRequest, setOpenAddCustomerRequest] = useState(false)
    const [notSearched, setNotSearched] = useState(true)

    const [search, setSearch] = useState("")

    
    const toggleView = (val) => {
        setView(val)
    }

    const toSingleProperty = (feature) => {
        navigate(`/listing/${feature?.id}/details`)
    }

    useEffect(() => {
        setView('list')
        // if(isMobile){
        //     setView('list')
        // }
    },[])


    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 6
        });

        var center = [lng, lat];
        var radius = sliderRadius;
        var options = { steps: 10, units: 'kilometers', properties: { foo: 'bar' } };
        var circle = turf.circle(center, radius, options);

        //addToMap
        var addToMap = [turf.point(center), circle]

        map.on('style.load', function (e) {
            let _center = turf.point([
                loc?.state?.coordinates?.lng !== undefined ? loc?.state?.coordinates?.lng : lng,
                loc?.state?.coordinates?.lat !== undefined ? loc?.state?.coordinates?.lat : lat]);
            let _radius = sliderRadius;
            let _options = {
                steps: 80,
                units: 'kilometers' // or "mile"
            };

            let _circle = turf.circle(_center, _radius, _options);

            map.addSource("circleData", {
                type: "geojson",
                data: _circle,
            });

            map.addLayer({
                id: "circle-fill",
                type: "fill",
                source: "circleData",
                paint: {
                    "fill-color": "#03254C",
                    "fill-opacity": 0.1,
                },
            });
        });

        //array for holding points - to be used in getting bounds
        let points = []

        // add markers to map
        for (const feature of cords) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = pathname === '/buy' ? 'buymarker' : 'rentmarker';

            // make a marker for each feature and add to the map
            const marker = new mapboxgl.Marker(el).setLngLat(feature?.features[0]?.geometry?.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(`
                        <div><img src=${feature?.features[0]?.image === undefined ? NoImage : feature?.features[0]?.image} alt="image"/></div>

                        <div style="margin-top: 3px">${ExContext.convert(feature?.features[0]?.currency, feature?.features[0]?.price) < 1 ? "" : ExContext?.preferredCurrency} ${ExContext.convert(feature?.features[0]?.currency, feature?.features[0]?.price) < 1 ? t('findanagent.singleagent.contactagentforprice') : (ExContext.convert(feature?.features[0]?.currency, feature?.features[0]?.price))?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>

                        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 5px">
                            <div style="display: flex; align-items: center">
                                <img style="width: 20px; height: 15px; margin-right: 4px" src=${bed} alt="bed"/>
                                <Typography variant='body2' >${feature?.features[0]?.bedrooms === undefined ? '-' : feature?.features[0]?.bedrooms}</Typography>
                            </div>
                            <div style="display: flex; align-items: center">
                                <img style="width: 20px; height: 15px; margin-right: 4px" src=${shower} alt="bed"/>
                                <Typography variant='body2' >${feature?.features[0]?.bathrooms === undefined ? '-' : feature?.features[0]?.bathrooms}</Typography>
                            </div>
                        </div>
                        `)
                )
                .addTo(map);
            const markerDiv = marker.getElement();

            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            markerDiv.addEventListener('click', () => toSingleProperty(feature?.features[0]));

            //adding array of markers
            points?.push(feature?.features[0]?.geometry?.coordinates)
        }

        map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());

        //setting the map boundary around the markers
        if (points?.length > 0) {
            var bounds = points?.reduce(function (bounds, coord) {
                return bounds?.extend(coord);
            }, new mapboxgl.LngLatBounds(points[0], points[0]));

            //with bounds fit the map
            try{
                if (bounds) {
                    map.fitBounds(bounds, {
                        padding: 100
                    });
                }
            }catch(e){

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cords, ExContext.preferredCurrency, view, pathname])

    const clearFilter = () => {
        // setLocation([])
        setAmenities([])
        setPropertyType([])
        setBedrooms(0)
        setMinPrice(0)
        setMinPrice(0)
        setMaxPrice(0)
        setMinSize(0)
        setMaxSize(10000)
        setSortby(["popularity"])
        setOrderby("asc")
    }

    useEffect(() => {
        clearFilter()
    }, [transactionType, pathname])

    const getListings = async () => {
        try{
            const searchData = {
                locations: [],
                amenities: amenities,
                propertyTypes: propertyType,
                isShortlet: shortlet,
                transactionTypes: [pathname === '/buy' ? "sale" : "rent"],
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                gps: {
                    gpsPoint: {
                        lon: Number(loc?.state?.coordinates?.lng !== undefined ? [loc?.state?.coordinates?.lng] : lng),
                        lat: Number(loc?.state?.coordinates?.lat !== undefined ? [loc?.state?.coordinates?.lat] : lat)
                    }, distance: sliderRadius
                },
                priceRange: { min: minPrice, max: maxPrice, currency: ExContext?.preferredCurrency || 'GHS' },
                sizeRange: { min: minSize, max: maxSize },
                sortBy: sortby,
                orderBy: orderby,
                skip: (pageNumber - 1) * pageLimit,
                limit: pageLimit
            }
            let search_term = loc?.state?.search ?? search;
            let data = [];
            let recommended_data = [];
            let res = null;
    
            setLoading(true)
    
            // fetch with search_term i.e. location
            if(search_term){
                res = await Api().get('/rehome-properties/search', { params: { filter: JSON.stringify({...searchData, locations: [search_term]}) } });
                data = res?.data?.body;  
                data = data
                    .sort((a,b) => a._source.geoAddress === search_term ? -1 : b._source.geoAddress === search_term ? 1 : 0)
            // fetch without search_term
               }else{
                res = await Api().get('/rehome-properties/search', { params: { filter: JSON.stringify(searchData) } });
                data = res.data.body;
            }
    
            // Set total count of record
            setCount(res?.data?.total_count)
    
            // if records length isnt as big as current page max
            if((searchData.skip + searchData.limit) >= res?.data?.total_count){
                // fetch close properties to location
                if(search_term){
                    res = await Api().get('/rehome-properties/search', { params: { filter: JSON.stringify(searchData) } });
                    recommended_data = res.data.body;
                    // filter out search_term properties because they are already added at the top
                    recommended_data = recommended_data.filter(rd => !data.map(d=>d._id).includes(rd._id));
                }
            }
    
    
            setProperties(data)
            setRecommendedProperties(recommended_data)
            setLoading(false)
            setNotSearched(false)
            window.history.replaceState({}, document.title)
            if(loc?.state?.coordinates){
                setLng(loc?.state?.coordinates?.lng)
                setLat(loc?.state?.coordinates?.lat)
                setSearch(loc?.state?.search)
                loc.state.coordinates = null;
                loc.state.search = null;
            }
    
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{setNotSearched(true)},[type,location, propertyType, bedrooms,bathrooms,sortby,minPrice, maxPrice])

    useEffect(() => {
        getListings()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, transactionType, pathname])

    const getMapData = () => {
        const searchData = {
            locations: [],
            amenities: amenities,
            isShortlet: shortlet,
            propertyTypes: propertyType,
            transactionTypes: [pathname === '/buy' ? "sale" : "rent"],
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            gps: {
                gpsPoint: {
                    lon: Number(loc?.state?.coordinates?.lng !== undefined ? [loc?.state?.coordinates?.lng] : lng),
                    lat: Number(loc?.state?.coordinates?.lat !== undefined ? [loc?.state?.coordinates?.lat] : lat)
                }, distance: sliderRadius
            },
            priceRange: { min: minPrice, max: maxPrice, currency: ExContext?.preferredCurrency || 'GHS' },
            sizeRange: { min: minSize, max: maxSize },
            sortBy: sortby,
            orderBy: orderby,
            skip: 0,
            limit: 200
        }
        let search_term = loc?.state?.search ?? search;
        if(search_term){
            searchData.locations = [search_term];
        }
        setCords([])

        Api().get('rehome-properties/search/mini', { params: { filter: JSON.stringify(searchData) } })
            .then((res) => {
                // eslint-disable-next-line
                res?.data?.body.map((item) => {
                    const data = item?._source
                    setCords((prev) => [...prev, {
                        features: [
                            {
                                id: data?.id,
                                image: data?.pictures[0],
                                currency: data?.currency,
                                price: data?.price,
                                bathrooms: data?.bathrooms,
                                bedrooms: data?.bedrooms,
                                sponsored: data?.sponsored,
                                geometry: {
                                    coordinates: [data?.gpsLocation?.lon, data?.gpsLocation?.lat]
                                }
                            }
                        ]
                    }])
                })
            })
    }

    useEffect(() => {
        getMapData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    const [user, setUser] = useState()
    const [load, setLoad] = useState(false)
    const [favs, setFavs] = useState([])
    const { enqueueSnackbar } = useSnackbar();

    const getUserInfo = () => {
        Api().get('/me')
            .then((res) => {
                setUser(res?.data)
                setFavs(res?.data?.wishlist?.rehomePropertyIds)
            })
    }

    useEffect(() => {
        getUserInfo()
        setPageNumber(1)
    }, [pathname])

    // Add to wishlist
    const toggleWishlist = (e, id) => {
        e.preventDefault()
        const exists = user?.wishlist?.rehomePropertyIds.includes(id)

        if (isLoggedIn()) {
            if (exists) {
                const newArray = user?.wishlist?.rehomePropertyIds.filter((item) => item !== id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: newArray })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.removed'), { variant: 'success' });
                        setFavs(favs.filter(item => item !== id));
                        getUserInfo()
                    })
            } else {
                user?.wishlist?.rehomePropertyIds.push(id)

                setLoad(true)
                Api().patch(`wishlists/${user?.wishlist?.id}`, { rehomePropertyIds: user?.wishlist?.rehomePropertyIds })
                    .then((res) => {
                        setLoad(false)
                        enqueueSnackbar(t('dashboard.wishlist.added'), { variant: 'success' });
                        setFavs((prevState) => [...prevState, id])
                    })
            }
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        var el = document.getElementById("top");

        // To set the scroll
        el.scrollTop = 0;
        el.scrollLeft = 0;
    }, [pageNumber])

    var startItem = (((pageNumber * pageLimit) + 1) - pageLimit);
    var endItem = ((startItem - 1) + pageLimit);

    if (endItem > count) {

        endItem = count;
    }

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Buy/Rent page" });
    }, [])

    const simplifyAmount = (amount) => {
        if(amount && Number(amount)){
            let number = Number(amount);
            if (Math.abs(number) >= 1e6) {
                return (number / 1e6).toFixed(1) + 'M';
            } else if (Math.abs(number) >= 1e3) {
                return (number / 1e3).toFixed(1) + 'k';
            } else {
                return number.toString();
            }
        }
        return amount
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <FilterWrap sx={{ backgroundColor: {xs: 'white', md: 'secondary.main'}, borderBottom: {xs: 'solid 1px #AFAFAF', md: 'none'}}}>
                <Container maxWidth='xl'>
                    <FilterBar
                        title={t(window.location.pathname.split("/")[1] === 'buy' ? 'filter.transactiontype.forsale' : 'filter.transactiontype.forrent')}
                        type={type}
                        shortlet={shortlet}
                        lng={lng}
                        setLng={setLng}
                        lat={lat}
                        setLat={setLat}
                        location={location}
                        setLocation={setLocation}
                        sliderRadius={sliderRadius}
                        setSliderRadius={setSliderRadius}
                        amenities={amenities}
                        setAmenities={setAmenities}
                        propertyType={propertyType}
                        setPropertyType={setPropertyType}
                        setTransactionType={setTransactionType}
                        bedrooms={bedrooms}
                        setBedrooms={setBedrooms}
                        bathrooms={bathrooms}
                        setBathrooms={setBathrooms}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        setCurrency={setCurrency}
                        minSize={minSize}
                        setMinSize={setMinSize}
                        maxSize={maxSize}
                        setMaxSize={setMaxSize}
                        sortby={sortby}
                        setSortby={setSortby}
                        orderby={orderby}
                        setOrderby={setOrderby}
                        getListings={getListings}
                        setPageNumber={setPageNumber}
                        getMapData={getMapData}
                        setCords={setCords}
                        ExContext={ExContext}
                        clearFilter={clearFilter}
                        search={search}
                        setSearch={setSearch}
                    />
                </Container>
            </FilterWrap>

            <Box sx={{ mt: '.1rem' }}>
                <Hidden lgUp>
                    <Button disableRipple variant='contained' color='paper'
                        onClick={() => {
                            if (view === 'map') {
                                setView('list')
                            } if (view === 'list') {
                                setView('map')
                            }
                        }}
                        sx={{
                            position: 'fixed', bottom: '5%', left: '50%',
                            '-webkit-transform': 'translateX(-50%)', transform: 'translateX(-50%)', zIndex: 20, bgcolor: '#fff', fontWeight: 400,
                        }}
                        startIcon={view === 'list' ? <Map color='secondary' /> : <List color='secondary' />}
                    >
                        {view === 'map' ? t('buyrent.list') : t('buyrent.map')}
                    </Button>
                </Hidden>

                <Grid container>
                    {/* MOBILE */}
                    {
                        isMobile &&
                        <>
                            {
                                view === 'map' &&
                                <Grid id="top" item xs={12} sm={12} md={12} lg={7} sx={{ display: view === 'list' && 'none', width: '100%' }}>
                                    <Box mb={2} sx={{ height: 'calc(100vh - 165px)', }}>
                                        <div id="map" className="h-full" />
                                    </Box>
                                </Grid>
                            }

                            {
                                view === 'list' &&
                                <Grid item xs={12} sm={12}
                                    md={view === 'list' ? 12 : 5}
                                    lg={view === 'list' ? 12 : 5}
                                    sx={{ height: "80vh", overflow: "scroll", marginBottom: '5rem' }}>

                                    {/* Property Listing */}
                                    <Box sx={{
                                        padding: { xs: '2rem 1.5rem', sm: '1.5rem 2rem', md: '2rem', lg: '1.5rem 2rem' },
                                        overflowY: 'scroll',
                                        height: '100%',
                                    }}
                                        className="noScrollBar"
                                        id="top"
                                    >
                                        <div id="map" className="h-full hidden" />
                                        {
                                            loading ?
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '-2.5rem' }}>
                                                    <Skeleton height={'3rem'} width={'30%'} />
                                                    <Skeleton height={'3rem'} width={'30%'} />
                                                </Box>
                                                :
                                                <Box sx={{  mb: '1.5rem' }}>     
                                                        <div style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>
                                                            <Box >
                                                                { !!type && <RoundButton size={'small'} disableElevation text={t('agentdashboard.home.for'+type)} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined' /> }
                                                                { !!location && !!location.length && <RoundButton size={'small'} disableElevation text={location} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                                { !!propertyType && !!propertyType.length && <RoundButton size={'small'} disableElevation text={propertyType.map(pt => t('filter.propertytype.'+pt)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                                { !!bedrooms && <RoundButton size={'small'} disableElevation text={bedrooms +' '+ t('filter.bedbath.bedrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                                { !!bathrooms && <RoundButton size={'small'} disableElevation text={bathrooms +' '+ t('filter.bedbath.bathrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                                { (!!minPrice || !!maxPrice) && <RoundButton size={'small'} disableElevation text={simplifyAmount(minPrice) + ' - '+ simplifyAmount(maxPrice) + ' '+ ExContext?.preferredCurrency} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                                { !!sortby && !!sortby.length && <RoundButton size={'small'} disableElevation text={sortby.map(sb => t('filter.sort.'+ sb)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                            </Box>
                                                        </div>
                                                        <div>
                                                            { notSearched && <Typography pt={'0.5rem'} fontStyle={'italic'} color={'primary.main'} fontSize={'0.6rem'}>{'confirm search for selected filters'}</Typography> }
                                                            <Typography pt={'1rem'}>{count ? t('buyrent.showing', { start: startItem, end: endItem, number: count }) : ''}</Typography>
                                                        </div>
                                                    <Hidden lgDown>
                                                        <ButtonGroup size='small' variant='outlined' color='secondary'>
                                                            <Button onClick={() => toggleView('map')} variant={view === 'map' ? 'contained' : 'outlined'} color='secondary' disableElevation startIcon={<Place fontSize='small' />}>{t('buyrent.map')}</Button>
                                                            <Button onClick={() => toggleView('list')} variant={view === 'list' ? 'contained' : 'outlined'} color='secondary' disableElevation startIcon={<ViewModule fontSize='small' />}>{t('buyrent.list')}</Button>
                                                        </ButtonGroup>
                                                    </Hidden>
                                                </Box>

                                        }
                                        <Grid container spacing={3}>
                                            {
                                                loading ?
                                                    [1, 2, 3, 4, 5, 6].map(ld => {
                                                        return (
                                                            <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={ld}>
                                                                <LoadingPropertyItem />
                                                            </Grid>
                                                        )
                                                    })
                                                    :
                                                    properties?.length === 0 ?
                                                        <Box>
                                                            <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                            <Typography mt={3} mb={3} textAlign={'center'}>{t('buyrent.nolisting')}</Typography>
                                                        </Box>
                                                        :
                                                        properties?.map((data, index) => {
                                                            const el = data?._source
                                                            return (
                                                                <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={index}>
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
                                                                        agentName={el?.user?.firstName + " " + el?.user?.lastName}
                                                                        agentImage={el?.user?.avatar}
                                                                        verified={el?.user?.verified}
                                                                        type={el?.transactionType}
                                                                        ExContext={ExContext}
                                                                        currency={el?.currency}
                                                                        toggleWishlist={toggleWishlist}
                                                                        load={load}
                                                                        favs={favs}
                                                                    />
                                                                </Grid>
                                                            )
                                                        })
                                            }
                                        </Grid>

                                        {/* Pagination */}
                                        <Box mt={4} mb={4} display='flex' justifyContent={'space-between'} alignItems={'center'}>
                                            {properties?.length > 0 ?
                                                <Pagination sx={{
                                                    '& ul': {
                                                        marginLeft: 'auto'
                                                    }
                                                }} color='primary' page={pageNumber} count={Math.ceil(count / pageLimit)} onChange={(event, value) => { setPageNumber(value) }} variant="text" shape="rounded" />
                                                : ""}
                                        </Box>


                                        <Grid container spacing={3}>
                                            {
                                                loading ?
                                                    [1, 2, 3, 4, 5, 6].map(ld => {
                                                        return (
                                                            <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={ld}>
                                                                <LoadingPropertyItem />
                                                            </Grid>
                                                        )
                                                    })
                                                    :
                                                    recommendedProperties?.length>0 ?
                                                    <>
                                                        <Grid item xs={12} justifyContent={"center"}>
                                                            <Box>
                                                                <Typography mt={3} mb={1} textAlign={'center'}>{t('buyrent.recommendedlisting')}</Typography>
                                                            </Box>
                                                        </Grid>
                                                        {
                                                            recommendedProperties?.map((data, index) => {
                                                                const el = data?._source
                                                                return (
                                                                    <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={index}>
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
                                                                            agentName={el?.user?.firstName + " " + el?.user?.lastName}
                                                                            agentImage={el?.user?.avatar}
                                                                            verified={el?.user?.verified}
                                                                            type={el?.transactionType}
                                                                            ExContext={ExContext}
                                                                            currency={el?.currency}
                                                                            toggleWishlist={toggleWishlist}
                                                                            load={load}
                                                                            favs={favs}
                                                                        />
                                                                    </Grid>
                                                                )
                                                            })
                                                        }

                                                        
                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </Grid>

                                        <Typography margin={4} onClick={() => { setOpenAddCustomerRequest(true) }} variant='body2' color={'#03254c'} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>{t('buyrent.requestproperty')}</Typography>

                                    </Box>
                                </Grid>
                            }
                        </>

                    }

                    {/* TABLET & DESKTOP */}
                    {
                        !isMobile &&
                        <>
                            <Grid item xs={12} sm={12} md={7} lg={7} sx={{ display: view === 'list' || isMobile ? 'none' : '', width: '100%' }}>
                                <Box mb={2} sx={{ height: '100%' }}>
                                    <div id="map" className="h-full" />
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={12}
                                md={view === 'list' ? 12 : 5}
                                lg={view === 'list' ? 12 : 5}
                                sx={{ height: "80vh", overflow: "scroll" }}>

                                {/* Property Listing */}
                                <Box sx={{
                                    padding: { xs: '2rem 1.5rem', sm: '0.5rem 2rem', md: '2rem', lg: '1.5rem 1.5rem' },
                                    overflowY: 'scroll',
                                    height: '100%',
                                }}
                                    className="noScrollBar"
                                    id="top"
                                >
                                    <div id="map" className="h-full hidden" />
                                    {
                                        loading ?
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '-2.5rem' }}>
                                                <Skeleton height={'3rem'} width={'30%'} />
                                                <Skeleton height={'3rem'} width={'30%'} />
                                            </Box>
                                            :
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1.5rem' }}>
                                                <div style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>
                                                    <Box >
                                                        { !!type && <RoundButton size={'small'} disableElevation text={t('agentdashboard.home.for'+type)} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined' /> }
                                                        { !!location && !!location.length && <RoundButton size={'small'} disableElevation text={location} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                        { !!propertyType && !!propertyType.length && <RoundButton size={'small'} disableElevation text={propertyType.map(pt => t('filter.propertytype.'+pt)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                        { !!bedrooms && <RoundButton size={'small'} disableElevation text={bedrooms +' '+ t('filter.bedbath.bedrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                        { !!bathrooms && <RoundButton size={'small'} disableElevation text={bathrooms +' '+ t('filter.bedbath.bathrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                        { (!!minPrice || !!maxPrice) && <RoundButton size={'small'} disableElevation text={simplifyAmount(minPrice) + ' - '+ simplifyAmount(maxPrice) + ' '+ ExContext?.preferredCurrency} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                        { !!sortby && !!sortby.length && <RoundButton size={'small'} disableElevation text={sortby.map(sb => t('filter.sort.'+ sb)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                                                    </Box>
                                                    { notSearched && <Typography pt={'0.5rem'} fontStyle={'italic'} color={'primary.main'} fontSize={'0.6rem'}>{'confirm search for selected filters'}</Typography> }
                                                    <Typography pt={'1rem'}>{count ? t('buyrent.showing', { start: startItem, end: endItem, number: count }): ''}</Typography>
                                                </div>
                                                <Hidden mdDown>
                                                    <ButtonGroup size='small' variant='outlined' color='secondary'>
                                                        <Button onClick={() => toggleView('map')} variant={view === 'map' ? 'contained' : 'outlined'} color='secondary' disableElevation startIcon={<Place fontSize='small' />}>{t('buyrent.map')}</Button>
                                                        <Button onClick={() => toggleView('list')} variant={view === 'list' ? 'contained' : 'outlined'} color='secondary' disableElevation startIcon={<ViewModule fontSize='small' />}>{t('buyrent.list')}</Button>
                                                    </ButtonGroup>
                                                </Hidden>
                                            </Box>

                                    }
                                    <Grid container spacing={3}>
                                        {
                                            loading ?
                                                [1, 2, 3, 4, 5, 6].map(ld => {
                                                    return (
                                                        <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={ld}>
                                                            <LoadingPropertyItem />
                                                        </Grid>
                                                    )
                                                })
                                                :
                                                properties?.length === 0 ?
                                                    <Grid item xs={12} justifyContent={"center"}>
                                                        <Box>
                                                            <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                            <Typography mt={3} mb={3} textAlign={'center'}>{t('buyrent.nolisting')}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    :
                                                    properties?.map((data, index) => {
                                                        const el = data?._source
                                                        return (
                                                            <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={index}>
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
                                                                    agentName={el?.user?.firstName + " " + el?.user?.lastName}
                                                                    agentImage={el?.user?.avatar}
                                                                    verified={el?.user?.verified}
                                                                    type={el?.transactionType}
                                                                    ExContext={ExContext}
                                                                    currency={el?.currency}
                                                                    toggleWishlist={toggleWishlist}
                                                                    load={load}
                                                                    favs={favs}
                                                                />
                                                            </Grid>
                                                        )
                                                    })
                                        }
                                    </Grid>



                                    {/* Pagination */}
                                    <Box mt={4} mb={4} display='flex' justifyContent={'space-between'} alignItems={'center'}>
                                        {properties?.length > 0 ?
                                            <Pagination sx={{
                                                '& ul': {
                                                    marginLeft: 'auto'
                                                }
                                            }} color='primary' page={pageNumber} count={Math.ceil(count / pageLimit)} onChange={(event, value) => { setPageNumber(value) }} variant="text" shape="rounded" />
                                            : ""}
                                    </Box>


                                    <Grid container spacing={3}>
                                        {
                                            loading ?
                                                [1, 2, 3, 4, 5, 6].map(ld => {
                                                    return (
                                                        <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={ld}>
                                                            <LoadingPropertyItem />
                                                        </Grid>
                                                    )
                                                })
                                                :
                                                recommendedProperties?.length>0 ?
                                                <>
                                                    <Grid item xs={12} justifyContent={"center"}>
                                                        <Box>
                                                            <Typography mt={3} mb={1} textAlign={'center'}>{t('buyrent.recommendedlisting')}</Typography>
                                                        </Box>
                                                    </Grid>
                                                    {
                                                        recommendedProperties?.map((data, index) => {
                                                            const el = data?._source
                                                            return (
                                                                <Grid item xs={12} sm={view === 'list' ? 6 : 6} md={view === 'list' ? 4 : 12} lg={view === 'list' ? 3 : 6} key={index}>
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
                                                                        agentName={el?.user?.firstName + " " + el?.user?.lastName}
                                                                        agentImage={el?.user?.avatar}
                                                                        verified={el?.user?.verified}
                                                                        type={el?.transactionType}
                                                                        ExContext={ExContext}
                                                                        currency={el?.currency}
                                                                        toggleWishlist={toggleWishlist}
                                                                        load={load}
                                                                        favs={favs}
                                                                    />
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </>
                                                :
                                                <></>
                                        }
                                    </Grid>
                                    <Typography margin={4} onClick={() => { setOpenAddCustomerRequest(true) }} variant='body2' color={'#03254c'} sx={{ textDecoration: 'underline', cursor: 'pointer' }}>{t('buyrent.notfinding')}</Typography>
                                        

                                </Box>
                            </Grid>
                        </>
                    }

                </Grid>
                {/* Add customer request */}
                <AddCustomerRequest openAddCustomerRequest={openAddCustomerRequest} setOpenAddCustomerRequest={setOpenAddCustomerRequest} customerRequest={null} />

            </Box>

        </motion.div>
    )
}

export default BuyRent
