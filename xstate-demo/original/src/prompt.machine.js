import { actions, sendParent, Machine } from "xstate"
const { assign } = actions

const promptMachineConfig = {
    key: 'prompt',
    initial: 'displayed',
    context: {
        message: ''
    },
    states: {
        displayed: {
            on: {
                DISMISS_PROMPT: {
                    target: 'hidden',
                    actions: 'clearMessage'
                },
                DELETE_SELECTION: {
                    actions: sendParent('DISMISS_PROMPT')
                }
            }
        },
        hidden: {
            type: 'final'
        },
    }
}

const promptMachineOptions = {
    actions: {
        clearMessage: assign((ctx) => ({
            message: ''
        })),
    }
};

export default Machine(promptMachineConfig, promptMachineOptions);
