import React from 'react'
import { Button } from '@mui/material';

function AuthSocialButtons({ size, variant, text, startIcon }) {
    return (
        <Button sx={{
            borderRadius: "5px",
            color: variant === "contained" ? "#FFFFFF" : "#000000",
            fontSize: "12px",
            fontWeight: "400",
            display: "flex",
            justifyContent: "space-evenly",
            textTransform: "none",
            padding: "6px 1px",
            border: "1px solid #C3C3C3",
            width: "100%",
            boxShadow: "none",
            backgroundColor: variant === "contained" ? "#1877F2" : "#FFFFFF",
            ':hover': { backgroundColor: variant === "contained" ? "#1877F2" : "#FFFFFF", border: "1px solid #C3C3C3" },
        }}
            variant={variant}
            size={size}
        >
            <img src={startIcon} className="" alt=""/>
            {text}
        </Button>
    )
}

export default AuthSocialButtons