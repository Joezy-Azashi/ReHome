import React from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FR from '../../assets/images/fr.png';
import EN from '../../assets/images/gb.png';

function LanguageSelection({ language, setLanguage }) {
  const { t } = useTranslation();  

  return (
    <Select
      id="languageSelect"
      size="small"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      renderValue={() => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={language === 'en' ? EN : FR}
              className="h-[13px] ml-1"
              alt={language}
            />
            <p className="text-[13px] my-1 ">
              {language === 'en' ? t('languages.en') : t('languages.fr')}
            </p>
          </Box>
        );
      }}
      className="w-[110px]"
      sx={{
        '& .MuiSelect-select': {
          display: 'flex',
          padding: '0',
          backgroundColor: "#fff"
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '0',
          margin: "0"
        },
      }}
    >
      <MenuItem value="en">
        <img src={EN} width={19} className="mr-1" alt="English" />
        <p className="text-[13px]">{t('languages.en')}</p>
      </MenuItem>
      <MenuItem value="fr">
        <img src={FR} width={19} className="mr-1" alt="French" />
        <p className="text-[13px]">{t('languages.fr')}</p>
      </MenuItem>
    </Select>
  );
}

export default LanguageSelection;
