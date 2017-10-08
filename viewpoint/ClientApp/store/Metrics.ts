import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface MetricsState {
    isLoading: boolean;
    startDateIndex?: number;
    metrics: Metrics;
    error: any;
    lastFetched: Date;
    tableCss: string;
}

export interface Metrics {
    failedState: boolean;
    latencyOffset: number;
    latency: number;
    memoryLeak: number;
    instanceName: string;
    version: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestMetricsAction {
    type: 'REQUEST_METRICS';
}

interface ReceiveMetricsAction {
    type: 'RECEIVE_METRICS';
    metrics: Metrics;
}

interface ErrorMetricsAction {
    type: 'ERROR_METRICS';
    error: any;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestMetricsAction | ReceiveMetricsAction | ErrorMetricsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    modifyFaultState: (isFaulted:boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let data = { ...getState().metrics.metrics, failedState: isFaulted };
        let json = JSON.stringify(data);
        let fetchTask = fetch('api/Metrics', {
            method: "POST",
            body: json,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        dispatch({ type: 'RECEIVE_METRICS', metrics: data });
    },
    modifyLatency: (latency:number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let newOffset = getState().metrics.metrics.latencyOffset += latency;
        if (newOffset < 0)
        {
            newOffset = 0;
        }

        let data = { ...getState().metrics.metrics, latencyOffset: newOffset };
        let json = JSON.stringify(data);
        let fetchTask = fetch('api/Metrics', {
            method: "POST",
            body: json,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        
        dispatch({ type: 'RECEIVE_METRICS', metrics: data });
    },
    modifyMemLeak: (memory:number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let newMemory = getState().metrics.metrics.memoryLeak += memory;
        if (newMemory < 0)
        {
            newMemory = 0;
        }

        let data = { ...getState().metrics.metrics, memoryLeak: newMemory };
        let json = JSON.stringify(data);
        let fetchTask = fetch('api/Metrics', {
            method: "POST",
            body: json,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        
        dispatch({ type: 'RECEIVE_METRICS', metrics: data });
    },
    requestMetrics: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        //if (startDateIndex !== getState().metrics.startDateIndex) {
            let start = new Date();
            let fetchTask = fetch(`api/Metrics`)
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json() as Promise<Metrics>
                })
                .then(data => {
                    let end = new Date();
                    data.latency = (end.getTime() - start.getTime());
                    dispatch({ type: 'RECEIVE_METRICS', metrics: data });
                })
                .catch(error => {
                    dispatch({ type: 'ERROR_METRICS', error: error });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_METRICS' });
        //}
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: MetricsState = {
    metrics: {
        failedState: false,
        latencyOffset: 0,
        latency: 0,
        memoryLeak: 0,
        instanceName: "",
        version: ""
    }, 
    isLoading: false,
    error: null,
    lastFetched: new Date(),
    tableCss: ""
};

export const reducer: Reducer<MetricsState> = (state: MetricsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_METRICS':
            return {
                metrics: state.metrics,
                isLoading: true,
                error: state.error,
                lastFetched: state.lastFetched,
                tableCss: state.tableCss,
            };
        case 'RECEIVE_METRICS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            //if (action.startDateIndex === state.startDateIndex) {
                return {
                    metrics: action.metrics,
                    isLoading: false,
                    error: null,
                    lastFetched: new Date(),
                    tableCss: state.tableCss == "pulse-success2" ? "pulse-success1" : "pulse-success2"
                };
        case 'ERROR_METRICS':
            return {
                metrics: state.metrics,
                isLoading: false,
                error: action.error,
                lastFetched: new Date(),
                tableCss: state.tableCss == "pulse-error2" ? "pulse-error1" : "pulse-error2"
            }
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
