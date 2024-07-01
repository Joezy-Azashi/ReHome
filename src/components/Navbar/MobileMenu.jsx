import React, {useState} from 'react';
import DialogContent from '@mui/material/DialogContent';
import PillButton from '../Buttons/PillButton';
import { useTranslation } from "react-i18next";
import signUp from '../../assets/images/signUpIcon.png'
import login from '../../assets/images/loginIcon.png'
import { isLoggedIn } from '../../services/auth';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import CurrencySelection from '../CurrencySelection/CurrencySelection';

export default function MobileMenu({setMobileMenu, language, setLanguage, currency, setCurrency}) {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [loggedin] = useState(isLoggedIn());


  const active = useLocation().pathname.split('/')[1]

    return (
        <div>
            <DialogContent style={{
                position: "fixed",
                left: "0",
                top: "75px",
                height: "100%",
                width: "15rem",
                backgroundColor: "#FFFFFF",
                padding: "10px 15px",
            }}>
                <div className='grid grid-cols-1 md:gap-7 gap-4 items-center text-[18px]'>
                    <NavLink onClick={()=>setMobileMenu(false)} to="/buy" className='mobileMenuTitles'><p style={{ color: active === 'buy' && '#1267B1', fontWeight: active === 'buy' && 'bolder' }}  className='text-[20px]'>{t('navbar.buy')}</p></NavLink>
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    <NavLink onClick={()=>setMobileMenu(false)} to="/rent" className='mobileMenuTitles'><p style={{ color: active === 'rent' && '#1267B1', fontWeight: active === 'rent' && 'bolder' }}  className='text-[20px]'>{t('navbar.rent')}</p></NavLink>
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    {/* <NavLink onClick={()=>setMobileMenu(false)} to="/sell" className='mobileMenuTitles'><p style={{ color: active === 'sell' && '#1267B1', fontWeight: active === 'sell' && 'bolder' }}  className='text-[20px]'>{t('navbar.sell')}</p></NavLink> */}
                    <NavLink onClick={()=>setMobileMenu(false)} to="/shortlet" className='mobileMenuTitles'><p style={{color: active === 'shortlet' && '#1267B1', fontWeight: active === 'shortlet' && 'bolder' }}  className='text-[18px]'>{t('navbar.shortlet')}</p></NavLink>
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    <NavLink onClick={()=>setMobileMenu(false)} to="/off-plan" className='mobileMenuTitles'><p style={{ color: (active === 'off-plan' || active === 'development') && '#1267B1', fontWeight: (active === 'off-plan' || active === 'development') && 'bolder' }} className='text-[20px]'>{t('navbar.offplan')}</p></NavLink>
                    {/* <NavLink onClick={()=>setMobileMenu(false)} to="/mortgage" className='mobileMenuTitles'><p style={{ color: active === 'mortgage' && '#1267B1', fontWeight: active === 'mortgage' && 'bolder' }}  className='text-[20px]'>{t('navbar.mortgage')}</p></NavLink> */}
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    <NavLink onClick={()=>setMobileMenu(false)} to="/find-a-broker" className='mobileMenuTitles'><p style={{ color: active === 'find-a-broker' && '#1267B1', fontWeight: active === 'find-a-broker' && 'bolder' }}  className='text-[20px]'>{t('navbar.findanAgent')}</p></NavLink>
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    <NavLink onClick={()=>setMobileMenu(false)} to="//blog.rehomeafrica.com/" target="_blank" rel="noreferrer" className="mobileMenuTitles"><p className='text-[20px]'>{t('navbar.blog')}</p></NavLink>
                    <div style={{ width: '100%', borderBottomColor: 'lightgrey', borderBottomWidth: '1px'}}></div>
                    <div className='flex justify-between'>
                        <LanguageSelection language={language} setLanguage={setLanguage} />
                        <CurrencySelection currency={currency} setCurrency={setCurrency} />
                    </div>
                    {!loggedin ? (
                        <>
                            <div className='sm:hidden block' onClick={() => navigate('/login')}>
                                <PillButton
                                    text={t('navbar.login')}
                                    size="small"
                                    width="140px"
                                    borderColor=""
                                    color="#FFFFFF"
                                    backgroundColor="#1267B1"
                                    startIcon={login}
                                    variant="contained"
                                />
                            </div>

                            <div className='sm:hidden block' onClick={() => navigate('/signup')}>
                                <PillButton
                                    text={t('navbar.signup')}
                                    size="small"
                                    width="140px"
                                    borderColor="rgba(0, 0, 0, 0.3)"
                                    color="#000000"
                                    startIcon={signUp}
                                    variant="outlined"
                                />
                            </div>
                        </>
                    ) : (
                        null
                    )}


                </div>

            </DialogContent>
        </div>
    );
}
