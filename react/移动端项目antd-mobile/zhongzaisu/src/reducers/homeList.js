// action types
const HOMELIST_INIT_PAGE = 'HOMELIST_INIT_PAGE'
const HOMELIST_INIT_ALLPAGE = 'HOMELIST_INIT_ALLPAGE'
const HOMELIST_INIT_SCROLLTOP = 'HOMELIST_INIT_SCROLLTOP'
const HOMELIST_INIT_DATA = 'HOMELIST_INIT_DATA'
const HOMELIST_DATA_CLEAR = 'HOMELIST_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case HOMELIST_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case HOMELIST_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case HOMELIST_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case HOMELIST_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case HOMELIST_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: HOMELIST_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: HOMELIST_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: HOMELIST_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: HOMELIST_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: HOMELIST_DATA_CLEAR }
}


