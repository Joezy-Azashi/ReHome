import { Add, Search, ViewInAr, Videocam, AddCircle, Remove, Delete, EditOutlined, ArrowCircleLeftTwoTone, ArrowCircleRightTwoTone } from '@mui/icons-material';
import { Box, Button, Card, Autocomplete, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, FormControlLabel, FormLabel, Grid, IconButton, Hidden, InputAdornment, MenuItem, Stack, Step, StepLabel, Stepper, styled, Switch, TextField, Typography } from '@mui/material'
import { grey } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Api from '../../api/api';
import RoundButton from '../../components/Buttons/RoundButton'
import Finish from '../../assets/images/finish.png'
import FileUploadService from '../../services/FileUpload'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import "../../assets/css/mapbox-gl-geocoder.css";
import { useNavigate, useLocation, Link } from 'react-router-dom'
import "../../../node_modules/video-react/dist/video-react.css";
// import { Player } from "video-react";
import PageLoader from '../../components/PageLoader';
import NoList from '../../assets/images/noListing.png'
import { motion } from "framer-motion";
import { getUserType } from '../../services/auth'
import ReactGA from 'react-ga4'
import imageCompression from 'browser-image-compression'

const ImagePreview = styled(Box)(({ theme }) => ({
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: '10px',
    position: 'relative'
}))

const StyledLabel = styled(FormLabel)(({ theme }) => ({
    fontSize: '.9rem',
    marginBottom: '10px'
}))

const StyledInput = styled(TextField)(({ theme }) => ({
    marginBottom: '3rem'
}))

const FlexWrap = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '1rem 0'
}))

const DevListing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const loc = useLocation();
    const landtitleInput = React.useRef();
    const planInput = React.useRef();
    const buildingPermitInput = React.useRef();
    const [editData, setEditData] = useState()
    const [noEditData, setNoEditData] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [deleteProperty, setDeleteProperty] = useState(false)
    const [propertyName, setPropertyName] = useState("")
    const [country, setCountry] = useState("ghana")
    const [location, setLocation] = useState("")
    const [search, setSearch] = useState("")
    const [constantLocation, setConstantLocation] = useState([])
    const [describeProperty, setDescribeProperty] = useState("")
    const [price, setPrice] = useState(0)
    const [currency, setCurrency] = useState("GHS")
    const [priceInterval, setPriceInterval] = useState("monthly")
    const [hidePrice, setHidePrice] = useState(false)
    const [propertyStatus, setPropertyStatus] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [propertySize, setPropertySize] = useState(0)
    const [constructionYear, setConstructionYear] = useState("")
    const [totalRooms, setTotalRooms] = useState(0)
    const [lng, setLng] = useState();
    const [lat, setLat] = useState();
    const [selectedLng, setSelectedLng] = useState()
    const [selectedLat, setSelectedLat] = useState()
    const [totalBaths, setTotalBaths] = useState(0)
    const [floorPlan, setFloorPlan] = useState([])
    const [popularAmenities, setPopularAmenities] = useState([])
    const [page, setPage] = useState(0)
    const [sec, setSec] = useState(0)
    const [unit, setUnit] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(false);
    const activeStep = page
    const [amenities, setAmenities] = useState()
    const [pictures, setPictures] = useState([])
    const [uniquefeatures, setUniquefeatures] = useState([])
    const [videos, setVideos] = useState([]);
    const [newFeature, setNewFeature] = useState("")
    const [searchAmenities, setSearchAmenities] = useState("")
    const [landTitle, setLandTitle] = useState("")
    const [buildingPermit, setBuildingPermit] = useState("")
    const [housePlan, setHousePlan] = useState("")
    const [docsUrl, setDocsUrl] = useState([])
    const [propertyId, setPropertyId] = useState()
    const [error, setError] = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)
    const [user, setUser] = useState()
    const [searchLoading, setSearchLoading] = useState(false)
    const [draftId, setDraftId] = useState("")

    const steps = [t('agentdashboard.addoffplan.steps.basic'), t('agentdashboard.addoffplan.steps.config'), t('agentdashboard.addoffplan.steps.features'), t('agentdashboard.addoffplan.steps.amenities'), t('agentdashboard.addoffplan.steps.gallery'), t('agentdashboard.addoffplan.steps.attachment')]

    const nextPage = () => {
        if (page === 0) {
            if (propertyName.length < 10) {
                enqueueSnackbar(t('agentdashboard.addoffplan.alerts.charlength.propertyname'), { variant: 'error' })
                setError(true)
            } else if (location === "") {
                enqueueSnackbar(t('agentdashboard.addoffplan.alerts.charlength.location'), { variant: 'error' })
                setError(true)
            } else if (editMode && (selectedLng === undefined || selectedLat === undefined)) {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.gps'), { variant: 'error' })
                setError(true)
            } else if (!editMode && (lng === undefined || lat === undefined)) {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.gps'), { variant: 'error' })
                setError(true)
            } else if (describeProperty.length < 10 || describeProperty.length > 299) {
                enqueueSnackbar(t('agentdashboard.addoffplan.alerts.charlength.description'), { variant: 'error' })
                setError(true)
            } else {
                setPage(1)
                return
            }
        } if (page === 1 && sec === 0) {
            if (unit.length < 1) {
                enqueueSnackbar(t('agentdashboard.addoffplan.alerts.addunit'), { variant: 'error' })
            } else {
                setPage(2)
            }
        } if (page === 1 && sec === 1) {
            if (totalBaths < 1 || totalRooms < 1) {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.totalroombath'), { variant: 'error' })
                setError(true)
            } else if (price < 1 && !hidePrice) {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.cost'), { variant: 'error' })
                setError(true)
            } else if (transactionType === undefined || transactionType === "") {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.transactiontype'), { variant: 'error' })
                setError(true)
            } else if (propertyStatus === undefined || propertyStatus === "") {
                enqueueSnackbar(t('agentdashboard.addlisting.alerts.propertystatus'), { variant: 'error' })
                setError(true)
            } else {
                createUnit()
                setSec(0)
                return
            }
            return
        } if (page === 2) {
            setPage(3)
            return
        } if (page === 3) {
            setPage(4)
            return
        } if (page === 4) {
            setPage(5)
            return
        } if (page === 5) {
            if (loading) {

            } else {
                postOffPlan()
            }
            return
        }
    }

    const stepBack = () => {
        if (page === 0) {
            navigate('/broker/listings')
            return
        }
        if (page === 1 && sec === 0) {
            setPage(0)
            return
        } if (editMode && page === 1 && sec === 1) {
            setPage(0)
            return
        } else if (page === 1 && sec === 1) {
            setPage(1)
            setSec(0)
            return
        } if (page === 2) {
            setPage(1)
            setSec(0)
            return
        } if (page === 3) {
            setPage(2)
            return
        } if (page === 4) {
            setPage(3)
            return
        } if (page === 5) {
            setPage(4)
            return
        } if (page === 6) {
            setPage(5)
            return
        }
    }

    const moveToStep = (index) => {
        if (editMode) {
            setPage(index)
        }
    }

    useEffect(() => {
        if (loc?.state?.id && loc?.state?.type === "draft") {
            //get draft data
            setNoEditData(true)
            Api().get(`/drafts/${loc?.state?.id}`)
                .then((response) => {
                    setNoEditData(false)
                    setEditData(response?.data?.modelObject)
                    setPropertyName(response?.data?.modelObject?.name)
                    setCountry(response?.data?.modelObject?.country ?? 'ghana')
                    setLocation(response?.data?.modelObject?.geoAddress)
                    setSelectedLng(response?.data?.modelObject?.gpsLocation?.lon)
                    setSelectedLat(response?.data?.modelObject?.gpsLocation?.lat)
                    setDescribeProperty(response?.data?.modelObject?.description)
                    setUnit(response?.data?.modelObject?.units)
                    setConstructionYear(response?.data?.modelObject?.year_constructed)
                    setPopularAmenities(response?.data?.modelObject?.amenities)
                    setUniquefeatures(response?.data?.modelObject?.features)
                    setPictures(response?.data?.modelObject?.pictures)
                    setVideos(response?.data?.modelObject?.videos)
                    let landTitleName = response?.data?.modelObject?.documents?.find((d) => d.document_type === "land_title")
                    setLandTitle(landTitleName?.title)
                    setDocsUrl(response?.data?.modelObject?.documents.map(li => li))
                    let buildingPermitName = response?.data?.modelObject?.documents?.find((d) => d.document_type === "building_permit")
                    setBuildingPermit(buildingPermitName?.title)
                    let planName = response?.data?.modelObject?.documents?.find((d) => d.document_type === "house_plan")
                    setHousePlan(planName?.title)
                    setDraftId(loc?.state?.id)
                    setEditMode(true)
                })
                .catch((error) => {
                    enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                })
        } else if (loc?.state?.id) {
            setNoEditData(true)
            Api().get(`/rehome-properties/${loc?.state?.id}`)
                .then((response) => {
                    setNoEditData(false)
                    setEditData(response?.data)
                    setPropertyName(response?.data?.name)
                    setCountry(response?.data?.country ?? 'ghana')
                    setLocation(response?.data?.geoAddress)
                    setSelectedLng(response?.data?.gpsLocation?.lon)
                    setSelectedLat(response?.data?.gpsLocation?.lat)
                    setDescribeProperty(response?.data?.description)
                    setUnit(response?.data?.units)
                    setConstructionYear(response?.data?.year_constructed)
                    setPopularAmenities(response?.data?.amenities)
                    setUniquefeatures(response?.data?.features)
                    setPictures(response?.data?.pictures)
                    setVideos(response?.data?.videos)
                    let landTitleName = response?.data?.documents?.find((d) => d.document_type === "land_title")
                    setLandTitle(landTitleName?.title)
                    setDocsUrl(response?.data?.documents.map(li => li))
                    let buildingPermitName = response?.data?.documents?.find((d) => d.document_type === "building_permit")
                    setBuildingPermit(buildingPermitName?.title)
                    let planName = response?.data?.documents?.find((d) => d.document_type === "house_plan")
                    setHousePlan(planName?.title)
                    setEditMode(true)
                })
                .catch((error) => {
                    enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loc?.state?.id])

    const changeHide = () => {
        setHidePrice(!hidePrice)
    }

    const getImage = async (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        if (pictures?.length >= 12) {
            enqueueSnackbar(t('agentdashboard.addlisting.tab5.maximages'), { variant: 'warning' })
            return
        }
        let url = "/files/pictures";
        setLoading(true);
        enqueueSnackbar(t('agentdashboard.addoffplan.tab5.upload'), { variant: 'warning' })

        const picArr = [];
        for (let file of event.target.files) {
            const imageFile = file
            const options = {
                maxSizeMB: 4,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(imageFile, options);
            console.log("compressedFile", compressedFile)
            try {
                const res = await FileUploadService.upload(compressedFile, url)
                if (res?.data?.path) {
                    picArr.push(res.data.path);
                }
                setLoading(false)
            } catch (e) {
                setLoading(false)
            }
        }
        setPictures([...pictures, ...picArr]);
        setLoading(false)
        // FileUploadService.upload(event.target.files[0], url)
        //     .then((res) => {
        //         setLoading(false);
        //         setPictures([...pictures, res?.data?.path]);
        //     })
        //     .catch((error) => {
        //         setLoading(false);
        //     })
    };

    // const getVideo = (event) => {
    //     if (event?.target?.files?.length < 1) {
    //         return
    //     }

    //     let url = "/files/pictures";
    //     setLoading(true);
    //     enqueueSnackbar(t('agentdashboard.addoffplan.tab5.upload'), { variant: 'warning' })
    //     FileUploadService.upload(event.target.files[0], url)
    //         .then((res) => {
    //             setLoading(false);
    //             setVideos([...videos, res?.data?.path]);
    //         })
    //         .catch((error) => {
    //             setLoading(false);
    //         })
    // };

    const addMoreUnits = () => {
        if (unit.length >= 10) {
            enqueueSnackbar(t('agentdashboard.addoffplan.alerts.maxunit'), { variant: 'warning' })
        } else {
            setSec(1)
            setTotalRooms(0)
            setTotalBaths(0)
            setCurrency("GHS")
            setPriceInterval("monthly")
            setPrice(0)
            setPropertySize(0)
            setTransactionType("")
            setPropertyStatus("")
            setFloorPlan([])
            setHidePrice(false)
        }
    }

    const createUnit = () => {
        setUnit((prev) => [...prev,
        {
            bedrooms: totalRooms,
            bathrooms: totalBaths,
            price: Number(price),
            currency: currency,
            priceInterval: priceInterval,
            sizeOfHouse: Number(propertySize),
            transactionType: transactionType,
            status: propertyStatus,
            documents: floorPlan,
            hidePrice: hidePrice
        }
        ])
    }

    const editUnit = (data) => {
        setPage(1)
        setSec(1)

        setTotalRooms(data?.bedrooms)
        setTotalBaths(data?.bathrooms)
        setCurrency(data?.currency)
        setPriceInterval(data?.priceInterval)
        setPrice(data?.price)
        setPropertySize(data?.sizeOfHouse)
        setTransactionType(data?.transactionType)
        setPropertyStatus(data?.status)
        setFloorPlan(data?.documents)
        setHidePrice(data?.hidePrice)
    }

    const getFloorPlan = (event) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        enqueueSnackbar(t('agentdashboard.addoffplan.tab6.alertplan'), { variant: 'warning' })
        FileUploadService.uploadGeneral(event.target.files[0], "/files/pictures")
            .then((res) => {
                setFloorPlan((prevState) => [...prevState, { title: res?.data?.originalname, document_type: "house_plan", uri: res?.data?.path }])
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
            })
    }

    const addFeature = () => {
        if (newFeature === '') {
            enqueueSnackbar(t('agentdashboard.addoffplan.tab3.alert'), { variant: 'warning' })
            return
        }
        let newFeatures = [...uniquefeatures, { name: newFeature, active: true }]
        setUniquefeatures(newFeatures)
        setNewFeature('')
    }

    const getAmenities = (e, key, label) => {
        if (e.target.checked) {
            setPopularAmenities((prevState) => [...prevState, { title: key, description: label }])
        } else {
            setPopularAmenities(popularAmenities.filter(item => item.title !== key));
        }
    }

    const getUniquefeatures = (e, el) => {
        setUniquefeatures(uniquefeatures.map(f => (f.name === el.name ? { name: el.name, active: !el.active } : { ...f })))
    }

    let url = "/files/documents";

    const getLandTitle = (event, type) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        enqueueSnackbar(t('agentdashboard.addoffplan.tab6.alertlandtitle'), { variant: 'warning' })
        FileUploadService.uploadGeneral(event.target.files[0], url)
            .then((res) => {
                setDocsUrl((prevState) => [
                    ...prevState.filter(doc => doc.document_type !== type),
                    { title: res?.data?.originalname, document_type: type, uri: res?.data?.path }])
                setLandTitle(res?.data?.originalname)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
            })
    }

    const getBuildingPermit = (event, type) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        enqueueSnackbar(t('agentdashboard.addoffplan.tab6.alertpermit'), { variant: 'warning' })
        FileUploadService.uploadGeneral(event.target.files[0], url)
            .then((res) => {
                setDocsUrl((prevState) => [
                    ...prevState.filter(doc => doc.document_type !== type),
                    { title: res?.data?.originalname, document_type: type, uri: res?.data?.path }])
                setBuildingPermit(res?.data?.originalname)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
            })
    }

    const getPlan = (event, type) => {
        if (event?.target?.files?.length < 1) {
            return
        }

        setLoading(true)
        enqueueSnackbar(t('agentdashboard.addoffplan.tab6.alertplan'), { variant: 'warning' })
        FileUploadService.uploadGeneral(event.target.files[0], url + "-public")
            .then((res) => {
                setDocsUrl((prevState) => [
                    ...prevState.filter(doc => doc.document_type !== type),
                    { title: res?.data?.originalname, document_type: type, uri: res?.data?.path }
                ])
                setHousePlan(res?.data?.originalname)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
            })
    }

    const getLocation = (event, newValue) => {
        setLocation(newValue?.label)
        setLat(newValue?.latitude)
        setLng(newValue?.longitude)
        setSelectedLat(newValue?.latitude)
    }

    const postOffPlan = (state) => {

        const data = {
            name: propertyName,
            country: country,
            propertyType: 'development',
            gpsLocation: {
                lon: lng === undefined ? selectedLng : lng,
                lat: lat === undefined ? selectedLat : lat,
            },
            geoAddress: location,
            description: describeProperty,
            sizeOfHouse: 0,
            year_constructed: Number(constructionYear),
            pictures: pictures,
            videos: videos,
            documents: docsUrl,
            features: uniquefeatures,
            amenities: popularAmenities,
            units: unit
        }

        if (state === "draft") {
            if (propertyName.length < 10) {
                enqueueSnackbar(t('agentdashboard.addoffplan.alerts.charlength.draftsave'), { variant: 'warning' })
                return
            } else {
                setLoading(true)
                if (draftId) {
                    Api().patch(`drafts/${draftId}`, { modelName: 'rehome_property', modelObject: data })
                        .then((res) => {
                            if (getUserType() === 'admin' || getUserType() === 'support') {
                                navigate("/admin/users")
                            } else {
                                navigate("/broker/listings")
                            }
                            AnalyticsEvent(res)
                        })
                        .catch((error) => {
                            enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                        })
                } else {
                    Api().post(`users/${user?.id}/drafts`, { modelName: 'rehome_property', modelObject: data })
                        .then((res) => {
                            navigate("/broker/listings")
                            AnalyticsEvent(res)
                        })
                        .catch((error) => {
                            enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                        })
                }
            }

        } else {
            if (editMode && loc?.state?.type !== "draft") {
                setLoading(true)
                Api().patch(`/rehome-properties/${loc?.state?.id}`, data)
                    .then((response) => {
                        setLoading(false)
                        setPage(6)
                        AnalyticsEvent(response)
                    })
                    .catch((error) => {
                        setLoading(false)
                        enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                    })
            } else {
                setLoading(true)
                Api().get('/me')
                    .then((res) => {
                        if (draftId) { data.draftId = draftId }
                        Api().post(`/users/${user?.id}/rehome-properties`, data)
                            .then((response) => {
                                setPropertyId(response?.data?.id)
                                setLoading(false)
                                setPage(6)
                                AnalyticsEvent(response)
                            })
                            .catch((error) => {
                                setLoading(false)
                                enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
                            })
                    })
            }
        }

    }

    useEffect(() => {
        if (loc?.state?.user) {
            setUser(loc.state.user);
        } else {
            Api().get('/me')
                .then((res) => {
                    setUser(res?.data)
                })
        }
    }, [])

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [!selectedLng ? -0.205874 : selectedLng, !selectedLat ? 5.614818 : selectedLat],
            zoom: 9
        });

        let points = []

        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        map.on('style.load', function () {

            map.on('click', function (e) {
                var coordinates = e.lngLat;
                setError(false)

                setLat(coordinates.lat)
                setLng(coordinates.lng)

                new mapboxgl.Marker(el).setLngLat([coordinates?.lng, coordinates?.lat]).addTo(map)

                points?.push([coordinates?.lng, coordinates?.lat])
            });
        });

        // Add the control to the map.
        map.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                countries: "GH,CI,TG,BJ,BF,NG",
                mapboxgl: mapboxgl,
                marker: false,
            })
        );

        map.scrollZoom.disable();
        map.addControl(new mapboxgl.NavigationControl());

        const [newLng, newLat] = editMode ? [lng || selectedLng, lat || selectedLat] : [lng, lat]

        if (newLng && newLat) {
            new mapboxgl.Marker(el).setLngLat([newLng, newLat]).addTo(map)

            var bounds = [newLng, newLat]?.reduce(function (bounds, coord) {
                return bounds?.extend(coord);
            }, new mapboxgl.LngLatBounds([newLng - 0.01, newLat - 0.01], [newLng + 0.01, newLat + 0.01]));

            //with bounds fit the map
            if (bounds) {
                map.fitBounds(bounds, {
                    padding: 20
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editData, selectedLng, selectedLat, page === 0])

    //delete property
    const deleteListing = () => {
        setLoading(true)
        if (loc?.state?.id && loc?.state?.type === "draft") {
            Api().delete(`drafts/${draftId}`)
                .then((res) => {
                    setLoading(false)
                    setDeleteProperty(false)
                    if (getUserType() === 'admin' || getUserType() === 'support') {
                        navigate("/admin/users")
                    } else {
                        navigate("/broker/listings")
                    }
                })
        } else {
            Api().delete(`rehome-properties/${editData?.id}`)
                .then((res) => {
                    setLoading(false)
                    setDeleteProperty(false)
                    if (getUserType() === 'admin' || getUserType() === 'support') {
                        navigate("/admin/users")
                    } else {
                        navigate("/broker/listings")
                    }
                })
        }
    }

    useEffect(() => {
        //get Amenities
        Api().get('constants/default_amenities')
            .then((res) => {
                setAmenities(res?.data)
            })

        //get features
        if ((loc?.state?.id && loc?.state?.type === "draft") || loc?.state?.id === undefined) {
            Api().get('constants/features')
                .then((res) => {
                    setUniquefeatures(res?.data)
                })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    const publishProperty = (state) => {
        setPublishLoading(true)
        Api().patch(`users/${user?.id}/rehome-properties`, { published: state }, {
            params: { where: { id: { inq: editMode && loc?.state?.type !== "draft" ? [loc?.state?.id] : [propertyId] } } }
        })
            .then((res) => {
                setPublishLoading(false)
                if (state) {
                    enqueueSnackbar(t('agentdashboard.listing.publishalert'), { variant: 'success' })
                } else {
                    enqueueSnackbar(t('agentdashboard.listing.removepublish'), { variant: 'success' })
                }
            })
            .catch((error) => {
                setPublishLoading(false)
                enqueueSnackbar((error?.response?.data?.error?.message), { variant: 'error' });
            })
    }


    const movePicture = (index, direction) => {
        if (direction === 'left') {
            let pics = [...pictures];

            const a = pics[index];
            const b = pics[index - 1]
            pics[index - 1] = a;
            pics[index] = b;

            setPictures([...pics]);
        }
        if (direction === 'right') {
            let pics = [...pictures];

            const a = pics[index];
            const b = pics[index + 1]
            pics[index + 1] = a;
            pics[index] = b;

            setPictures([...pics]);
        }
    }

    const generateArrayOfYears = () => {
        var max = new Date().getFullYear() + 10
        var min = max - 63
        var years = []

        for (var i = max; i >= min; i--) {
            years.push(i)
        }
        return years
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })

        var el = document.getElementById("dtop");

        // To set the scroll
        el.scrollTop = 0;
        el.scrollLeft = 0;
    }, [page, sec])

    const AnalyticsEvent = (res) => {
        setTimeout(() => {
            ReactGA.event({
                category: res?.transactionType,
                action: "Submit listing",
                label: "Add off-plan page",
                value: 99,
                location: res?.geoAddress,
                userName: user?.firstName + " " + user?.lastName,
            });
        }, 1000)
    }

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Add listing page" });
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card elevation={0} sx={{ borderRadius: '20px' }}>
                <Grid container>
                    <Hidden mdDown>
                        <Grid item sm={4}>
                            <Box bgcolor={grey[100]} sx={{ padding: '3rem 3rem', height: '100%', display: 'flex', flexDirection: 'column', }}>
                                <Typography variant='h6' sx={{ fontSize: '1.2rem' }} mb={3}>{editMode ? t('agentdashboard.addoffplan.steps.edit') : t('agentdashboard.addoffplan.steps.title')}</Typography>
                                <Box>
                                    <Stepper orientation="vertical" activeStep={activeStep} sx={{
                                        '& .MuiStepConnector-root': {
                                            marginLeft: '18px'
                                        },
                                        '&.MuiStepper-root': {
                                            // gap: "45px"
                                        }
                                    }}>
                                        {
                                            steps?.map((label, index) => (
                                                <Step sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: '2.2rem'
                                                    },
                                                    cursor: editMode ? "pointer" : "",
                                                    '& .Mui-disabled': { cursor: editMode ? "pointer" : "" }
                                                }} key={index} onClick={() => moveToStep(index)}>
                                                    <StepLabel color="inherit">
                                                        {label}
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                    </Stepper>
                                </Box>

                                {page === 6 || getUserType() === "admin" ? "" :
                                    <>
                                        {getUserType() === "admin" ? "" :
                                            <span onClick={() => postOffPlan('draft')} style={{ marginTop: 'auto' }}>
                                                <RoundButton
                                                    size={'small'}
                                                    text={draftId ? t('agentdashboard.addlisting.steps.update') : t('agentdashboard.addlisting.steps.save')}
                                                    progress={loading && (
                                                        <CircularProgress
                                                            size={20}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                color: "primary",
                                                                margin: "3px 0"
                                                            }}
                                                        />
                                                    )}
                                                    sx={{ padding: '.6rem 1.5rem', }}
                                                    disableElevation
                                                    variant={'outlined'}
                                                />
                                            </span>
                                        }

                                        {editMode ?
                                            <StepLabel onClick={() => setDeleteProperty(true)} sx={{ paddingLeft: "10px", cursor: "pointer", marginTop: getUserType() === "admin" ? '2.5rem' : '' }}>
                                                {draftId ? t('agentdashboard.addlisting.steps.delete_draft') : t('agentdashboard.addlisting.steps.delete')}
                                            </StepLabel>
                                            : null
                                        }
                                    </>
                                }

                                <Dialog
                                    open={deleteProperty}
                                    keepMounted
                                    onClose={() => setDeleteProperty(false)}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    <DialogContent>
                                        <Typography sx={{ textAlign: "center", paddingTop: "20px" }}>{draftId ? t('agentdashboard.addlisting.alerts.delete_draft') : t('agentdashboard.addlisting.alerts.delete')}</Typography>
                                    </DialogContent>
                                    <DialogActions sx={{ padding: "0 20px 10px 0" }}>
                                        <RoundButton onClick={() => setDeleteProperty(false)} text={t('agentdashboard.addoffplan.button.cancel')} disableElevation variant={'contained'} sx={{ padding: '.5rem 1.5rem' }} />
                                        <RoundButton
                                            onClick={deleteListing}
                                            text={loading ? (
                                                <CircularProgress
                                                    size={20}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: "black"
                                                    }}
                                                />
                                            )
                                                : t('agentdashboard.addoffplan.button.delete')}
                                        />
                                    </DialogActions>
                                </Dialog>
                            </Box>
                            {/* <span style={{ marginTop: 'auto', marginBottom: '2rem' }}>
                                <RoundButton onClick={() => postOffPlan('draft')} size={'small'} text={t('agentdashboard.addoffplan.steps.save')} sx={{ padding: '.6rem 1.5rem', }} disableElevation variant={'outlined'} />
                            </span> */}
                        </Grid>
                    </Hidden>

                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Box sx={{ padding: { xs: '2rem', md: '3rem' }, bgcolor: '#fff' }} id="dtop">

                            {noEditData ? <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}><PageLoader /></div> :
                                page === 0 &&
                                <Box>
                                    <Typography variant='h6'>{t('agentdashboard.addoffplan.tab1.title')}</Typography>
                                    <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab1.note')}</Typography>

                                    <Stack>
                                        <StyledLabel>{t('agentdashboard.addoffplan.tab1.name')}</StyledLabel>
                                        <StyledInput
                                            type="text"
                                            value={propertyName}
                                            error={propertyName?.length > 0 ? false : error}
                                            onChange={(e) => { setPropertyName(e.target.value); setError(false) }}
                                            variant='standard'
                                            fullWidth
                                            placeholder={t('agentdashboard.addoffplan.tab1.nameplaceholder')}
                                        />

                                        <StyledLabel>{t('agentdashboard.addoffplan.tab1.yearofconstruction')}</StyledLabel>
                                        <StyledInput
                                            select
                                            value={constructionYear}
                                            error={constructionYear > 0 ? false : error}
                                            onChange={(e) => { setConstructionYear(e.target.value); setError(false) }}
                                            variant='standard'
                                            fullWidth
                                            placeholder=''
                                        >
                                            <MenuItem value={0}>{t('agentdashboard.addlisting.tab2.none')}</MenuItem>
                                            {generateArrayOfYears().map((el) => {
                                                return (
                                                    <MenuItem value={el}>{el}</MenuItem>
                                                )
                                            })}
                                        </StyledInput>

                                        <StyledLabel>{t('agentdashboard.addlisting.tab1.country.label')}</StyledLabel>
                                        <StyledInput
                                            select
                                            variant='standard'
                                            value={country}
                                            error={country?.length > 0 ? false : error}
                                            onChange={(e) => { country(e.target.value); setError(false) }}
                                            fullWidth
                                            placeholder=''
                                        >
                                            <MenuItem value={'ghana'}>{t('agentdashboard.addlisting.tab1.country.ghana')}</MenuItem>
                                        </StyledInput>

                                        <StyledLabel>{t('agentdashboard.addoffplan.tab1.location')}</StyledLabel>
                                        <Autocomplete
                                            disablePortal
                                            id="location"
                                            getOptionLabel={(option) => option.label}
                                            loading={searchLoading}
                                            options={constantLocation}
                                            renderInput={(params) =>
                                                <StyledInput
                                                    sx={{
                                                        marginBottom: '1rem',
                                                        '& .MuiOutlinedInput-root': {
                                                            background: '#fff',
                                                            borderRadius: '50px'
                                                        }
                                                    }}
                                                    variant='standard' {...params} placeholder={t('filter.search')}
                                                    fullWidth
                                                    error={location?.length > 0 ? false : error}
                                                    onChange={(e) => { setSearch(e.target.value); setError(false) }}
                                                />
                                            }
                                            onChange={(event, newValue) => { getLocation(event, newValue) }}
                                        />

                                        <StyledLabel>{t('agentdashboard.addoffplan.tab1.pinlocation')}</StyledLabel>
                                        <Box mb={8} sx={{ height: '25rem', borderRadius: '10px', bgcolor: grey[200] }}>
                                            <div id="map" className="h-full w-full" />
                                        </Box>

                                        <StyledLabel>{t('agentdashboard.addoffplan.tab1.describe')}</StyledLabel>
                                        <StyledInput
                                            type="text"
                                            value={describeProperty}
                                            error={describeProperty?.length > 0 ? false : error}
                                            onChange={(e) => { setDescribeProperty(e.target.value); setError(false) }}
                                            multiline
                                            rows={5}
                                            variant='outlined'
                                            fullWidth
                                            placeholder={t('agentdashboard.addoffplan.tab1.describeplaceholder')}
                                        />
                                    </Stack>

                                </Box>
                            }

                            {/* Property Config */}
                            {
                                page === 1 &&
                                <Box>
                                    <div id="map" className="h-full hidden" />
                                    {
                                        sec === 0 &&
                                        <Box>
                                            {/* Add & Edit Units */}
                                            {/* <Box onClick={addMoreUnits} bgcolor={'primary.main'} sx={{ cursor: 'pointer', width: '15rem', borderRadius: '10px', textAlign: 'center', padding: '1.5rem', flex: 1, color: '#fff', margin: '2rem auto' }}>
                                                <AddCircle sx={{ fontSize: '2rem', my: '1rem' }} />
                                                <Typography textAlign={'center'} sx={{ fontSize: '1rem' }}>{t('agentdashboard.addoffplan.tab2.addmore')}</Typography>
                                            </Box> */}

                                            <Box sx={{ display: "flex", justifyContent: "center", margin: '2rem 0' }}>
                                                <RoundButton
                                                    onClick={addMoreUnits}
                                                    startIcon={<AddCircle fontSize='small' sx={{ color: '#fff' }} />}
                                                    sx={{ color: '#fff', whiteSpace: "nowrap", fontSize: '1rem' }}
                                                    size={'small'}
                                                    // fullWidth
                                                    text={t('agentdashboard.addoffplan.tab2.addmore')}
                                                    color='primary'
                                                    variant={'contained'}
                                                    disableElevation
                                                />
                                            </Box>

                                            <Box sx={{ padding: '2rem', bgcolor: 'secondary.main', borderRadius: '10px', color: '#fff', width: "100%" }}>

                                                {/* Added Units */}
                                                {
                                                    unit?.length <= 0 ?
                                                        <Box sx={{ margin: "0 auto" }}>
                                                            <img src={NoList} width='15%' style={{ margin: '0 auto', marginTop: '1rem', display: 'block' }} alt='no-listing' />
                                                            <Typography mt={3} mb={3} textAlign={'center'}>{t('agentdashboard.addoffplan.tab2.nounit')}</Typography>
                                                        </Box> :
                                                        <Grid container spacing={2}>
                                                            {unit?.map((el, index) => {
                                                                return (
                                                                    <Grid item xs={12} sm={4} md={6} lg={3} key={index}>
                                                                        <Box sx={{ textAlign: 'center', padding: "14px", backgroundColor: "#fff" }}>
                                                                            <IconButton onClick={() => setUnit(prev => { return prev.filter((n, i) => i !== index) })}>
                                                                                <Delete color='primary' />
                                                                            </IconButton>

                                                                            <IconButton onClick={() => { editUnit(el); setUnit(prev => { return prev.filter((n, i) => i !== index) }) }}>
                                                                                <EditOutlined color='primary' />
                                                                            </IconButton>

                                                                            <Typography variant='body2' mt={3} sx={{ textTransform: "capitalize", color: "black" }}>{el?.transactionType}</Typography>
                                                                            <Typography sx={{ fontWeight: 600, color: "black", whiteSpace: "nowrap" }}>{el?.bedrooms} {t('agentdashboard.addoffplan.tab2.rooms')}{el !== 1 && 's'}</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                )
                                                            })}
                                                        </Grid>
                                                }

                                            </Box>
                                        </Box>

                                    }
                                    {
                                        sec === 1 &&
                                        <>

                                            <Typography variant='h6' mb={5}>{t('agentdashboard.addoffplan.tab2.title')}</Typography>

                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <FlexWrap>
                                                        <StyledLabel>{t('agentdashboard.addlisting.tab2.rooms')}</StyledLabel>
                                                        <Box sx={{ borderRadius: '50px', border: error && totalRooms < 1 ? '1px solid red' : '1px solid #5b9c00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '8rem' }}>
                                                            <IconButton disabled={totalRooms < 1} onClick={() => { setTotalRooms(totalRooms - 1); setError(false) }} ><Remove /></IconButton>
                                                            <Typography>{totalRooms}</Typography>
                                                            <IconButton onClick={() => { setTotalRooms(totalRooms + 1); setError(false) }}><Add /></IconButton>
                                                        </Box>
                                                    </FlexWrap>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <FlexWrap>
                                                        <StyledLabel>{t('agentdashboard.addlisting.tab2.baths')}</StyledLabel>
                                                        <Box sx={{ borderRadius: '50px', border: error && totalBaths < 1 ? '1px solid red' : '1px solid #5b9c00', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '8rem' }}>
                                                            <IconButton disabled={totalBaths < 1} onClick={() => { setTotalBaths(totalBaths - 1); setError(false) }} ><Remove /></IconButton>
                                                            <Typography>{totalBaths}</Typography>
                                                            <IconButton onClick={() => { setTotalBaths(totalBaths + 1); setError(false) }}><Add /></IconButton>
                                                        </Box>
                                                    </FlexWrap>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={4} lg={4}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} mt={2.9}>
                                                        <StyledLabel sx={{ marginBottom: '0' }}>Hide Price</StyledLabel>
                                                        <Switch color='primary' value={hidePrice} checked={hidePrice} onChange={changeHide} />
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={8} lg={8} sx={{display: 'flex'}}>
                                                    <Grid item xs={6}>
                                                        <StyledLabel>{t('agentdashboard.addoffplan.tab2.price')}</StyledLabel>
                                                        <StyledInput
                                                            type="number"
                                                            onKeyDown={(e) => {
                                                                if (e.keyCode === 38 || e.keyCode === 40) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onWheel={(e) => e.target.blur()}
                                                            value={price}
                                                            error={price > 1 || hidePrice ? false : error}
                                                            onChange={(e) => { setPrice(e.target.value); setError(false) }}
                                                            variant='standard'
                                                            fullWidth
                                                            placeholder={''}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} sx={{display: 'flex', alignItems: 'end', paddingLeft: '1rem'}}>
                                                        <StyledLabel></StyledLabel>
                                                        <StyledInput
                                                            select
                                                            variant='standard'
                                                            value={priceInterval}
                                                            error={priceInterval?.length > 0 ? false : error}
                                                            onChange={(e) => { setPriceInterval(e.target.value); setError(false) }}
                                                            fullWidth
                                                            placeholder=''>
                                                            <MenuItem value={'daily'}>{t('agentdashboard.addlisting.tab6.daily')}</MenuItem>
                                                            <MenuItem value={'weekly'}>{t('agentdashboard.addlisting.tab6.weekly')}</MenuItem>
                                                            <MenuItem value={'monthly'}>{t('agentdashboard.addlisting.tab6.monthly')}</MenuItem>
                                                            <MenuItem value={'yearly'}>{t('agentdashboard.addlisting.tab6.yearly')}</MenuItem>
                                                            <MenuItem value={'one_time'}>{t('agentdashboard.addlisting.tab6.onetime')}</MenuItem>
                                                        </StyledInput>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <StyledLabel>{t('agentdashboard.addoffplan.tab2.currency')}</StyledLabel>
                                                    <StyledInput
                                                        select
                                                        value={currency}
                                                        error={currency?.length > 0 ? false : error}
                                                        onChange={(e) => { setCurrency(e.target.value); setError(false) }}
                                                        variant='standard'
                                                        fullWidth
                                                        placeholder={''}
                                                    >
                                                        <MenuItem value={'GHS'}>{t('agentdashboard.addoffplan.tab2.ghs')}</MenuItem>
                                                        <MenuItem value={'USD'}>{t('agentdashboard.addoffplan.tab2.usd')}</MenuItem>
                                                    </StyledInput>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <StyledLabel>{t('agentdashboard.addoffplan.tab2.squarefoot')}</StyledLabel>
                                                    <StyledInput
                                                        type="number"
                                                        onKeyDown={(e) => {
                                                            if (e.keyCode === 38 || e.keyCode === 40) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onWheel={(e) => e.target.blur()}
                                                        value={propertySize}
                                                        onChange={(e) => setPropertySize(e.target.value)}
                                                        variant='standard'
                                                        fullWidth
                                                        placeholder={''}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <StyledLabel>{t('agentdashboard.addoffplan.tab2.transactiontype')}</StyledLabel>
                                                    <StyledInput
                                                        select
                                                        value={transactionType}
                                                        error={transactionType?.length > 0 ? false : error}
                                                        onChange={(e) => { setTransactionType(e.target.value); setError(false) }}
                                                        variant='standard'
                                                        fullWidth
                                                        placeholder={''}
                                                    >
                                                        <MenuItem value={'rent'}>{t('agentdashboard.addlisting.tab2.rent')}</MenuItem>
                                                        <MenuItem value={'sale'}>{t('agentdashboard.addlisting.tab2.sale')}</MenuItem>
                                                    </StyledInput>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                                    <StyledLabel>{t('agentdashboard.addoffplan.tab2.propertystatus')}</StyledLabel>
                                                    <StyledInput
                                                        select
                                                        value={propertyStatus}
                                                        error={propertyStatus?.length > 0 ? false : error}
                                                        onChange={(e) => { setPropertyStatus(e.target.value); setError(false) }}
                                                        variant='standard'
                                                        fullWidth
                                                        placeholder={''}
                                                    >
                                                        <MenuItem value={'available'}>{t('agentdashboard.addoffplan.tab2.available')}</MenuItem>
                                                        <MenuItem value={'sold'}>{t('agentdashboard.addoffplan.tab2.sold')}</MenuItem>
                                                        <MenuItem value={'rented'}>{t('agentdashboard.addoffplan.tab2.rented')}</MenuItem>
                                                    </StyledInput>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Box>
                                                        <Typography variant='h6'>{t('agentdashboard.addoffplan.tab2.upload')}</Typography>
                                                        <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab5.note')}</Typography>

                                                        <input id="property-photo" type={'file'} accept="image/x-png,image/gif,image/jpeg, image/jpg" onChange={getFloorPlan} style={{ display: 'none' }} />
                                                        <label htmlFor="property-photo" style={{ cursor: "pointer" }}>
                                                            <Box sx={{ borderRadius: '15px', border: `1px dashed ${grey[300]}`, padding: '3rem' }}>
                                                                <Typography textAlign={'center'}>{t('agentdashboard.addoffplan.tab5.clickhere')}</Typography>
                                                                <Typography textAlign={'center'} sx={{ fontSize: '.8rem' }} color='GrayText'>{t('agentdashboard.addoffplan.tab5.size')}</Typography>
                                                            </Box>
                                                        </label>
                                                    </Box>
                                                </Grid>

                                                {
                                                    floorPlan?.map((el, index) => {
                                                        return (
                                                            <Grid key={index} item sm={4} mb={4}>
                                                                <ImagePreview>
                                                                    <img src={el?.uri} style={{ width: "200px", height: "200px", objectFit: "cover" }} alt="" />
                                                                    <IconButton onClick={() => { setFloorPlan(prev => { return prev.filter((n, i) => i !== index) }) }} sx={{
                                                                        bgcolor: 'primary.main', position: 'absolute', top: '6%', right: '7%', padding: '.4rem', '&:hover': {
                                                                            bgcolor: 'primary.main'
                                                                        }
                                                                    }}>
                                                                        <Delete sx={{ color: '#fff' }} fontSize='small' />
                                                                    </IconButton>
                                                                </ImagePreview>
                                                            </Grid>
                                                        )
                                                    })
                                                }
                                            </Grid>
                                        </>
                                    }
                                </Box>

                            }

                            {/* Unique features */}
                            {
                                page === 2 &&
                                <>
                                    <div id="map" className="h-full hidden" />
                                    <Box>
                                        <Typography variant='h6'>{t('agentdashboard.addoffplan.tab3.title')}</Typography>
                                        <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab3.note')}</Typography>

                                        <Stack>
                                            <StyledLabel>{t('agentdashboard.addoffplan.tab3.enter')}</StyledLabel>
                                            <StyledInput
                                                variant='standard'
                                                value={newFeature}
                                                onChange={(e) => setNewFeature(e.target.value)}
                                                onKeyDown={(event) => {
                                                    if (event.keyCode === 13) {
                                                        document.getElementById('feature-add').click()
                                                    }
                                                }
                                                }
                                                fullWidth
                                                placeholder=''
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        <Button id="feature-add" startIcon={<Add fontSize='small' />}
                                                            variant='text'
                                                            sx={{ textTransform: 'none' }}
                                                            onClick={() => addFeature()}
                                                        >
                                                            {t('agentdashboard.addoffplan.tab3.add')}
                                                        </Button>
                                                    </InputAdornment>
                                                }}
                                            />

                                            <Box mb={'3rem'}>
                                                <Grid container>
                                                    {
                                                        uniquefeatures.map((el) => {
                                                            return (
                                                                <Grid item sm={6} key={el?.name}>
                                                                    <FormControlLabel sx={{
                                                                        '& span': {
                                                                            fontSize: '.9rem'
                                                                        }
                                                                    }} control={<Checkbox value={el?.name} checked={el?.active} onChange={(e) => { getUniquefeatures(e, el) }} />} label={el?.name} />
                                                                </Grid>
                                                            )
                                                        })
                                                    }
                                                </Grid>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </>
                            }

                            {/* Amenities */}
                            {
                                page === 3 &&
                                <>
                                    <div id="map" className="h-full hidden" />
                                    <Box>
                                        <Typography variant='h6'>{t('agentdashboard.addoffplan.tab4.title')}</Typography>
                                        <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab4.note')}</Typography>

                                        <Stack>
                                            <StyledLabel>{t('agentdashboard.addoffplan.tab4.search')}</StyledLabel>
                                            <StyledInput
                                                variant='standard'
                                                fullWidth
                                                onChange={(e) => setSearchAmenities(e.target.value)}
                                                autoFocus
                                                placeholder=''
                                                InputProps={{
                                                    endAdornment: <InputAdornment position='end'>
                                                        <Search fontSize='small' />
                                                    </InputAdornment>
                                                }} />

                                            <Box>
                                                <Typography mb={3} sx={{ fontWeight: 600 }}>{t('agentdashboard.addoffplan.tab4.popular')}</Typography>
                                                {
                                                    amenities.filter((el) => el?.label?.toLocaleLowerCase().includes(searchAmenities.toLocaleLowerCase())).map(el => {
                                                        return (
                                                            <FlexWrap key={el?.key}>
                                                                <StyledLabel>{el?.label}</StyledLabel>
                                                                <Switch color='primary' value={el.title} checked={popularAmenities?.some((ed) => ed?.title === el?.key)} onChange={(e) => getAmenities(e, el?.key, el?.label)} />
                                                            </FlexWrap>
                                                        )
                                                    })
                                                }
                                            </Box>
                                        </Stack>
                                    </Box>
                                </>
                            }

                            {/* Gallery */}
                            {
                                page === 4 &&
                                <>
                                    <div id="map" className="h-full hidden" />
                                    <Box>
                                        <Typography variant='h6'>{t('agentdashboard.addoffplan.tab5.title')}</Typography>
                                        <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab5.note')}</Typography>

                                        <input id="property-photo" type={'file'} accept="image/x-png,image/gif,image/jpeg, image/jpg" multiple onChange={getImage} style={{ display: 'none' }} />
                                        <label htmlFor="property-photo" style={{ cursor: "pointer" }}>
                                            <Box sx={{ borderRadius: '15px', border: `1px dashed ${grey[300]}`, padding: '3rem' }}>
                                                <Typography textAlign={'center'}>{t('agentdashboard.addoffplan.tab5.clickhere')}</Typography>
                                                <Typography textAlign={'center'} sx={{ fontSize: '.8rem' }} color='GrayText'>{t('agentdashboard.addoffplan.tab5.size')}</Typography>
                                            </Box>
                                        </label>
                                        <Box my={'2rem'} sx={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
                                            <label htmlFor="" style={{ cursor: "pointer", width: "100%" }}>
                                                <Box bgcolor={grey[200]} sx={{ borderRadius: '10px', textAlign: 'center', padding: '1.5rem', flex: 1 }}>
                                                    <ViewInAr sx={{ fontSize: '2rem', my: '1rem' }} />
                                                    <Typography textAlign={'center'} sx={{ fontSize: '1rem' }}>{t('agentdashboard.addoffplan.tab5.image')}</Typography>
                                                    <Typography textAlign={'center'} sx={{ fontSize: '.8rem' }} color='GrayText'>{t('agentdashboard.addoffplan.tab5.imagenote')}</Typography>
                                                    <Typography textAlign={'center'} sx={{ fontSize: '1rem' }} color='GrayText'><b>{t('comingsoon.title')}</b></Typography>
                                                </Box>
                                            </label>

                                            <input id="property-video" type={'file'} accept="video/*" style={{ display: 'none' }} />
                                            <label htmlFor="property-video" style={{ cursor: "pointer", width: "100%" }}>
                                                <Box bgcolor={grey[200]} sx={{ borderRadius: '10px', textAlign: 'center', padding: '1.5rem', flex: 1 }}>
                                                    <Videocam sx={{ fontSize: '2rem', my: '1rem' }} />
                                                    <Typography textAlign={'center'} sx={{ fontSize: '1rem' }}>{t('agentdashboard.addoffplan.tab5.video')}</Typography>
                                                    <Typography textAlign={'center'} sx={{ fontSize: '.8rem' }} color='GrayText'>{t('agentdashboard.addlisting.tab5.videonote')}</Typography>
                                                    <Typography textAlign={'center'} sx={{ fontSize: '1rem' }} color='GrayText'><b>{t('comingsoon.title')}</b></Typography>
                                                </Box>
                                            </label>
                                        </Box>

                                        {/* Selected Images display */}
                                        <Grid container spacing={2}>
                                            {/* {videos?.map((el, index) => {
                                                return (
                                                    <Grid key={index} item sm={4} mb={4}>
                                                        <ImagePreview>
                                                            <Player
                                                                playsInline
                                                                src={el}
                                                                fluid={false}
                                                                width={'100%'}
                                                                height={200}
                                                            />
                                                            <IconButton onClick={() => { setVideos(prev => { return prev.filter((n, i) => i !== index) }) }} sx={{
                                                                bgcolor: 'primary.main', position: 'absolute', top: '6%', right: '6%', padding: '.4rem', '&:hover': {
                                                                    bgcolor: 'primary.main'
                                                                }
                                                            }}>
                                                                <Delete sx={{ color: '#fff' }} fontSize='small' />
                                                            </IconButton>
                                                        </ImagePreview>
                                                    </Grid>
                                                )
                                            })
                                            } */}

                                            {
                                                pictures?.map((el, index) => {
                                                    return (
                                                        <Grid key={index} item sm={4} mb={4}>
                                                            <ImagePreview sx={{
                                                                color: 'transparent', '&:hover': {
                                                                    color: 'white'
                                                                }
                                                            }}>
                                                                <img src={el} style={{ width: "200px", height: "200px", objectFit: "cover" }} alt="" />
                                                                <IconButton onClick={() => { setPictures(prev => { return prev.filter((n, i) => i !== index) }) }} sx={{
                                                                    bgcolor: 'primary.main', position: 'absolute', top: '6%', right: '7%', padding: '.4rem', '&:hover': {
                                                                        bgcolor: 'primary.main'
                                                                    }
                                                                }}>
                                                                    <Delete sx={{ color: '#fff' }} fontSize='small' />
                                                                </IconButton>
                                                                {index > 0 && <ArrowCircleLeftTwoTone onClick={() => { movePicture(index, 'left') }} sx={{
                                                                    position: 'absolute', bottom: '6%', left: '7%', padding: '.4rem', cursor: 'pointer'
                                                                }} fontSize='large' />}
                                                                {index < pictures.length - 1 && <ArrowCircleRightTwoTone onClick={() => { movePicture(index, 'right') }} sx={{
                                                                    position: 'absolute', bottom: '6%', right: '7%', padding: '.4rem', cursor: 'pointer'
                                                                }} fontSize='large' />}
                                                            </ImagePreview>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                    </Box>
                                </>
                            }

                            {/* Attachment */}
                            {
                                page === 5 &&
                                <Box>
                                    <div id="map" className="h-full hidden" />
                                    <Typography variant='h6'>{t('agentdashboard.addoffplan.tab6.title')}</Typography>
                                    <Typography variant='body2' mb={'3rem'} color={'GrayText'}>{t('agentdashboard.addoffplan.tab6.note')}</Typography>

                                    <input id="land-title" ref={landtitleInput} multiple="multiple" type={'file'} onChange={(e) => getLandTitle(e, "land_title")} accept="application/msword, application/pdf, image/x-png,image/gif,image/jpeg, image/jpg" style={{ display: 'none' }} />
                                    <StyledLabel><b>{t('agentdashboard.addoffplan.tab6.landtitle')}</b></StyledLabel>
                                    <StyledInput value={landTitle} variant='standard' fullWidth placeholder='' InputProps={{
                                        endAdornment: <InputAdornment position='end'>

                                            <Button onClick={() => landtitleInput.current.click()} variant='text' disableRipple size='small' startIcon={<Add fontSize='small' />} sx={{ textTransform: 'none' }}>{t('agentdashboard.addoffplan.button.add')}</Button>
                                            {/* <IconButton><Delete fontSize='small' /></IconButton> */}
                                        </InputAdornment>
                                    }} />

                                    <input id="building-permit" ref={buildingPermitInput} type={'file'} onChange={(e) => getBuildingPermit(e, "building_permit")} accept="application/msword, application/pdf, image/x-png,image/gif,image/jpeg, image/jpg" style={{ display: 'none' }} />
                                    <StyledLabel><b>{t('agentdashboard.addoffplan.tab6.buildingpermit')}</b></StyledLabel>
                                    <StyledInput value={buildingPermit} variant='standard' fullWidth placeholder='' InputProps={{
                                        endAdornment: <InputAdornment position='end'>
                                            <Button onClick={() => buildingPermitInput.current.click()} variant='text' disableRipple size='small' startIcon={<Add fontSize='small' />} sx={{ textTransform: 'none' }}>{t('agentdashboard.addoffplan.button.add')}</Button>
                                            {/* <IconButton><Delete fontSize='small' /></IconButton> */}
                                        </InputAdornment>
                                    }} />

                                    <input id="house-plan" ref={planInput} type={'file'} onChange={(e) => getPlan(e, "house_plan")} accept="application/msword, application/pdf, image/x-png,image/gif,image/jpeg, image/jpg" style={{ display: 'none' }} />
                                    <StyledLabel><b>{t('agentdashboard.addoffplan.tab6.plan')}</b></StyledLabel>
                                    <StyledInput value={housePlan} variant='standard' fullWidth placeholder='' InputProps={{
                                        endAdornment: <InputAdornment position='end'>
                                            <Button onClick={() => planInput.current.click()} variant='text' disableRipple size='small' startIcon={<Add fontSize='small' />} sx={{ textTransform: 'none' }}>{t('agentdashboard.addoffplan.button.add')}</Button>
                                            {/* <IconButton><Delete fontSize='small' /></IconButton> */}
                                        </InputAdornment>
                                    }} />
                                </Box>
                            }

                            {/* Congratulations */}
                            {
                                page === 6 &&
                                <>
                                    <div id="map" className="h-full hidden" />
                                    <Box height={'100%'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={Finish} width='70%' alt={'finish'} />
                                        <Typography variant='h6' sx={{ fontWeight: 600 }}>{t('agentdashboard.addoffplan.tab7.title')}</Typography>

                                        {!editData?.published || !editMode ?
                                            <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography variant='h7' sx={{ fontWeight: 600, textAlign: "center" }}>{t('agentdashboard.addlisting.tab8.publishnote')}</Typography>
                                                <RoundButton
                                                    onClick={() => publishProperty(true)}
                                                    sx={{ margin: '1.5rem 0', width: '15rem', textAlign: "center" }}
                                                    size={'small'}
                                                    variant={'contained'}
                                                    disableElevation
                                                    text={publishLoading ? <CircularProgress
                                                        size={20}
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            color: "#fff",
                                                            margin: "3px 0"
                                                        }}
                                                    /> : t('agentdashboard.addlisting.tab8.publish')}
                                                    color='primary'
                                                />
                                            </Box> : ""}

                                        <Typography mb={'2rem'} sx={{ fontSize: '.9rem' }} color={'GrayText'}>{t('agentdashboard.addoffplan.tab7.note')}</Typography>
                                        <Link to={`/development/${editMode && loc?.state?.type !== "draft" ? loc?.state?.id : propertyId}/details`}>
                                            <RoundButton sx={{ marginBottom: '1.5rem', width: '15rem' }} size={'small'} variant={'contained'} disableElevation text={t('agentdashboard.addoffplan.button.toproperties')} color='primary' />
                                        </Link>
                                        {getUserType() === 'admin' || getUserType() === 'support' ?
                                            <div onClick={() => window.location.reload(false)}><RoundButton size={'small'} sx={{ width: '15rem' }} variant={'outlined'} disableElevation text={t('agentdashboard.addoffplan.button.addmore')} /></div>
                                            :
                                            <a href="/broker/offplan-listing"><RoundButton size={'small'} sx={{ width: '15rem' }} variant={'outlined'} disableElevation text={t('agentdashboard.addoffplan.button.addmore')} /></a>
                                        }
                                    </Box>
                                </>
                            }

                            {/* Actions */}
                            {noEditData || page === 6 ? null :
                                page === 7 ? null :
                                    <Box mt={'3rem'}>
                                        {page === 0 && page === 6 ? null :
                                            <RoundButton onClick={stepBack} disabled={loading} text={t('agentdashboard.addoffplan.button.back')} disableElevation variant={'outlined'} sx={{ padding: '.5rem 1.5rem' }} />
                                        }
                                        <RoundButton
                                            onClick={nextPage}
                                            text={page === 5 ? loading || (editMode ? (draftId ? t('agentdashboard.addlisting.button.submit') : t('agentdashboard.addlisting.button.update')) : t('agentdashboard.addlisting.button.submit')) : t('agentdashboard.addlisting.button.continue')}
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
                                            disableElevation variant={'contained'}
                                            color='primary' sx={{ padding: '.5rem 1.5rem', marginLeft: '1rem' }}
                                            disable={loading}
                                        />
                                    </Box>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </motion.div>
    )
}

export default DevListing