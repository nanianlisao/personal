// action types
const HIS_INIT_PAGE = 'HIS_INIT_PAGE'
const HIS_INIT_ALLPAGE = 'HIS_INIT_ALLPAGE'
const HIS_INIT_SCROLLTOP = 'HIS_INIT_SCROLLTOP'
const HIS_INIT_TICKET = 'HIS_INIT_TICKET'
const HIS_DATA_CLEAR = 'HIS_DATA_CLEAR'


var initData = { ticket: [], page: 1, scrollTop: 0 }

// reducer
export default function (state = initData, action) {
    switch (action.type) {
        case HIS_INIT_PAGE:
            return Object.assign(state, { page: action.page })
            break;
        case HIS_INIT_ALLPAGE:
            return Object.assign(state, { allPage: action.allPage })
            break;
        case HIS_INIT_SCROLLTOP:
            return Object.assign(state, { scrollTop: action.scrollTop })
            break;
        case HIS_INIT_TICKET:
            return Object.assign(state, { ticket: action.ticket })
            break;
        case HIS_DATA_CLEAR:
            return initData
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initPage = (page) => {
    return { type: HIS_INIT_PAGE, page }
}

export const initAllPage = (allPage) => {
    return { type: HIS_INIT_ALLPAGE, allPage }
}

export const initScrollTop = (scrollTop) => {
    return { type: HIS_INIT_SCROLLTOP, scrollTop }
}

export const initTicket = (ticket) => {
    return { type: HIS_INIT_TICKET, ticket }
}

export const dataClear = () => {
    return { type: HIS_DATA_CLEAR }
}


