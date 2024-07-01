import './assets/css/custom.css'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'react-phone-number-input/style.css'
import i18n from './i18n';
import { useEffect, useState } from 'react'
import RateContext from './contexts/rateContext';
import { I18nextProvider } from 'react-i18next';
import ProvideAuth from "./components/ProvideAuth";
import { getUserType, isLoggedIn } from './services/auth';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import TagManager from 'react-gtm-module';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
import Navbar from './components/Navbar/Navbar'
import LandingPage from './pages/LandingPage'
import Sell from './pages/Sell';
import AgentFinder from './pages/AgentFinder';
import SingleAgent from './pages/SingleAgent';
import BuyRent from './pages/BuyRent';
import About from './pages/About';
import Dashboard from './pages/client/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Onboard from './pages/agents/Onboard';
import AgentDashboard from './pages/agents/AgentDashboard';
import SingleOffPlan from './pages/SingleOffPlan';
import ComingSoon from './pages/ComingSoon';
import Mortgage from './pages/Mortgage';
import { connect } from 'react-redux';
import AuthPage from './pages/auth/AuthPage';
import SelectUserType from './pages/auth/SelectUserType';
import OffPlan from './pages/OffPlan';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsCondition from './pages/T&C/TermsConditions';
import runOneSignal from './services/onesignal'
import SingleProperty from './pages/SingleProperty';
import Api from './api/api';
import { AnimatePresence } from "framer-motion";
import SnackbarCloseButton from './components/Notification.jsx/SnackbarCloseButton';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import MortgageCalculator from './components/MortgageCalculator';
import ErrorPage from './pages/ErrorPage';
import Help from './pages/Help';
import Advertise from './pages/Advertise';
import AdminDashboard from './pages/admin/AdminDashboard'
import RulesForUploading from './pages/RulesForUploading';
import ReactGA from "react-ga4";
import CookieConsent from 'react-cookie-consent';
import DataRequest from './pages/DataRequest';
import { useTranslation } from 'react-i18next';

const SITE_KEY = process.env.REACT_APP_SITE_KEY

function App() {

  const resetEN = () => {
    return localStorage.getItem("i18nextLng") === 'en-US' ? 'en' : localStorage.getItem("i18nextLng")
  }

  const resetCurrency = () => {
    return localStorage.getItem("currency") || 'GHS'
  }

  const [rates, setRates] = useState()
  const [preferredCurrency, setPreferredCurrency] = useState(resetCurrency())
  const [preferredLanguage, setPreferredLanguage] = useState(resetEN() || 'en') 
  const { t } = useTranslation();

  const handleAccept = () => {
    window.location.reload();
  };

  const handleDecline = () => {
    window.location.reload();
  };

  const loadTawkScript = () => {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/63dab388474251287910f476/1go74qjae';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }

  useEffect(() => {
    if(document.cookie.includes("ReHomeCookieConsent=false")){
      document.cookie = "ReHomeCookieConsent=false";
      return
    }
    loadTawkScript();
    TagManager.initialize({ gtmId: 'GTM-M3R3Z99' });
    ReactGA.initialize('G-2BCCLN6SR0');
    runOneSignal();
  }, []);

  useEffect(() => {
    if (!isLoggedIn() && localStorage.getItem('i18nextLng') === "en-US") {
      localStorage.setItem('i18nextLng', 'en')
      setPreferredLanguage(localStorage.getItem('i18nextLng'))
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn()) {
      Api().get("/me")
        .then((response) => {
          Api().get(`/exchange-rates/latest/${response?.data?.preferredCurrency}`)
            .then((res) => {
              setRates(res?.data)
              setPreferredCurrency(response?.data?.preferredCurrency)
              setPreferredLanguage(response?.data?.language)
            })
        })
        .catch(() => { })
    } else {
      setPreferredCurrency(preferredCurrency ? preferredCurrency : localStorage.getItem('currency') ? localStorage.getItem('currency') : 'GHS')
      Api().get(`/exchange-rates/latest/${preferredCurrency}`)
        .then((res) => {
          setRates(res?.data)
        })
    }

  }, [preferredCurrency])

  const convert = (currency, price) => {
    if (preferredCurrency === currency) {
      return price
    } else {
      const rate = rates?.length ? rates?.find((ex) => ex?.from === preferredCurrency && ex?.to === currency)?.rate : 1
      return (price / rate).toFixed()
    }
  }

  const thumbnail = (url) => {
    return url;
    if(url?.split('/pictures/').length>1){
      return url.split('/pictures/')[0] + '/pictures/thumbnail-' + url.split('/pictures/')[1];
    }
    return url;
  }

  return (
    <ProvideAuth>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <RateContext.Provider value={{ rates, setRates, preferredCurrency, setPreferredCurrency, preferredLanguage, setPreferredLanguage, convert, thumbnail }}>
            <BrowserRouter>

              <CookieConsent
                onAccept={handleAccept}
                onDecline={handleDecline}
                buttonText={t('cookie.accept')}
                declineButtonText={t('cookie.decline')}
                enableDeclineButton
                cookieName="ReHomeCookieConsent"
                style={{ backgroundColor: 'white', color: 'black', fontSize: '11px'}}
                buttonStyle={{ backgroundColor: '#1267B1', color: 'white', fontSize: '13px', fontWeight: 'bold' }}
                declineButtonStyle={{ color: '#1267B1', backgroundColor: 'white', border: '1px solid #1267B1', fontSize: '13px', fontWeight: '500' }}
                expires={365}
              >{t('cookie.description')}
              </CookieConsent>
                <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} preventDuplicate action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
                  <AnimatePresence>
                    <Routes>
                      <Route path="*" element={<Navbar page={<ErrorPage />} />} />
                      <Route path="/" element={<Navbar page={<LandingPage />} />} />
                      <Route path="/login" element={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AuthPage /></GoogleReCaptchaProvider>} />
                      <Route path="/signup" element={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AuthPage /></GoogleReCaptchaProvider>} />
                      <Route path="/select-user-type" element={<Secured><SelectUserType /></Secured>} />
                      <Route path="/forgot-password" element={<Navbar page={<ForgotPassword />} />} />
                      <Route path="/reset-confirm" element={<Navbar page={<ResetPassword />} />} />
                      <Route path="/about" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><About /></GoogleReCaptchaProvider>} />} />
                      <Route path="/help" element={<Navbar page={<Help />} />} />
                      <Route path="/data-request" element={<Navbar page={<DataRequest />} />} />
                      <Route path="/advertise" element={<Navbar page={<Advertise />} />} />
                      <Route path="/buy" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><BuyRent type="sale" /></GoogleReCaptchaProvider>} />} />
                      <Route path="/rent" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><BuyRent type="rent" /></GoogleReCaptchaProvider>} />} />
                      <Route path="/shortlet" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><BuyRent type="rent" shortlet={true} /></GoogleReCaptchaProvider>} />} />
                      {/* <Route path="/sell" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><Sell /></GoogleReCaptchaProvider>} />} /> */}
                      <Route path="/listing/:id/details" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><SingleProperty /></GoogleReCaptchaProvider>} />} />
                      <Route path="/coming-soon" element={<Navbar page={<ComingSoon />} />} />
                      {/* <Route path="/mortgage" element={<Navbar page={<Mortgage />} />} /> */}
                      {/* <Route path="/mortgage-calculator" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><MortgageCalculator /></GoogleReCaptchaProvider>} />} /> */}
                      <Route path="/off-plan" element={<Navbar page={<OffPlan type="development" />} />} />
                      <Route path="/development/:id/details" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><SingleOffPlan /></GoogleReCaptchaProvider>} />} />
                      <Route path="/find-a-broker" element={<Navbar page={<AgentFinder />} />} />
                      <Route path="/brokers/:name/:id" element={<Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><SingleAgent /></GoogleReCaptchaProvider>} />} />
                      <Route path="/client/profile" element={<Secured><Navbar page={<Dashboard />} /></Secured>} />
                      {/* <Route path="/client/listings" element={<Secured><Navbar page={<Dashboard />} /></Secured>} />
                      <Route path="/client/add-listing" element={<Secured><Navbar page={<Dashboard />} /></Secured>} />
                      <Route path="/client/edit-listing" element={<Secured><Navbar page={<Dashboard />} /></Secured>} /> */}
                      <Route path="/client/wishlist" element={<Secured><Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><Dashboard /></GoogleReCaptchaProvider>} /></Secured>} />
                      <Route path="/client/messages" element={<Secured><Navbar page={<Dashboard />} /></Secured>} />
                      <Route path="/client/notifications" element={<Secured><Navbar page={<Dashboard />} /></Secured>} />

                      <Route path="/broker/onboard" element={<Secured><Navbar page={<Onboard />} /></Secured>} />
                      <Route path="/broker/dashboard" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/profile" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/subscription" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/listings" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/newlisting" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/edit-listing" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/off-plan-listing" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/edit-off-plan" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      <Route path="/broker/stats" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />
                      {/* {<Route path="/broker/customer-search" element={<Secured><Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AgentDashboard /></GoogleReCaptchaProvider>} /></Secured>} /> } */}
                      {/* <Route path="/broker/enterprise-search" element={<Secured><Navbar page={<GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AgentDashboard /></GoogleReCaptchaProvider>} /></Secured>} /> */}
                      <Route path="/broker/help" element={<Secured><Navbar page={<AgentDashboard />} /></Secured>} />

                      <Route path="/coming-soon" element={<Navbar page={<ComingSoon />} />} />
                      <Route path="/privacypolicy" element={<Navbar page={<PrivacyPolicy />} />} />
                      <Route path="/terms&conditions" element={<Navbar page={<TermsCondition />} />} />
                      <Route path="/rules-for-uploading" element={<Navbar page={<RulesForUploading />} />} />

                      <Route path="/admin/dashboard" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/users" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/user-profile/:id" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/discount" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/location" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/customer-search" element={<AdminSecured><GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AdminDashboard /></GoogleReCaptchaProvider></AdminSecured>} />
                      <Route path="/admin/customer-request" element={<AdminSecured><GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AdminDashboard /></GoogleReCaptchaProvider></AdminSecured>} />
                      <Route path="/admin/giveaway" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/dsar-request" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/add-customer-search" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/edit-customer-search" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/enterprise-search" element={<AdminSecured><GoogleReCaptchaProvider reCaptchaKey={SITE_KEY}><AdminDashboard /></GoogleReCaptchaProvider></AdminSecured>} />
                      <Route path="/admin/add-enterprise-search" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/edit-enterprise-search" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/newlisting" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/edit-listing" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/off-plan-listing" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                      <Route path="/admin/edit-off-plan" element={<AdminSecured><AdminDashboard /></AdminSecured>} />
                    </Routes>
                  </AnimatePresence>
                </SnackbarProvider>
            </BrowserRouter>
          </RateContext.Provider>
        </ThemeProvider>
      </I18nextProvider>
    </ProvideAuth>
  );
}

const mapStateToprops = state => {
  return state
}

export default connect(mapStateToprops, {})(App)

function Secured({ children }) {
  let auth = isLoggedIn();
  let location = useLocation();
  if (!auth) {
    return <Navigate to="/" state={location.pathname} replace />;
  }
  return children;
}

function AdminSecured({ children }) {
  let auth = isLoggedIn();
  let userType = getUserType()
  let location = useLocation();
  if (!auth) {
    return <Navigate to="/" state={location.pathname} replace />;
  }

  if (auth && !["admin", "support"].includes(userType)) {
    return <Navigate to="/" state={location.pathname} replace />;
  }
  return children;
}
