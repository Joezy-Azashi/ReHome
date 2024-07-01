import React, {useState} from 'react'
import { Box, alpha, Dialog, DialogContent, Grid, ImageList, ImageListItem, Tab, IconButton} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import styled from '@emotion/styled'
import { Close } from '@mui/icons-material'
import OwlCarousel from 'react-owl-carousel'
import { useTranslation } from "react-i18next";

const PropertySlider = styled(OwlCarousel)(({ theme }) => ({
    '& .owl-carousel': {
        position: 'relative',
        '&:hover .owl-nav': {
            opacity: 1
        }
    },
    '& .owl-nav': {
        // opacity: 0,
        width: '100%',
        position: 'absolute',
        display: 'flex',
        top: '30%',
        justifyContent: 'space-between',
        transform: 'TranslateY(50%)',
        transition: 'all .2s ease-in'
    },
    '& .owl-prev': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'

    },
    '& .owl-next': {
        padding: '1rem',
        background: alpha('#000', 0.5),
        color: '#fff'
    }
}))

const previewHeight = '65vh'

function UnitPreview({floorPlan, unitView, setUnitView}) {
    const { t } = useTranslation();

    const [item, setItem] = useState(0)

    return (
        <Dialog open={unitView} onClose={() => { setUnitView(false) }} fullWidth maxWidth='lg'>
            <DialogContent sx={{ padding: '0 !important' }}>
                <TabContext value={"1"}>
                    <Box sx={{ borderBottom: 1, borderColor: 'lightgrey', bgcolor: 'secondary.main', color: '#fff', padding: '1rem', display: 'flex', justifyContent: "space-between" }}>
                        <TabList textColor='#fff' aria-label="lab API tabs example">
                            <Tab sx={{ color: '#fff' }} label={t('singleproperty.gallery')} value="1" />
                        </TabList>
                        <IconButton onClick={()=> { setItem(0); setUnitView(false)}}><Close color='paper' fontSize='small' /></IconButton>
                    </Box>
                    {/* Gallery */}
                    <TabPanel value="1" sx={{ padding: '1rem' }}>
                        <Grid container spacing={3}>
                            <Grid item sm={3}>
                                <Box sx={{ overflowY: 'scroll', height: previewHeight, padding: '0 .8rem' }}>
                                    <ImageList variant='quilted' id='imgList' cols={1} gap={10} sx={{ margin: 0 }}>
                                        {
                                            floorPlan?.documents?.map((img, index) => {
                                                return (
                                                    <ImageListItem key={index} onClick={()=> setItem(index)} sx={{cursor: "pointer"}}>
                                                        <img src={`${img?.uri}?fit=crop&auto=format`} style={{ borderRadius: '6px', height: "10rem" }} alt={`property_img_${index}`} loading='lazy' />
                                                    </ImageListItem>
                                                )
                                            })
                                        }

                                    </ImageList>
                                </Box>
                            </Grid>
                            <Grid item sm={9}>
                                <PropertySlider
                                    items={1} margin={10} loop={true} autoPlay={true} autoplaySpeed={3000}
                                    nav={true} navElement="div" navText={[
                                        `<i class='fas fa-arrow-left'></i>`, `<i class='fas fa-arrow-right'></i>`]}
                                    responsive={{ 1400: { items: '1' }, 1200: { items: '1' }, 760: { items: '1' }, 340: { items: '1' } }} startPosition={item}
                                >
                                    {
                                        floorPlan?.documents?.map((item, index) => {
                                            return (
                                                <Box key={index} sx={{
                                                    backgroundImage: `url(${item?.uri})`,
                                                    backgroundSize: 'contain',
                                                    backgroundRepeat: "no-repeat",
                                                    backgroundPosition: 'center',
                                                    width: '100%', height: previewHeight,
                                                    borderRadius: '10px',
                                                    // objectFit: 'fill'
                                                }}

                                                />
                                            )

                                        })
                                    }
                                </PropertySlider>
                            </Grid>
                        </Grid>
                    </TabPanel>

                </TabContext>
            </DialogContent>
        </Dialog>
    )
}

export default UnitPreview