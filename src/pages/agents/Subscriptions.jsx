import { CheckCircle, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box,Card, CardContent, Grid, List, ListItem, ListItemIcon, ListItemText, styled,  Typography } from '@mui/material'
import React from 'react'
import PackageItem from '../../components/PackageItem'
import { agentLight, agentPlus, developerPlan, realtorPlan } from '../../constant'
import { useTranslation } from "react-i18next";

const WrapCard = styled(Card)(({theme}) => ({
    borderRadius: '10px',
    height: '100%',
    padding: '3rem 0'
}))

const MuiAccordion = styled(Accordion)(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
      },
}))

const MuiAccordionSummary = styled(AccordionSummary)(({theme}) => ({
    background: 'rgba(0, 0, 0, .03)',
}))

const Subscriptions = () => {
    const { t } = useTranslation();

    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

  return (
            <>
                <WrapCard elevation={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={6} order={{ md: 1, sm: 2, xs: 2 }}>
                                <Box sx={{ padding: '1rem 3rem'}}>
                                    <Typography textAlign={'left'} variant='h5' color={'secondary'} sx={{fontWeight: 700}}>{t('agentdashboard.subscription.details.title')}</Typography>
                                    <Typography textAlign={'left'} color='primary' variant='body2'>{t('agentdashboard.subscription.details.note')}</Typography>
                                    <Box mt={'1.5rem'}>
                                        {/* Agent Light */}
                                        <MuiAccordion elevation={0} expanded={expanded === 'panel1'} sx={{margin: '0 !important'}} onChange={handleChange('panel1')}>
                                            <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant='h6' sx={{fontWeight: 600, fontSize: '1.2rem'}}>{t('agentdashboard.subscription.details.packages.agentlight.title')}</Typography>
                                            </MuiAccordionSummary>
                                            <AccordionDetails>
                                                <List disablePadding>
                                                    {
                                                        agentLight.map((el,index) => {
                                                            return (
                                                                <ListItem disablePadding key={index}>
                                                                    <ListItemIcon sx={{minWidth: '30px'}}><CheckCircle color='primary' sx={{fontSize: '1rem'}} /></ListItemIcon>
                                                                    <ListItemText><Typography variant='body2'>{t(el)}</Typography></ListItemText>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                                <Typography variant='body2' mt={2} sx={{fontSize: '.9rem', fontStyle: 'italic'}}>NB:<br/> <span dangerouslySetInnerHTML={{ __html: t('agentdashboard.subscription.details.packages.agentlight.note') }}/></Typography>
                                            </AccordionDetails>
                                        </MuiAccordion>

                                        {/* Agent Plus Plan */}
                                        <MuiAccordion elevation={0} expanded={expanded === 'panel2'} sx={{margin: '0 !important'}} onChange={handleChange('panel2')}>
                                            <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant='h6' sx={{fontWeight: 600, fontSize: '1.2rem'}}>{t('agentdashboard.subscription.details.packages.agentplus.title')}</Typography>
                                            </MuiAccordionSummary>
                                            <AccordionDetails>
                                                <List disablePadding>
                                                    {
                                                        agentPlus.map((el,index) => {
                                                            return (
                                                                <ListItem disablePadding key={index}>
                                                                    <ListItemIcon sx={{minWidth: '30px'}}><CheckCircle color='primary' sx={{fontSize: '1rem'}} /></ListItemIcon>
                                                                    <ListItemText><Typography variant='body2'>{t(el)}</Typography></ListItemText>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                                <Typography variant='body2' mt={2} sx={{fontSize: '.9rem', fontStyle: 'italic'}}>NB:<br/> <span dangerouslySetInnerHTML={{ __html: t('agentdashboard.subscription.details.packages.agentplus.note') }}/></Typography>
                                            </AccordionDetails>
                                        </MuiAccordion>

                                        {/* Realtor Plan */}
                                        <MuiAccordion elevation={0} expanded={expanded === 'panel3'} sx={{margin: '0 !important'}} onChange={handleChange('panel3')}>
                                            <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant='h6' sx={{fontWeight: 600, fontSize: '1.2rem'}}>{t('agentdashboard.subscription.details.packages.realtor.title')}</Typography>
                                            </MuiAccordionSummary>
                                            <AccordionDetails>
                                                <List disablePadding>
                                                    {
                                                        realtorPlan.map((el,index) => {
                                                            return (
                                                                <ListItem disablePadding key={index}>
                                                                    <ListItemIcon sx={{minWidth: '30px'}}><CheckCircle color='primary' sx={{fontSize: '1rem'}} /></ListItemIcon>
                                                                    <ListItemText><Typography variant='body2'>{t(el)}</Typography></ListItemText>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                                <Typography variant='body2' mt={2} sx={{fontSize: '.9rem', fontStyle: 'italic'}}>NB:<br/> <span dangerouslySetInnerHTML={{ __html: t('agentdashboard.subscription.details.packages.realtor.note') }}/></Typography>
                                            </AccordionDetails>
                                        </MuiAccordion>

                                        {/* Developer Plan */}
                                        <MuiAccordion elevation={0} expanded={expanded === 'panel4'} sx={{margin: '0 !important'}} onChange={handleChange('panel4')}>
                                            <MuiAccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography variant='h6' sx={{fontWeight: 600, fontSize: '1.2rem'}}>{t('agentdashboard.subscription.details.packages.developer.title')}</Typography>
                                            </MuiAccordionSummary>
                                            <AccordionDetails>
                                                <List disablePadding>
                                                    {
                                                        developerPlan.map((el,index) => {
                                                            return (
                                                                <ListItem disablePadding key={index}>
                                                                    <ListItemIcon sx={{minWidth: '30px'}}><CheckCircle color='primary' sx={{fontSize: '1rem'}} /></ListItemIcon>
                                                                    <ListItemText><Typography variant='body2'>{t(el)}</Typography></ListItemText>
                                                                </ListItem>
                                                            )
                                                        })
                                                    }
                                                </List>
                                                <Typography variant='body2' mt={2} sx={{fontSize: '.9rem', fontStyle: 'italic'}}>NB:<br/> <span dangerouslySetInnerHTML={{ __html: t('agentdashboard.subscription.details.packages.developer.note') }}/></Typography>
                                            </AccordionDetails>
                                        </MuiAccordion>
                                    </Box>
                                </Box>

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} order={{ md: 2, sm: 1, xs: 1 }}>
                            <CardContent sx={{padding: '0 3rem 2rem 3rem', }}>
                                <Typography textAlign={'center'} mt='1rem' mb='10px' sx={{fontWeight: 300, lineHeight: 1.1}} variant='h6' >
                                   {t('agentdashboard.subscription.details.selection.title1')} <span style={{color: '#03254C', fontWeight: 700}}>{t('agentdashboard.subscription.details.selection.title2')}</span> {t('agentdashboard.subscription.details.selection.title3')}
                                </Typography>
                                <Typography textAlign={'center'} variant='body2' sx={{fontSize: '.8rem', mb: '2rem'}}>{t('agentdashboard.subscription.details.selection.note')}</Typography>
                                
                                {/* PACKAGES */}
                                <PackageItem userType={'all'}/>
                                
                            </CardContent>
                            
                        </Grid>
                    </Grid>
                </WrapCard>
            </>
  )
}

export default Subscriptions