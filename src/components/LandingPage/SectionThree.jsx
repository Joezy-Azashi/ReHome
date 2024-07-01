import React from 'react'
import { Grid } from '@mui/material';
import { useTranslation } from "react-i18next";
import handphone from "../../assets/images/handphone.png"
import appledownload from "../../assets/images/appledownload.svg"
import googledownload from "../../assets/images/googledownload.svg"

function SectionThree() {
    const { t } = useTranslation()

    return (
        <div className="bg-[#F7F7F7]">
            <div className='pageMargins pt-20'>
                <Grid container justifyContent="center">
                    <Grid item sm={6} sx={{ color: "#FFFFFF", display: "flex", justifyContent: "center" }}>
                        <img src={handphone} width={400} alt="" />
                    </Grid>

                    <Grid item sm={6}>
                        <h2 className='font-semibold pt-10' dangerouslySetInnerHTML={{ __html: t('sectionthree.maintext') }} />

                        <p className='py-5' dangerouslySetInnerHTML={{ __html: t('sectionthree.subtext') }} />

                        <div className='flex mb-5'>
                            <img src={appledownload} width={160} className="mr-2" alt="" />
                            <img src={googledownload} width={175} alt="" />
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default SectionThree