import React from 'react'
import { CircularProgress} from '@mui/material'

function PageLoader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <CircularProgress
                size={50}
                sx={{
                    color: "primary"
                }}
            />
        </div>
    )
}

export default PageLoader