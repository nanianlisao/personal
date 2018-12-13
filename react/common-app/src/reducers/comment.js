// action types
const INIT_COMMENTS = 'INIT_COMMENTS'
const ADD_COMMENT = 'ADD_COMMENT'
const DELETE_COMMENT = 'DELETE_COMMENT'

// reducer
export default function (state, action) {
    console.log(state, action)
    if (!state) {
        state = { commentList: [] }
    }
    switch (action.type) {
        case INIT_COMMENTS:
            return { commentList: action.commentList }
            break;
        case ADD_COMMENT:
            return {
                commentList: [...state.commentList, action.commentList]
            }
            break;
        case DELETE_COMMENT:
            return {
                commentList: [
                    ...state.commentList.slice(0, action.commentIndex),
                    ...state.commentList.slice(action.commentIndex + 1)
                ]
            }
            break;
        default:
            return state;
            break;
    }
}

// action creators
export const initComments = (commentList) => {
    return { type: INIT_COMMENTS, commentList }
}

export const addComment = (commentList) => {
    return { type: ADD_COMMENT, commentList }
}

export const deleteComment = (commentIndex) => {
    return { type: DELETE_COMMENT, commentIndex }
}