import { useTranslation } from "react-i18next";

export default function PasswordStrengthSuggestions({ score }) {
    const { t } = useTranslation();
    return (
        <ul className="text-[13px]">
            {score > 0 && score < 5 ?
                <>
                    <li className="list-disc ml-4">{t('passwordsuggestion.charlength')}</li>
                    <li className="list-disc ml-4">{t('passwordsuggestion.case')}</li>
                    <li className="list-disc ml-4">{t('passwordsuggestion.specialchar')}</li>
                </> :
                ""
            }
        </ul>
    )
}