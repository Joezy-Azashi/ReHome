import React, {useState} from 'react'
import { useTranslation } from "react-i18next";
import buyerrenter from "../../assets/images/buyerrenter.png"
import individualSeller from "../../assets/images/individualseller.png"
import realtor from "../../assets/images/realtor.png"
import agent from "../../assets/images/agent.png"

function SignupType({setType}) {
    const { t } = useTranslation();

    const [background, setBackground] = useState("")

    const getType = (string) => {
        setType(string)
        setBackground(string)
    }

    return (
        <div style={{gap: '10px'}} className="flex justify-between">
            <div onClick={() => { getType("customer") }} className="cursor-pointer">
                <div className='border border-[#1267B1] rounded-xl' style={{ backgroundColor: background === "customer" ? "#1267B1" : "" }}>
                    <img src={buyerrenter} alt="" width={70} className='md:m-3 m-1' />
                </div>
                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.buyerRenter')}</p>
            </div>
            <div onClick={() => { getType("agent") }} className="cursor-pointer">
                <div className='border border-[#FC0000] rounded-xl' style={{ backgroundColor: background === "agent" ? "#EA0606" : "" }}>
                    <img src={agent} alt="" width={70} className='md:m-3 m-1' />
                </div>
                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.agent')}</p>
            </div>
            <div onClick={() => { getType("developer      ") }} className="cursor-pointer">
                <div className='border border-[#03254C] rounded-xl' style={{ backgroundColor: background === "seller" ? "#03254C" : "" }}>
                    <img src={individualSeller} alt="" width={70} className='md:m-3 m-1' />
                </div>
                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.developer')}</p>
            </div>
            <div onClick={() => { getType("realtor") }} className="cursor-pointer">
                <div className='border border-[#03254C] rounded-xl' style={{ backgroundColor: background === "realtor" ? "#01153D" : "" }}>
                    <img src={realtor} alt="" width={70} className='md:m-3 m-1' />
                </div>
                <p className='mt-2 text-[10px] font-semibold text-center'>{t('signuptype.realtorBroker')}</p>
            </div>
        </div>
    )
}

export default SignupType