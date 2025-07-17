/* eslint-disable @typescript-eslint/no-explicit-any */

// Action types
export const actions = {
    // Pagination actions
    SET_PAGE: 'SET_PAGE',
    SET_LIMIT: 'SET_LIMIT',
    SET_SEARCH: 'SET_SEARCH',

    // Modal actions
    SET_OPEN_MODAL: 'SET_OPEN_MODAL',
    SET_CLOSE_MODAL: 'SET_CLOSE_MODAL',

    // Loading actions
    SET_LOADING: 'SET_LOADING',

    // Global reset
    RESET: 'RESET',
};

// Initial state
export const initialState = {
    // Pagination state
    page: 1,
    limit: 20,
    search: '',

    // Modal state
    openModal: false,
    modalType: '',
    modalData: null,

    // Loading state
    loading: false,
};

// Reducer
export const globalReducer = (
  state: any,
  action: {
    type: any;
    payload?: { type?: any; data?: any };
  }
) => {
  switch (action.type) {
    case actions.SET_OPEN_MODAL:
      return {
        ...state,
        openModal: true,
        modalType: action.payload?.type || '',
        modalData: action.payload?.data || null,
      };
    case actions.SET_CLOSE_MODAL:
      return {
        ...state,
        openModal: false,
        modalType: '',
        modalData: null,
      };
    // ... lainnya
    default:
      return state;
  }
};


// Helper functions (optional)
export const actionCreators = {
    setPage: (page: any) => ({ type: actions.SET_PAGE, payload: page }),
    setLimit: (take: any) => ({ type: actions.SET_LIMIT, payload: take }),
    setSearch: (search: any) => ({ type: actions.SET_SEARCH, payload: search }),

    openModal: (type: any, data: any) => ({ type: actions.SET_OPEN_MODAL, payload: { type, data } }),
    closeModal: () => ({ type: actions.SET_CLOSE_MODAL }),

    setLoading: (loading: any) => ({ type: actions.SET_LOADING, payload: loading }),

    reset: () => ({ type: actions.RESET }),
};
