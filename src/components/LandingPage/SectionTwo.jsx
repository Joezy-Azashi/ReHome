import React from 'react'
import { Grid } from '@mui/material';
import PillButton from "../Buttons/PillButton"
import { useTranslation } from "react-i18next";
import handpresenting from "../../assets/images/handpresenting.png"
import callgirl from "../../assets/images/callgirl.png"

function SectionTwo() {
    const { t } = useTranslation()

    return (
        <div className="bg-[#03254C]">
            <div className='pageMargins md:mx-32 ipad:mx-2 ipad-pro:mx-3 py-20'>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item sm={7} sx={{ color: "#FFFFFF" }} mb={4}>
                        <h2 className='font-semibold pt-10' dangerouslySetInnerHTML={{ __html: t('sectiontwo.maintext') }} />

                        <p className='py-5'>{t('sectiontwo.subtextone')}</p>

                        <div className="pb-6">
                            <div className='flex items-center mb-1'>
                                <hr className='w-[20px] mr-2' />
                                <p>
                                    {t('sectiontwo.subtexttwo')}
                                </p>
                            </div>
                            <div className='flex items-center mb-1'>
                                <hr className='w-[20px] mr-2' />
                                <p>
                                    {t('sectiontwo.subtextthree')}
                                </p>
                            </div>

                            <div className='flex items-center mb-1'>
                                <hr className='w-[20px] mr-2' />
                                <p>
                                    {t('sectiontwo.subtextfour')}
                                </p>
                            </div>
                        </div>

                        <div className="">
                            <PillButton
                                text={t('sectiontwo.button')}
                                size="small"
                                width="120px"
                                borderColor=""
                                color=""
                                backgroundColor="main.primary"
                                variant="contained"
                            />
                        </div>
                    </Grid>

                    <Grid item sm={5}>
                        <Grid container spacing={1}>
                            <Grid item sm={6} style={{ display: "flex", justifyContent: "end" }}>
                                <img src={handpresenting} width={160} alt="" />
                            </Grid>

                            <Grid item sm={6}>
                                <img src={callgirl} className="pb-[5px]" width={180} alt="" />
                                <img src={callgirl} className="pt-[5px]" width={180} alt="" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default SectionTwo