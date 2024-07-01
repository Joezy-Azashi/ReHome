import { IconButton, FormControlLabel, Menu, MenuItem } from '@mui/material'
import { grey } from '@mui/material/colors';
import { MoreVert } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react'

import { getUserType } from '../../services/auth';

const MatEdit = ({index, setShowPopup, setRecipientData}) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate()
    const handleEditClick = () => {
        navigate('/admin/edit-customer-search', { state: { data: index } })
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return <FormControlLabel
        control={
            <>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVert style={{ color: grey[700] }} />
                </IconButton>

                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '15ch'
                        },
                    }}
                    >
                        { getUserType() !== 'admin' ? [] : 
                        <MenuItem onClick={() => { handleEditClick(); handleClose() }}>
                            {t('admindashboard.salesdb.edit')}
                        </MenuItem>
                    }
                    
                    <MenuItem onClick={() => {setRecipientData(index); setShowPopup(true); handleClose() }}>
                        {t('admindashboard.salesdb.email')}
                    </MenuItem>
                </Menu>

            </>
            
        }
        sx={{margin: "auto"}}
    />
};

export const columns = (setShowPopup, setRecipientData) =>  [
    {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        width: 80,
        disableClickEventBubbling: true,
        renderCell: (params) => {
            return (
                <div style={{ cursor: "pointer" }}>
                    <MatEdit index={params.row} setShowPopup={setShowPopup} setRecipientData={setRecipientData} />
                </div>
            );
        }
    },
    { field: 'first_name', headerName: "First Name", width: 170 },
    { field: 'last_name', headerName: "Last Name", width: 170 },
    { field: 'preferred_communication_channel', headerName: 'Preferred Communication Channel', width: 170 },
    { field: 'preferred_communication_time', headerName: 'Preferred Communication Time', width: 170 },
    { field: 'housing_preference', headerName: 'Housing Preferences', width: 170 },
    { field: 'specific_requirements', headerName: 'Specific needs/Requirements', width: 170 },
    { field: 'lead_source', headerName: 'Lead Source', width: 170 },
    { field: 'rating', headerName: 'Rating', width: 170 },
    { field: 'title', headerName: "Title", width: 170 },
    { field: 'phone_number', headerName: "Phone Number", width: 170 },
    { field: 'email', headerName: "Email", width: 170 },
    { field: 'address', headerName: "Address", width: 170 },
    { field: 'age', headerName: 'Age', width: 170 },
    { field: 'gender', headerName: 'Gender', width: 170 },
    { field: 'DOB', headerName: 'Date of Birth', width: 170 },
    { field: 'marital_status', headerName: 'Marital Status', width: 170 },
    { field: 'nationality', headerName: 'Nationality', width: 170 },
    { field: 'company_name', headerName: 'Company Name', width: 170 },
    { field: 'industry', headerName: 'Industry', width: 170 },
    { field: 'professional_history', headerName: 'Professional History', width: 170 },
    { field: 'linkedIn', headerName: 'LinkedIn Profile', width: 170 },
    { field: 'twitter', headerName: 'Twitter Handle', width: 170 },
    { field: 'facebook', headerName: 'Facebook profile', width: 170 },
    { field: 'instagram', headerName: 'Instagram Handle', width: 170 },
    { field: 'website', headerName: 'Personal Website', width: 170 },
    { field: 'portfolio', headerName: 'Blog/Portfolio URL', width: 170 },
    { field: 'education_level', headerName: 'Education Background', width: 170 },
    { field: 'certificates', headerName: 'Certificates', width: 170 },
    { field: 'hobbies', headerName: 'Interest and Hobbies', width: 170 },
    { field: 'purchase_history', headerName: 'Purchase History', width: 170 },
    { field: 'company_size', headerName: 'Company Size', width: 170 },
    { field: 'company_location', headerName: 'Company Location', width: 170 },
    { field: 'company_department', headerName: 'Company Department', width: 170 },
    { field: 'events', headerName: 'Events/Conferences Attended', width: 170 },

];