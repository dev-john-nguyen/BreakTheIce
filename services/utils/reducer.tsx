

const INITIAL_STATE = {
    demo: false
}

export default (state: any = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case 'ACTIVATE':
        case 'DEACTIVATE':
        default:
            return state
    }
}


export const activate_demo = () => ({
    type: 'ACTIVATE'
})

export const deactivate_demo = () => ({
    type: 'DEACTIVATE'
})