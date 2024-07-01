import React from 'react'
import { Grid, Tooltip, Typography } from '@mui/material';
import loginLogo from '../../assets/images/rehomelogowhite.svg'
import footerbase from '../../assets/images/footerbase.png'
import facebook from "../../assets/images/facebook.svg"
import linkedin from "../../assets/images/linkedin.svg"
import instagram from "../../assets/images/instagram.svg"
import twitter from "../../assets/images/twitter.svg"
import applewhite from "../../assets/images/applewhite.svg"
import googlewhite from "../../assets/images/googlewhite.svg"
import { useTranslation } from "react-i18next";
import { HashLink } from 'react-router-hash-link'
import { NavLink } from 'react-router-dom'
import { CallOutlined, WhatsApp } from '@mui/icons-material'

function Footer() {
  const { t } = useTranslation()

  return (
    <div className="bg-[#03254C]">
      <div className='pageMargins ipad:mx-2 ipad-pro:mx-3 pt-20'>
        <Grid container spacing={2} color={"#BCBABA"}>
          <Grid item xs={12} sm={3} sx={{ color: "#FFFFFF", margin: "0 auto" }} mb={4}>
            <div className='flex justify-center mb-7'>
              <NavLink to='/'>
                <img src={loginLogo} width={145} alt="logo" />
              </NavLink>
            </div>

            <div className='flex justify-center'>
              <Tooltip title={"Facebook"} arrow>
                <NavLink to={`//facebook.com/profile.php?id=100089093282425&mibextid=ZbWKwL&_rdc=2&_rdr`} target="_blank" rel="noreferrer"><img src={facebook} width={30} alt="" /></NavLink>
              </Tooltip>

              <Tooltip title={"Twitter"} arrow>
                <NavLink to={`//twitter.com/therehomeafrica`} target="_blank" rel="noreferrer"><img src={twitter} width={30} alt="" className='mx-2' /></NavLink>
              </Tooltip>

              <Tooltip title={"LinkedIn"} arrow>
                <NavLink to={`//linkedin.com/company/re-home/`} target="_blank" rel="noreferrer"><img src={linkedin} width={30} alt="" className='mr-2' /></NavLink>
              </Tooltip>

              <Tooltip title={"Instagram"} arrow>
                <NavLink to={`//instagram.com/rehomeafrica/`} target="_blank" rel="noreferrer"><img src={instagram} width={30} alt="" /></NavLink>
              </Tooltip>
            </div>

            <div className='mt-7'>
              <NavLink to={`tel:+233200022057`} className='flex justify-center'>
                <CallOutlined sx={{ fontSize: "25px", marginRight: "6px" }} />
                <p>+233 200 022 057</p>
              </NavLink>

              <NavLink to="https://wa.me/233200022057" target="_blank" rel="noreferrer" className='flex justify-center mt-4' >
                <WhatsApp sx={{ fontSize: "25px", marginRight: "6px" }} />
                <p>+233 200 022 057</p>
              </NavLink>
            </div>
          </Grid>

          <Grid item xs={6} sm={2}>
            <p className='font-semibold'>{t('footer.menu')}</p>

            <NavLink to="/buy"><p className="mt-7">{t('footer.buy')}</p></NavLink>
            <NavLink to="/rent"><p className="mt-3">{t('footer.rent')}</p></NavLink>
            <NavLink to="/sell"><p className="mt-3">{t('footer.sell')}</p></NavLink>
            <NavLink to="/shortlet"><p className="mt-3">{t('footer.shortlet')}</p></NavLink>
            <NavLink to="/off-plan"><p className="mt-3">{t('footer.offplan')}</p></NavLink>
            <NavLink to="/mortgage"><p className="mt-3">{t('footer.mortgage')}</p></NavLink>
            <NavLink to="/find-a-broker"><p className="mt-3">{t('footer.findanAgent')}</p></NavLink>
            <NavLink to="//blog.rehomeafrica.com/" target="_blank" rel="noreferrer"><p className="mt-3 mb-5">{t('navbar.blog')}</p></NavLink>
          </Grid>

          <Grid item xs={6} sm={2}>
            <p className='font-semibold'>{t('footer.company')}</p>

            <NavLink to="/about"><p className="mt-7">{t('footer.aboutus')}</p></NavLink>
            <NavLink to={`//linkedin.com/company/re-home/`} target="_blank" rel="noreferrer"><p className="mt-3">{t('footer.careers')}</p></NavLink>
            <NavLink to="/advertise"><p className="mt-3">{t('footer.advertise')}</p></NavLink>
            <HashLink to={"/about#contactUs"}><p className="mt-3 mb-5">{t('footer.contactus')}</p></HashLink>
          </Grid>

          <Grid item sm={2}>
            <p className='font-semibold'>{t('footer.legal')}</p>

            <NavLink to="/privacypolicy"><p className="mt-7">{t('footer.privacypolicy')}</p></NavLink>
            <NavLink to="/terms&conditions"><p className="mt-3">{t('footer.termsconditions')}</p></NavLink>
            <NavLink to="/help"><p className="mt-3">{t('footer.legalhelp')}</p></NavLink>
            <NavLink to="/help"><p className="mt-3">{t('footer.faq')}</p></NavLink>
            <NavLink to="/data-request"><p className="mt-3 mb-5">{t('footer.datarequest')}</p></NavLink>
          </Grid>

          <Grid item sm={3} color={"#FFFFFF"} sx={{ display: "flex", alignItems: "end" }}>
            <div>
              <p className='py-7 text-center opacity-[0.5]'>{t('footer.download')}</p>

              <div className='flex md:block ipad-pro:block lg:flex opacity-[0.5]'>
                <img src={applewhite} width={170} className="mb-3 mr-2" alt="" />
                <img src={googlewhite} width={185} className="mb-3" alt="" />
              </div>

              <Typography variant='h6' sx={{margin: '.7rem auto', fontWeight: "400", textAlign: "center"}}>{t('comingsoon.title')}</Typography>
            </div>
          </Grid>

          <Grid item sm={12} sx={{ display: "flex", justifyContent: "center" }}>
            <img src={footerbase} className="lg:mt-[-40px]" alt="" />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Footer
