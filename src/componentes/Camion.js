import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateData } from '../slice/dataSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Camion = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []); // Lee datos desde Redux Store

  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});

  // Función para manejar los cambios en el input de "Cuantos Llegaron"
  const handleInputChange = (codigoInsumo, value) => {
    const cuantosLlegaron = Math.max(0, parseInt(value) || 0); // Asegura valores positivos
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: cuantosLlegaron }));
  };

  // Función para manejar los cambios en el input de "Fecha de Llegada"
  const handleDateChange = (codigoInsumo, value) => {
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  // Función para manejar la acción del botón "Aceptar"
  const handleAccept = (codigoInsumo) => {
    const item = data.find((row) => row.codigoInsumo === codigoInsumo);
    if (!item) return;

    const cuantosLlegaron = inputValues[codigoInsumo] || 0;
    const fechaLlegada = dateValues[codigoInsumo] || new Date().toISOString().split('T')[0];

    const { cantidadPedida, cantidadMaxima, pendiente } = item;

    // Validaciones
    if (cuantosLlegaron > cantidadPedida) {
      toast.error(`No se puede aceptar más de la cantidad pedida (${cantidadPedida}).`);
      return;
    }

    // Calcular los nuevos valores
    const nuevoPendiente = Math.max(0, pendiente - cuantosLlegaron);
    const nuevaCantidadMaxima = Math.max(0, cantidadMaxima - cuantosLlegaron);

    // Actualiza el estado global (Redux)
    const updatedData = {
      codigoInsumo,
      changes: {
        cuantosLlegaron,
        pendiente: nuevoPendiente,
        cantidadMaxima: nuevaCantidadMaxima,
        fechaLlegada,
      },
    };

    dispatch(updateData(updatedData));

    // Mostrar el console.log de actualización del store global
    console.log('Store global actualizado correctamente:', updatedData);

    toast.success('Datos guardados exitosamente.');

    // Reiniciar el valor del input después de aceptar
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: '' }));
  };

  // Filtrar filas donde el valor de "pendiente" sea mayor a 0
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
                <td
                  style={{
                   
                    width: '130px',
                  }}
                >
                  {row.fechaEnvio || 'No definida'}
                </td>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={dateValues[row.codigoInsumo] || row.fechaLlegada || new Date().toISOString().split('T')[0]}
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
                      handleInputChange(row.codigoInsumo, e.target.value)
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
