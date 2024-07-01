import React from 'react'
import { Grid, Card } from '@mui/material';
import { useTranslation } from "react-i18next";
import buy from "../../assets/images/buy.svg"
import rent from "../../assets/images/rent.svg"
import sell from "../../assets/images/sell.svg"
import PillButton from "../Buttons/PillButton"

function SectionOne() {
    const { t } = useTranslation()

    return (
        <div className='bg-[#F7F7F7]'>
            <div className='pageMargins py-20'>
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    <Grid item sm={4} sx={{display: "flex", justifyContent: "center"}}>
                        <Card sx={{ padding: "25px", textAlign: "center", width: "260px", borderRadius: "14px", boxShadow: "0" }}>
                            <div className='flex justify-center'>
                                <img src={buy} width={45} alt="" />
                            </div>

                            <p className='py-8 font-semibold text-[17px]'>{t('sectionone.buy')}</p>

                            <p className='pb-8'>{t('sectionone.subtext')}</p>

                            <div className="">
                                <PillButton
                                    text={t('sectionone.button')}
                                    size="small"
                                    width="120px"
                                    borderColor="primary.main"
                                    color=""
                                    variant="outlined"
                                />
                            </div>
                        </Card>
                    </Grid>

                    <Grid item sm={4} sx={{display: "flex", justifyContent: "center"}}>
                    <Card sx={{ padding: "25px", textAlign: "center", width: "260px", borderRadius: "14px", boxShadow: "0" }}>
                            <div className='flex justify-center'>
                                <img src={rent} width={45} alt="" />
                            </div>

                            <p className='py-8 font-semibold text-[17px]'>{t('sectionone.rent')}</p>

                            <p className='pb-8'>{t('sectionone.subtext')}</p>

                            <div className="">
                                <PillButton
                                    text={t('sectionone.button')}
                                    size="small"
                                    width="120px"
                                    borderColor="primary.main"
                                    color=""
                                    variant="outlined"
                                />
                            </div>
                        </Card>
                    </Grid>

                    <Grid item sm={4} sx={{display: "flex", justifyContent: "center"}}>
                    <Card sx={{ padding: "25px", textAlign: "center", width: "260px", borderRadius: "14px", boxShadow: "0" }}>
                            <div className='flex justify-center'>
                                <img src={sell} width={45} alt="" />
                            </div>

                            <p className='py-8 font-semibold text-[17px]'>{t('sectionone.sell')}</p>

                            <p className='pb-8'>{t('sectionone.subtext')}</p>

                            <div className="">
                                <PillButton
                                    text={t('sectionone.button')}
                                    size="small"
                                    width="120px"
                                    borderColor="primary.main"
                                    color=""
                                    variant="outlined"
                                />
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default SectionOne