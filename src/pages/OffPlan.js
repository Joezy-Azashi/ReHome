import { Box, Button, Container, Grid, styled, Typography, Hidden, Pagination } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Map, List, Close } from '@mui/icons-material'
import OffPlanItem from '../components/OffPlanItem'
import FilterBar from '../components/FilterBar'
import DevBG from '../assets/images/devBG.png'
import NoImage from '../assets/images/no-image.jpg'
import mapboxgl from 'mapbox-gl'
import Api from '../api/api'
import { useTranslation } from "react-i18next";
import LoadingPropertyItem from '../components/LoadingPropertyItem'
import NoList from '../assets/images/noListing.png'
import RateContext from '../contexts/rateContext'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import * as turf from "@turf/turf";
import ReactGA from 'react-ga4'
import { isMobile } from 'react-device-detect';
import RoundButton from '../components/Buttons/RoundButton'

const FilterWrap = styled(Box)(({ theme }) => ({
    background: theme.palette.secondary.main,
    padding: '1rem 0',
    position: 'sticky',
    top: '75px',
    zIndex: 99,
    width: '100%',
}))

const OffPlan = ({ type }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const ExContext = useContext(RateContext);
    const pathname = window.location.pathname

    const [view, setView] = useState('list')
    const [lng, setLng] = useState(-0.2);
    const [lat, setLat] = useState(5.55);
    const [sliderRadius, setSliderRadius] = useState(25)
    const [properties, setProperties] = useState([])
    const [recommendedProperties, setRecommendedProperties] = useState([])
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(1)
    const [cords, setCords] = useState([])
    const [location, setLocation] = useState([])
    const [amenities, setAmenities] = useState([])
    const [propertyType, setPropertyType] = useState([type])
    const [transactionType, setTransactionType] = useState([])
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    // const [distance, setDistance] = useState(0)
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [minSize, setMinSize] = useState(0)
    const [maxSize, setMaxSize] = useState(10000)
    const [currency, setCurrency] = useState(ExContext?.preferredCurrency)
    const [sortby, setSortby] = useState([])
    const [orderby, setOrderby] = useState("asc")

    const [search, setSearch] = useState("")
    const [notSearched, setNotSearched] = useState(true)

    const toSingleProperty = (feature) => {
        navigate(`/development/${feature?.id}/details`)
    }

    useEffect(() => {
        if(isMobile){
            setView('list')
        }
    },[])


    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: 5
        });

        var center = [lng, lat];
        var radius = sliderRadius;
        var options = { steps: 10, units: 'kilometers', properties: { foo: 'bar' } };
        var circle = turf.circle(center, radius, options);

        //addToMap
        var addToMap = [turf.point(center), circle]

        map.on('style.load', function (e) {
            let _center = turf.point([lng, lat]);
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
            el.className = 'offplanmarker';

            // make a marker for each feature and add to the map
            const marker = new mapboxgl.Marker(el).setLngLat(feature?.features[0]?.geometry?.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(`
                        <div><img src=${feature?.features[0]?.image === undefined ? NoImage : feature?.features[0]?.image} alt="image"/></div>

                        <div style="margin-top: 3px">${feature?.features[0]?.name}</div>

                        <div style="margin-top: 3px">${feature?.features[0]?.units?.length} unit${feature?.features[0]?.units?.length > 1 ? "s" : ""}</div>
                `)
                )
                .addTo(map);

            const markerDiv = marker.getElement();

            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            markerDiv.addEventListener('click', () => toSingleProperty(feature?.features[0]));

            //adding array of markers
            points.push(feature?.features[0]?.geometry?.coordinates)
        }

        map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());

        //setting the map boundary around the markers
        if (points.length > 0) {
            var bounds = points.reduce(function (bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(points[0], points[0]));

            //with bounds fit the map
            if (bounds) {
                map.fitBounds(bounds, {
                    padding: 100
                });
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
        const searchData = {
            locations: location,
            amenities: amenities,
            propertyTypes: ['development'],
            transactionTypes: transactionType,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            gps: { gpsPoint: { lon: lng, lat: lat }, distance: sliderRadius },
            priceRange: { min: minPrice, max: maxPrice, currency: ExContext?.preferredCurrency || 'GHS' },
            sizeRange: { min: minSize, max: maxSize },
            sortBy: sortby,
            orderBy: orderby,
            skip: (pageNumber - 1) * 20,
            limit: 20
        }

        setLoading(true)


        let search_term = search;
        let data = [];
        let recommended_data = [];
        let res = null;

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

        setProperties(data);
        setRecommendedProperties(recommended_data);
        setLoading(false);
        setNotSearched(false);
    }

    useEffect(()=>{setNotSearched(true)},[location, propertyType, bedrooms,bathrooms,sortby,minPrice, maxPrice])

    useEffect(() => {
        getListings()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    const getMapData = () => {
        const searchData = {
            locations: location,
            amenities: amenities,
            propertyTypes: ['development'],
            transactionTypes: transactionType,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            gps: { gpsPoint: { lon: lng, lat: lat }, distance: sliderRadius },
            priceRange: { min: minPrice, max: maxPrice, currency: ExContext?.preferredCurrency || 'GHS' },
            sizeRange: { min: minSize, max: maxSize },
            sortBy: sortby,
            orderBy: orderby,
            skip: 0,
            limit: 200
        }

        if(search){
            searchData.locations = [search];
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
                                name: data?.name,
                                units: data?.units,
                                geometry: {
                                    coordinates: [data?.gpsLocation?.lon, data?.gpsLocation?.lat],
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

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Off-plan page" });
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
        
            <Box sx={{
                backgroundImage: `linear-gradient(180deg, rgba(3,37,76,0.86), rgba(3,37,76,0.86) ), url(${DevBG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '20vh', color: '#fff', display: 'flex',
                justifyContent: 'center', alignItems: 'center'
            }}>
                <Typography sx={{
                    fontWeight: 600,
                    fontSize: { sm: '2.1rem', lg: '2.5rem' },
                    color: '#fff',
                }} textAlign={'center'} variant='h4' dangerouslySetInnerHTML={{ __html: t('offplan.title') }}></Typography>
            </Box>

            <FilterWrap sx={{ backgroundColor: {xs: 'white', md: 'secondary.main'}, borderBottom: {xs: 'solid 1px #AFAFAF', md: 'none'}}}>
                <Container maxWidth='xl'>
                    <FilterBar
                        title={t('filter.transactiontype.offplan')}
                        type={type}
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
                        setorderby={setOrderby}
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
            <div style={{marginLeft: '1.5rem', marginTop: '1rem'}}>
                <div style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>
                    <Box>
                        { <RoundButton size={'small'} disableElevation text={t('navbar.offplan')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined' /> }
                        { !!location && !!location.length && <RoundButton size={'small'} disableElevation text={location} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined' /> }
                        { !!propertyType && !!propertyType.length && <RoundButton size={'small'} disableElevation text={propertyType.map(pt => t('filter.propertytype.'+pt)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'  /> }
                        { !!bedrooms && <RoundButton size={'small'} disableElevation text={bedrooms +' '+ t('filter.bedbath.bedrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined' /> }
                        { !!bathrooms && <RoundButton size={'small'} disableElevation text={bathrooms +' '+ t('filter.bedbath.bathrooms')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                        { (!!minPrice || !!maxPrice) && <RoundButton size={'small'} disableElevation text={simplifyAmount(minPrice) + ' - '+ simplifyAmount(maxPrice) + ' '+ ExContext?.preferredCurrency} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                        { !!sortby && !!sortby.length  && <RoundButton size={'small'} disableElevation text={sortby.map(sb => t('filter.sort.'+ sb)).join(', ')} sx={{padding: '.5rem .5rem', marginRight: '10px'}} variant='outlined'/> }
                    </Box>
                    
                </div>
                { notSearched && <Typography pt={'0.5rem'} fontStyle={'italic'} color={'primary.main'} fontSize={'0.6rem'}>{'confirm search for selected filters'}</Typography> }                               
            </div>
            <Box sx={{ }}>
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
                                <Grid id="top" item sx={{ display: view === 'list' && 'none', width: '100%' }}>
                                    <Box sx={{ height: 'calc(100vh - 165px)', }}>
                                        <div id="map" className="h-full" />
                                    </Box>
                                </Grid>
                            }

                            {
                                view === 'list' &&
                                <Grid item xs={12} sm={12}
                                    md={view === 'list' ? 12 : 5}
                                    lg={view === 'list' ? 12 : 5}
                                    sx={{ height: "80vh", marginBottom: '5rem' }}>
                                    <Box sx={{
                                        padding: { xs: '2rem 1.5rem', sm: '1.5rem 2rem', md: '2rem', lg: '1.5rem 2rem' },
                                        overflowY: 'scroll',
                                        height: '100%',
                                    }}>
                                        <Container maxWidth='xl'>
                                            <Grid container spacing={3}>
                                                {
                                                    loading ?
                                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ld => {
                                                            return (
                                                                <Grid sx={{ mt: '-3rem' }} item xs={12} sm={6} md={4} lg={3} key={ld}>
                                                                    <LoadingPropertyItem />
                                                                </Grid>
                                                            )
                                                        })
                                                        :
                                                        properties?.length === 0 ?
                                                            <Box sx={{ margin: "auto" }}>
                                                                <Box>
                                                                    <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                    <Typography mt={3} mb={3} textAlign={'center'}>{t('offplan.nodata')}</Typography>
                                                                </Box>
                                                            </Box>
                                                            :
                                                            properties && properties?.map((data, index) => {
                                                                let el = data?._source
                                                                return (
                                                                    <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                                                        <OffPlanItem el={el} ExContext={ExContext}/>
                                                                    </Grid>
                                                                )
                                                            })
                                                        
                                                }
                                                <div id="map" className="h-full hidden" />
                                            </Grid>

                                            {/* Pagination */}
                                            <Box mt={4} mb={4} display='flex' justifyContent={'flex-end'}>
                                                {
                                                    properties?.length ?
                                                        <Pagination sx={{
                                                            '& ul': {
                                                                marginLeft: 'auto'
                                                            }
                                                        }} color='primary' count={Math.ceil(count / 20)} onChange={(event, value) => { setPageNumber(value); setCords([]) }} variant="text" shape="rounded" />
                                                        : null}
                                            </Box>

                                            {/* Recommended Properties */}
                                            <Grid container spacing={3}>
                                                {
                                                    loading ?
                                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ld => {
                                                            return (
                                                                <Grid sx={{ mt: '-3rem' }} item xs={12} sm={6} md={4} lg={3} key={ld}>
                                                                    <LoadingPropertyItem />
                                                                </Grid>
                                                            )
                                                        })
                                                        :
                                                        recommendedProperties?.length > 0 ?
                                                        <>
                                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                <Box sx={{ margin: "auto" }}>
                                                                    <Box>
                                                                    <Typography mt={3} mb={1} textAlign={'center'}>{t('buyrent.recommendedlisting')}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            {
                                                                recommendedProperties && recommendedProperties?.map((data, index) => {
                                                                    let el = data?._source
                                                                    return (
                                                                        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                                                            <OffPlanItem el={el} ExContext={ExContext}/>
                                                                        </Grid>
                                                                    )
                                                                })
                                                            }
                                                        </>:<></>

                                                }
                                                <div id="map" className="h-full hidden" />
                                            </Grid>

                                        </Container>
                                    </Box>
                                </Grid>
                            }
                        </>
                    }

                    {/* TABLET & DESKTOP */}
                    {
                        !isMobile && 
                        <>
                            {/* Map Frame */}
                            <Grid id="top" sx={{ display: view === 'list' && 'none', width: '100%' }}>
                                <Box sx={{ height: 'calc(100vh - 165px)', }}>
                                    <div id="map" className="h-full" />
                                </Box>
                            </Grid>

                            {/* Listings */}
                            <Box sx={{ padding: ' 4rem 1rem' }}>
                                <Container maxWidth='xl'>
                                    <Grid container spacing={3}>
                                        {
                                            loading ?
                                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ld => {
                                                    return (
                                                        <Grid sx={{ mt: '-3rem' }} item xs={12} sm={6} md={4} lg={3} key={ld}>
                                                            <LoadingPropertyItem />
                                                        </Grid>
                                                    )
                                                })
                                                :
                                                properties?.length === 0 ?
                                                        <Box sx={{ margin: "auto" }}>
                                                            <Box>
                                                                <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '3rem', display: 'block' }} alt='no-listing' />
                                                                <Typography mt={3} mb={3} textAlign={'center'}>{t('offplan.nodata')}</Typography>
                                                            </Box>
                                                        </Box>
                                                        :
                                                        properties && properties?.map((data, index) => {
                                                            let el = data?._source
                                                            return (
                                                                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                                                    <OffPlanItem el={el} ExContext={ExContext}/>
                                                                </Grid>
                                                            )
                                                        })
                                                    
                                        }
                                    </Grid>

                                    {/* Pagination */}
                                    <Box mt={4} mb={4} display='flex' justifyContent={'flex-end'}>
                                        {
                                            properties?.length ?
                                                <Pagination sx={{
                                                    '& ul': {
                                                        marginLeft: 'auto'
                                                    }
                                                }} color='primary' count={Math.ceil(count / 20)} onChange={(event, value) => { setPageNumber(value); setCords([]) }} variant="text" shape="rounded" />
                                                : null}
                                    </Box>
                                    {/* Recommended Properties */}

                                    <Grid container spacing={3}>
                                        {
                                            loading ?
                                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(ld => {
                                                    return (
                                                        <Grid sx={{ mt: '-3rem' }} item xs={12} sm={6} md={4} lg={3} key={ld}>
                                                            <LoadingPropertyItem />
                                                        </Grid>
                                                    )
                                                })
                                                :
                                                recommendedProperties?.length > 0 ?
                                                <>
                                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                                        <Box sx={{ margin: "auto" }}>
                                                            <Box>
                                                            <Typography mt={3} mb={1} textAlign={'center'}>{t('buyrent.recommendedlisting')}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    {
                                                        recommendedProperties && recommendedProperties?.map((data, index) => {
                                                            let el = data?._source
                                                            return (
                                                                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                                                    <OffPlanItem el={el} ExContext={ExContext}/>
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </>:<></>
                                        }
                                    </Grid>
                                </Container>
                            </Box>
                        </>
                    }
                </Grid>
            </Box>
        </motion.div>
    )
}

export default OffPlan
