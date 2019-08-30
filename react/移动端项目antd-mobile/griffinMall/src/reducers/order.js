// action types
const ORDER_INIT_PAGE = 'ORDER_INIT_PAGE'
const ORDER_INIT_ALLPAGE = 'ORDER_INIT_ALLPAGE'
const ORDER_INIT_SCROLLTOP = 'ORDER_INIT_SCROLLTOP'
const ORDER_INIT_DATA = 'ORDER_INIT_DATA'
const ORDER_DATA_CLEAR = 'ORDER_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case ORDER_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case ORDER_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case ORDER_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case ORDER_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case ORDER_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: ORDER_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: ORDER_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: ORDER_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: ORDER_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: ORDER_DATA_CLEAR }
}


