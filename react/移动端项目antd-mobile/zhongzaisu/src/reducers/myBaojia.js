// action types
const MYBAOJIA_INIT_PAGE = 'MYBAOJIA_INIT_PAGE'
const MYBAOJIA_INIT_ALLPAGE = 'MYBAOJIA_INIT_ALLPAGE'
const MYBAOJIA_INIT_SCROLLTOP = 'MYBAOJIA_INIT_SCROLLTOP'
const MYBAOJIA_INIT_DATA = 'MYBAOJIA_INIT_DATA'
const MYBAOJIA_DATA_CLEAR = 'MYBAOJIA_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case MYBAOJIA_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case MYBAOJIA_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case MYBAOJIA_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case MYBAOJIA_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case MYBAOJIA_DATA_CLEAR:
            return { data: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: MYBAOJIA_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: MYBAOJIA_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: MYBAOJIA_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: MYBAOJIA_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: MYBAOJIA_DATA_CLEAR }
}


