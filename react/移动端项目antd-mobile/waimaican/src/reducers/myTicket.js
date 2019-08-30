// action types
const INIT_PAGE = 'INIT_PAGE'
const INIT_ALLPAGE = 'INIT_ALLPAGE'
const INIT_SCROLLTOP = 'INIT_SCROLLTOP'
const INIT_TICKET = 'INIT_TICKET'
const DATA_CLEAR = 'DATA_CLEAR'


// reducer
export default function (state, action) {
    if (!state) {
        state = { ticket: [], page: 1, scrollTop: 0 }
    }
    switch (action.type) {
        case INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case INIT_TICKET:
            return Object.assign(state, { ticket: action.ticket })
            break;
        case DATA_CLEAR:
            return { ticket: [], page: 1, scrollTop: 0 }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: INIT_SCROLLTOP, scrollTop }
}

export const initTicket = (ticket) => {
    return { type: INIT_TICKET, ticket }
}

export const dataClear = () => {
    return { type: DATA_CLEAR }
}


