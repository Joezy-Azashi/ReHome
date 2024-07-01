import { createTheme } from "@mui/material/styles";


export const theme = createTheme(
    {
        typography: {
            fontFamily: 'Montserrat',
            fontSize: 15,
            
        },
        palette: {
            primary: {
                main: '#5b9c00'
            },
            secondary: {
                main: '#03254C',
            },
            tertiary: {
                main: '#1267B1'
            },
            text:{
                main: '#000'
            },
            paper: {
                main: '#fff'
            }
        },

    }
)