import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // Aquí almacenamos todos los datos compartidos
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Acción para establecer los datos desde un archivo Excel o desde la base de datos
    setExcelData: (state, action) => {
      state.data = action.payload; // Sobrescribe los datos con los del Excel o la BD
    },

    // Acción para actualizar la cantidad pedida en el estado local de Redux
    updateCantidadPedida: (state, action) => {
      const { codigoInsumo, cantidadPedida } = action.payload;
      const itemIndex = state.data.findIndex(
        (item) => item.codigoInsumo === codigoInsumo
      );
      if (itemIndex !== -1) {
        state.data[itemIndex].cantidadPedida = cantidadPedida;
        state.data[itemIndex].pendiente = cantidadPedida; // Actualiza pendiente con la cantidad pedida
      }
    },

    // Acción para actualizar la cantidad máxima de un insumo específico
    updateCantidadMaxima: (state, action) => {
      const { codigoInsumo, cantidadMaxima } = action.payload;
      const itemIndex = state.data.findIndex(
        (item) => item.codigoInsumo === codigoInsumo
      );
      if (itemIndex !== -1) {
        state.data[itemIndex].cantidadMaxima = cantidadMaxima; // Actualiza Cantidad Máxima
      }
    },

    // Acción para actualizar cualquier otro dato de un insumo específico
    updateData: (state, action) => {
      const { codigoInsumo, changes } = action.payload;
      const itemIndex = state.data.findIndex(
        (item) => item.codigoInsumo === codigoInsumo
      );
      if (itemIndex !== -1) {
        state.data[itemIndex] = { ...state.data[itemIndex], ...changes }; // Mezcla los cambios
      }
    },
  },
});

export const {
  setExcelData,
  updateCantidadMaxima,
  updateCantidadPedida,
  updateData,
} = dataSlice.actions;

export default dataSlice.reducer;
