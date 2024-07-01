import React from 'react'
import { Select, MenuItem, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

function CurrencySelection({ currency, setCurrency }) {
    const { t } = useTranslation();

    return (
        <Select
            id="languageSelect"
            size="small"
            value={currency}
            onChange={(e)=> setCurrency(e.target.value)}
            renderValue={(currency) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <p className="text-white text-[13px] my-1 px-1" style={{ backgroundColor: currency === "GHS" ? '#1267B1' : '#5b9c00' }}>
                            {currency}
                        </p>
                    </Box>
                );
            }}
            className="w-[70px]"
            sx={{
                '& .MuiSelect-select': {
                    display: 'flex',
                    padding: '0',
                    backgroundColor: "#fff"
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: '0',
                },
            }}
        >
            <MenuItem value="GHS">
                <p className="text-[13px]">{t('currency.ghs')}</p>
            </MenuItem>
            <MenuItem value="USD">
                <p className="text-[13px]">{t('currency.usd')}</p>
            </MenuItem>
        </Select>
    )
}

export default CurrencySelection