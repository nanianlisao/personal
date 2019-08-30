// action types
const CATEGORY_INIT_TAB = 'CATEGORY_INIT_TAB'
const CATEGORY_INIT_SCROLLTOP = 'CATEGORY_INIT_SCROLLTOP'
const CATEGORY_INIT_DATA = 'CATEGORY_INIT_DATA'
const CATEGORY_DATA_CLEAR = 'CATEGORY_DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { data: [], tab: 0, scrollTop: 0 }
    }
    switch (action.type) {
        case CATEGORY_INIT_TAB:
            return Object.assign(state, { tab: action.tab })
            break;
        case CATEGORY_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case CATEGORY_INIT_DATA:
            return Object.assign(state, { data: action.data })
            break;
        case CATEGORY_DATA_CLEAR:
            return { data: [], tab: 0, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators

export const initTab = (tab) => {
    return { type: CATEGORY_INIT_TAB, tab }
}

export const initScrollTop = (scrollTop) => {
    return { type: CATEGORY_INIT_SCROLLTOP, scrollTop }
}

export const initData = (data) => {
    return { type: CATEGORY_INIT_DATA, data }
}

export const dataClear = () => {
    return { type: CATEGORY_DATA_CLEAR }
}


