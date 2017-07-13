const initialState = {
    image: 'http://www.jennybeaumont.com/wp-content/uploads/2015/03/placeholder.gif',
    finds: [],
    init: false
};

const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_IMAGE':
            return Object.assign({}, state, {
                image: action.image
            });
        case 'SET_FINDS':
            return Object.assign({}, state, {
                finds: action.finds
            });
        case 'START_EVALUATING':
            return state;
        case 'INITIALIZED':
            return Object.assign({}, state, {
                init: true
            });
        default:
            return state;
    }
};

export default rootReducer;