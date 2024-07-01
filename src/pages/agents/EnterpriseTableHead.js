import { IconButton, FormControlLabel, Menu, MenuItem } from '@mui/material'
import { grey } from '@mui/material/colors';
import { MoreVert } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserType } from '../../services/auth';
import React, { useState } from 'react'

const MatEdit = ({index, setShowPopup, setRecipientData}) => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleEditClick = () => {
        navigate('/admin/edit-enterprise-search', { state: { data: index } })
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
                    <MatEdit index={params.row} setShowPopup={setShowPopup} setRecipientData={setRecipientData}/>
                </div>
            );
        }
    },
    { field: 'name', headerName: "Name", width: 170 },
    { field: 'address', headerName: "Address", width: 170 },
    { field: 'city', headerName: 'City', width: 170 },
    { field: 'state', headerName: 'State', width: 170 },
    { field: 'country', headerName: 'Country', width: 170 },
    { field: 'postal_code', headerName: 'Postal Code', width: 170 },
    { field: 'industry', headerName: 'Industry', width: 170 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'phone_number', headerName: "Phone Number", width: 170 },
    { field: 'fax_number', headerName: "Fax Number", width: 170 },
    { field: 'description', headerName: "Description", width: 170 },
    { field: 'year_established', headerName: 'Year Established', width: 170 },
    { field: 'annual_revenue', headerName: 'Annual Revenue', width: 170 },
    { field: 'employees_count', headerName: 'Number of Employees', width: 170 },
    { field: 'linkedIn', headerName: 'LinkedIn Profile', width: 170 },
    { field: 'twitter', headerName: 'Twitter Handle', width: 170 },
    { field: 'facebook', headerName: 'Facebook profile', width: 170 },
    { field: 'instagram', headerName: 'Instagram Handle', width: 170 },
    { field: 'website', headerName: 'Website', width: 170 },
    { field: 'contact_accuracy', headerName: 'Accuracy', width: 170 },
    { field: 'contacts', headerName: 'Contacts', width: 170 },

];