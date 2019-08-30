// action types
const BAOJIA_INIT_PAGE = 'BAOJIA_INIT_PAGE'
const BAOJIA_INIT_ALLPAGE = 'BAOJIA_INIT_ALLPAGE'
const BAOJIA_INIT_SCROLLTOP = 'BAOJIA_INIT_SCROLLTOP'
const BAOJIA_INIT_DATA = 'BAOJIA_INIT_DATA'
const BAOJIA_DATA_CLEAR = 'BAOJIA_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0, }
    }
    switch (action.type) {
        case BAOJIA_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case BAOJIA_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case BAOJIA_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case BAOJIA_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case BAOJIA_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: BAOJIA_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: BAOJIA_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: BAOJIA_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: BAOJIA_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: BAOJIA_DATA_CLEAR }
}


