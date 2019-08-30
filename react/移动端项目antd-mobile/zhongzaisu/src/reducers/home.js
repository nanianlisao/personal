// action types
const HOME_INIT_SCROLLTOP = 'HOME_INIT_SCROLLTOP'
const HOME_INIT_DATA = 'HOME_INIT_DATA'
const HOME_DATA_CLEAR = 'HOME_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], scrollTop: 0 }
    }
    switch (action.type) {
        case HOME_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case HOME_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case HOME_DATA_CLEAR:
            return { data: [], scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}


export const initScrollTop = (scrollTop) => {
    return { type: HOME_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: HOME_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: HOME_DATA_CLEAR }
}


