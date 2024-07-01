import { combineReducers } from "redux";
import { formatPhoneNumber } from "../services/utils";

export const filterState = {
    location: [],
    property: [],
    bed: 'Any',
    bath: 'Any',
    budget: [0, 10000000],
    currency: '¢',
    sort: [],
    order: 'Asc',
    squareFt: [0, 1000000]
}

export const filterReducer = (state, action) => {
    switch (action.type) {
        case 'LOC':
            return {...state, location: [...action.payload]}
        case 'PROPERTY':
            return {...state, property: [...action.payload]}
        case 'BUDGET':
            return {...state, budget: action.payload}    
        case 'BED':
            return {...state, bed: action.payload}
        case 'BATH':
            return {...state, bath: action.payload}
        case 'ORD':
            return {...state, order: action.payload}
        case 'SORT':
            return {...state, sort: [...action.payload]}
        case 'SQFEET':
            return {...state, squareFt: [...action.payload] }
        case 'RESET':
            return filterState
        default:
            return state;
    }
}

export const onboardReducer = (state, action) => {
    switch (action.type) {
        case "FIRSTNAME":
            return {...state, firstname: action.payload}
        case "LASTNAME":
            return {...state, lastname: action.payload}
        case "PHONE":
            return {...state, phone: formatPhoneNumber(action.payload)}
        case "EMAIL":
            return {...state, email: action.payload.toLowerCase().trim()}
        case "PROFILE":
            return {...state, profile: action.payload}
        case "GHCARD":
            return {...state, ghCard: action.payload}
        case "BUSINESS_NAME":
            return {...state, business_name: action.payload}
        case "BUSINESS_ADDRESS":
            return {...state, business_address: action.payload}
        case "BUSINESS_PHONE":
            return {...state, business_phone: formatPhoneNumber(action.payload)}
        case "BUSINESS_EMAIL":
            return {...state, business_email: action.payload.toLowerCase().trim()}
        case "BUSINESS_LOCATION":
            return {...state, business_location: action.payload}
        case "BUSINESS_AREAS":
            return {...state, business_serviceAreas: action.payload}
        default:
            return state;
    }
}

// onboarding Reducer
const onboardCheckerReducer = ( state = false, action ) => {
    switch (action.type) {
        case 'COMPLETE':
            return false
        case 'INCOMPLETE':
            return true
        default:
            return state;
    }
}

// Single property Reducer
const currencyReducer = (currency = 'GH¢', action) => {
    switch (action.type) {
        case 'CEDI':
            return 'GH¢'
        case 'DOLLAR':
            return '$'
        default:
            return currency;
    }
}




export default combineReducers({
    onboarding: onboardCheckerReducer,
    currency: currencyReducer
})