// action types
const GOODS_INIT_PAGE = 'GOODS_INIT_PAGE'
const GOODS_INIT_ALLPAGE = 'GOODS_INIT_ALLPAGE'
const GOODS_INIT_SCROLLTOP = 'GOODS_INIT_SCROLLTOP'
const GOODS_INIT_DATA = 'GOODS_INIT_DATA'
const GOODS_DATA_CLEAR = 'GOODS_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case GOODS_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case GOODS_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case GOODS_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case GOODS_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case GOODS_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: GOODS_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: GOODS_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: GOODS_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: GOODS_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: GOODS_DATA_CLEAR }
}


