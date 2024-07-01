import { getCurrentUser } from "../services/auth"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"


const useOnboardChecker = (action) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = getCurrentUser()

    useEffect(() => {
        if(currentUser?.profile?.onboardingComplete){
            return navigate(action)
        }
        else{
            return dispatch({type: 'INCOMPLETE'})  
        }

    },[action, currentUser, navigate, dispatch])

  
}

export default useOnboardChecker