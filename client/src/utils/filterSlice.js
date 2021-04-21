import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        readers: {
            ind: [],
            sel: []
        },
        antennas: [],
        status: []
    },
    reducers: {
        updateReaderSel: (state, action) => {
            state.readers.sel = action.payload
        },
        updateReaderInd: (state, action) => {
            state.readers.ind = action.payload
        },
        updateAntenna: (state, action) => {
            state.antennas = action.payload
        },
        updateStatus: (state, action) => {
            state.status = action.payload
        },
        updateAll: (state, action) => {
            state.readers = action.payload.readers
            state.antennas = action.payload.antennas
            state.status = action.payload.status
        }
    }
})

export const {
    updateReaderSel,
    updateReaderInd,
    updateAntenna,
    updateStatus,
    updateAll
} = filterSlice.actions

export const selectFilters = state => state.filter

export default filterSlice.reducer