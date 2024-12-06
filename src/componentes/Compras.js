import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setExcelData, updateCantidadPedida, updateData } from '../slice/dataSlice'; // Importar la acción para actualizar datos en el estado global
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Compras = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []); // Leer datos desde Redux

  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const [inputStatus, setInputStatus] = useState({});

  // Obtener la fecha actual en el formato YYYY-MM-DD para Montevideo, Uruguay (zona horaria ya tenida en cuenta)
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock');
        console.log("soy los datos de la api", response.data);
        
        dispatch(setExcelData(response.data));
      } catch (error) {
        console.error('Error al cargar los datos desde la base de datos:', error);
        toast.error('Error al cargar los datos desde la base de datos.');
      }
    };
    fetchData();
  }, [dispatch]);

  // Manejar cambios en el input de cantidad pedida
  const handleInputChange = (codigoInsumo, value, cantidadMaxima) => {
    const cantidadPedida = parseInt(value) || 0;
    if (cantidadPedida > cantidadMaxima) {
      toast.error(`La cantidad ingresada no puede ser mayor a la cantidad máxima (${cantidadMaxima}).`);
      setInputStatus((prev) => ({ ...prev, [codigoInsumo]: 'error' }));
    } else {
      setInputValues((prev) => ({ ...prev, [codigoInsumo]: value }));
      setInputStatus((prev) => ({ ...prev, [codigoInsumo]: 'pending' }));
    }
  };

  // Manejar cambios en el input de fecha de envío
  const handleDateChange = (codigoInsumo, value) => {
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  // Función para manejar la acción del botón "Aceptar"
  const handleAccept = (codigoInsumo) => {
    const cantidadPedida = inputValues[codigoInsumo];
    const fechaEnvio = dateValues[codigoInsumo] || getCurrentDate();

    if (cantidadPedida === undefined || isNaN(cantidadPedida)) {
      toast.error(`Por favor, ingrese una cantidad válida para el insumo ${codigoInsumo}.`);
      return;
    }

    // Actualizar el estado global con la cantidad pedida y la fecha de envío
    dispatch(updateCantidadPedida({ codigoInsumo, cantidadPedida }));
    dispatch(updateData({ codigoInsumo, changes: { fechaEnvio } }));

    // Log para indicar que el estado se ha actualizado correctamente
    console.log(`Store global actualizado correctamente para ${codigoInsumo}: Cantidad Pedida = ${cantidadPedida}, Fecha de Envío = ${fechaEnvio}`);

    // Actualizar el estado del input a "aceptado" y resetear los valores ingresados
    setInputStatus((prev) => ({ ...prev, [codigoInsumo]: 'accepted' }));
    toast.success(`Cantidad para el insumo ${codigoInsumo} y fecha de envío ingresadas correctamente.`);
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: '' }));
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: fechaEnvio }));
  };

  return (
    <div className="container mt-5">
      <h2>Compras</h2>
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>N°</th>
              <th>Código del Insumo</th>
              <th>Nombre del Insumo</th>
              <th>Unidad</th>
              <th>Cantidad Máxima</th>
              <th>Cantidad Pedida</th>
              <th>Pendiente</th>
              <th>Fecha de Envío</th>
              <th>Ingresar Cantidad</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.numero}</td>
                <td>{row.codigoInsumo}</td>
                <td>{row.nombreInsumo}</td>
                <td>{row.unidad}</td>
                <td>{row.cantidadMaxima}</td>
                <td>{row.cantidadPedida}</td>
                <td>{row.pendiente}</td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={dateValues[row.codigoInsumo] || row.fechaEnvio || getCurrentDate()}
                    onChange={(e) =>
                      handleDateChange(row.codigoInsumo, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={inputValues[row.codigoInsumo] || ''}
                    onChange={(e) =>
                      handleInputChange(row.codigoInsumo, e.target.value, row.cantidadMaxima)
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAccept(row.codigoInsumo)}
                  >
                    Aceptar
                  </button>
                </td>
                <td>
                  {inputStatus[row.codigoInsumo] === 'accepted' && (
                    <span role="img" aria-label="ok">
                      ✅
                    </span>
                  )}
                  {inputStatus[row.codigoInsumo] === 'error' && (
                    <span role="img" aria-label="error">
                      ❌
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Compras;
