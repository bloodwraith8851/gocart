import { createSlice } from '@reduxjs/toolkit'

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
            state.loading = false
            state.error = null
        },
        clearProduct: (state) => {
            state.list = []
        },
        setProductLoading: (state, action) => {
            state.loading = action.payload
        },
        setProductError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    }
})

export const { setProduct, clearProduct, setProductLoading, setProductError } = productSlice.actions

export default productSlice.reducer