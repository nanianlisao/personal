// action types
const BAOJIATAB = 'BAOJIATAB'
const MYRELEASETAB = 'MYRELEASETAB'


// reducer
export default function (state, action) {
    if (!state) {
        state = { baojiaTab: 0, myReleaseTab: 0, }
    }
    switch (action.type) {
        case BAOJIATAB:
            return Object.assign(state, { baojiaTab: action.baojiaTab })
            break;
        case MYRELEASETAB:
            return Object.assign(state, { myReleaseTab: action.myReleaseTab })
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const baojiaTab = (baojiaTab) => {
    return { type: BAOJIATAB, baojiaTab }
}

export const myReleaseTab = (myReleaseTab) => {
    return { type: MYRELEASETAB, myReleaseTab }
}



