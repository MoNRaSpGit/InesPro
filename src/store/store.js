// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';

import dataReducer from '../slice/dataSlice'; // Importa el reducer del dataSlice

const store = configureStore({
  reducer: {

    data: dataReducer,

  },
});

export default store;