// action types
const RECEIVED_INIT_PAGE = 'RECEIVED_INIT_PAGE'
const RECEIVED_INIT_ALLPAGE = 'RECEIVED_INIT_ALLPAGE'
const RECEIVED_INIT_SCROLLTOP = 'RECEIVED_INIT_SCROLLTOP'
const RECEIVED_INIT_DATA = 'RECEIVED_INIT_DATA'
const RECEIVED_DATA_CLEAR = 'RECEIVED_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case RECEIVED_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case RECEIVED_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case RECEIVED_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case RECEIVED_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case RECEIVED_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: RECEIVED_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: RECEIVED_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: RECEIVED_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: RECEIVED_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: RECEIVED_DATA_CLEAR }
}


