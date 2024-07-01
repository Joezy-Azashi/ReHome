import { alpha, Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import NotificationItem from '../../components/NotificationItem'
import Notify from '../../assets/images/notification.png'
import Api from '../../api/api'
import PageLoader from '../../components/PageLoader'

const Notifications = () => {
    const { t } = useTranslation();
    const [notification, setNotification] = useState([])
    const [userData, setUserData] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        Api().get("/me")
            .then((response) => {
                setUserData(response.data)
                getNotification(response.data?.id)
            })
            .catch(() => { })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getNotification = (id) => {
        setLoading(true)
        Api().get(`users/${id}/notifications`, {
            params: {
                filter: {
                    where: { closed: false },
                    order: ["createdAt DESC"]
                }
            }
        })
            .then((res) => {
                setNotification(res?.data)
                setLoading(false)
            })
            .catch(()=>{
                setLoading(false)
            })
    }

    const closeSingleNotification = (data) => {
        Api().patch(`notifications/${data?.id}`, { closed: true })
            .then((res) => {
                getNotification(userData?.id)
            })
    }

    return (
        <div>
            <Box sx={{ position: 'relative', padding: '2.5rem 2rem', background: alpha('#1267B1', .05), alignItems: 'center', width: '100%', borderBottom: '1px solid lighgrey' }}>
                <Typography variant='h6'>{t('dashboard.notifications.notifications')}</Typography>
                <Typography variant='body2'>{t('dashboard.notifications.manage')}</Typography>
            </Box>
            <Box >
                <Box sx={{ padding: '2rem', overflowY: 'scroll', height: '37rem' }}>
                    {
                         loading ? <PageLoader /> :
                        notification.length > 0 ? notification.map((el, index) => {
                            return (
                                <NotificationItem el={el} closeSingleNotification={closeSingleNotification} key={index} width={'100%'} />
                            )
                        })
                            :
                            <Box sx={{ textAlign: 'center', pt: '6rem' }}>
                                <img src={Notify} width='20%' style={{ display: 'block', margin: '0 auto' }} alt='no-notifications' />
                                <Typography variant='h6' mt={2}>{t('dashboard.notifications.nonotification')}</Typography>
                                <Typography>{t('dashboard.notifications.message')}</Typography>
                            </Box>
                    }

                </Box>
            </Box>
        </div>
    )
}

export default Notifications