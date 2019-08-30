// action types
const QUANZI_INIT_PAGE = 'QUANZI_INIT_PAGE'
const QUANZI_INIT_ALLPAGE = 'QUANZI_INIT_ALLPAGE'
const QUANZI_INIT_SCROLLTOP = 'QUANZI_INIT_SCROLLTOP'
const QUANZI_INIT_DATA = 'QUANZI_INIT_DATA'
const QUANZI_DATA_CLEAR = 'QUANZI_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case QUANZI_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case QUANZI_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case QUANZI_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case QUANZI_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case QUANZI_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: QUANZI_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: QUANZI_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: QUANZI_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: QUANZI_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: QUANZI_DATA_CLEAR }
}


