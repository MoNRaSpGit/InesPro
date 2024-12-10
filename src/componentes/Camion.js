import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateData } from '../slice/dataSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Camion = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []);

  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const [observationValues, setObservationValues] = useState({});

  // Manejo de cambios en los inputs
  const handleInputChange = (codigoInsumo, value) => {
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleDateChange = (codigoInsumo, value) => {
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  const handleObservationChange = (codigoInsumo, value) => {
    setObservationValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  const handleAccept = async (codigoInsumo) => {
    const item = data.find((row) => row.codigoInsumo === codigoInsumo);
    if (!item) return;
  
    const cuantosLlegaron = inputValues[codigoInsumo] || 0;
    const fechaLlegada = dateValues[codigoInsumo] || new Date().toISOString().split('T')[0];
    const observation = observationValues[codigoInsumo] || '';
  
    const { cantidadPedida, cantidadMaxima, pendiente, numeroCompra, fechaEnvio, week, bimensual } = item;
  
    // Validaciones
    if (cuantosLlegaron > cantidadPedida) {
      toast.error(`No se puede aceptar más de la cantidad pedida (${cantidadPedida}).`);
      return;
    }
  
    // Calcular los nuevos valores
    const nuevoPendiente = Math.max(0, pendiente - cuantosLlegaron);
    const nuevaCantidadMaxima = Math.max(0, cantidadMaxima - cuantosLlegaron);
  
    // Datos a enviar al backend
    const updatedData = [{
      codigoInsumo,
      cantidadMaxima: nuevaCantidadMaxima,
      cantidadPedida,
      pendiente: nuevoPendiente,
      numeroCompra,
      fechaEnvio,
      fechaLlegada,
      cuantosLlegaron,
      week,
      bimensual,
      observation,
    }];
  
    // Log para verificar los datos antes de enviar
    console.log('Datos enviados para actualización:', updatedData);
  
    try {
      const response = await axios.put('https://inespro-back-1.onrender.com/api/stock/update', updatedData);
      toast.success('Datos actualizados exitosamente en el backend.');
      console.log('Respuesta del backend:', response.data);
    } catch (error) {
      console.error('Error al actualizar los datos en el backend:', error);
      toast.error('Error al actualizar los datos en el backend.');
    }
  
    // Actualiza el store global
    dispatch(updateData({ codigoInsumo, changes: updatedData[0] }));
  };
  

  const filteredData = data.filter((row) => row.pendiente > 0);

  return (
    <div className="container mt-5">
      <h2>Datos de Compras Recibidos (Camion)</h2>
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
              <th>Número Compra</th>
              <th>Fecha de Envío</th>
              <th>Fecha de Llegada</th>
              <th>Cuantos Llegaron</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.numero}</td>
                <td>{row.codigoInsumo}</td>
                <td>{row.nombreInsumo}</td>
                <td>{row.unidad}</td>
                <td>{row.cantidadMaxima}</td>
                <td>{row.cantidadPedida}</td>
                <td>{row.pendiente}</td>
                <td>{row.numeroCompra || 'No definido'}</td>
                <td>{row.fechaEnvio || 'No definida'}</td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={dateValues[row.codigoInsumo] || row.fechaLlegada || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(row.codigoInsumo, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={inputValues[row.codigoInsumo] || ''}
                    onChange={(e) => handleInputChange(row.codigoInsumo, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Agregar observación"
                    value={observationValues[row.codigoInsumo] || ''}
                    onChange={(e) => handleObservationChange(row.codigoInsumo, e.target.value)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Camion;
