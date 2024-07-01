import React from 'react'
import { Button } from '@mui/material';

function PillButton({ size, variant, text, width, borderColor, backgroundColor, color, hoverColor, startIcon }) {

    return (
        <Button sx={{
            borderRadius: "25px",
            border: variant === "contained" ? "" : "1px solid black",
            borderColor: borderColor,
            color: color,
            fontWeight: "600",
            fontSize: "11px",
            padding: "10px 16px",
            whiteSpace: "nowrap",
            width: width ,
            textTransform: "none",
            boxShadow: "none",
            backgroundColor: backgroundColor || "#FFFFFF",
            ':hover': { backgroundColor: variant === "contained" ? "#03254C" : variant === "outlined" ? "#EBEBEB" : "", color: `${hoverColor} !important`, border: variant === "contained" ? "" : "1px solid black", borderColor: "rgba(0, 0, 0, 0.3)"}
        }}
            variant={variant}
            size={size}
            startIcon={startIcon && <img width={15} src={startIcon} alt="" />}
        >
            {text}
        </Button>
    )
}

export default PillButton