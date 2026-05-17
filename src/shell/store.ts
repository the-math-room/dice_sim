import { Simulation } from '../core/types.js';

export type AppState =
  | { readonly status: 'IDLE' }
  | { readonly status: 'LOADING' } // Added!
  | { readonly status: 'ERROR'; readonly error: string }
  | { readonly status: 'SUCCESS'; readonly simulation: Simulation };

type Subscriber = (state: AppState) => void;

/**
 * Creates an isolated state container.
 * This pattern protects our global state from being mutated randomly.
 */
function createStore(initialState: AppState = { status: 'IDLE' }) {
  let currentState = initialState;
  const subscribers = new Set<Subscriber>();

  return {
    // Read-only access to current state
    getState: (): AppState => currentState,
    
    // The only way to modify state, which automatically triggers a UI alert
    setState: (nextState: AppState): void => {
      currentState = nextState;
      for (const callback of subscribers) {
        callback(currentState);
      }
    },

    // Allows DOM components to bind themselves to state changes
    subscribe: (callback: Subscriber) => {
      subscribers.add(callback);
      
      // Send the current state immediately upon subscription
      callback(currentState);

      // Return a cleanup function to prevent memory leaks
      return () => {
        subscribers.delete(callback);
      };
    }
  };
}

// Export a single, unified store instance for our application to share
export const store = createStore();