import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateData } from '../slice/dataSlice'; // Importa la acción correcta
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Estilos para React Toastify
import 'bootstrap/dist/css/bootstrap.min.css';

const Ximena = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []); // Leer datos desde Redux

  const [inputValues, setInputValues] = useState({}); // Estado local para manejar los valores del input de "Número de Compra"
  const [inputStatus, setInputStatus] = useState({});

  // Filtrar filas donde Cantidad Pedida sea mayor a 0 y no se haya guardado el número de compra
  const filteredData = data.filter((row) => row.cantidadPedida > 0 && !row.numeroCompra);

  const handleInputChange = (codigoInsumo, value) => {
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  const handleSave = (codigoInsumo) => {
    const numeroCompra = inputValues[codigoInsumo];
    if (!numeroCompra || numeroCompra.trim() === '') {
      toast.error(`Por favor, ingrese un número de compra válido para el insumo ${codigoInsumo}.`);
      return;
    }

    // Actualiza el estado global con el valor almacenado localmente al presionar "Guardar"
    dispatch(
      updateData({
        codigoInsumo,
        changes: { numeroCompra },
      })
    );

    // Marca como correcto solo cuando el usuario presiona "Guardar"
    setInputStatus((prev) => ({ ...prev, [codigoInsumo]: 'accepted' }));
    toast.success(`Número de compra para el insumo ${codigoInsumo} guardado.`);

    // Log para indicar que el número de compra ha sido guardado
    console.log(`Store global actualizado correctamente: Número de Compra guardado para ${codigoInsumo} = ${numeroCompra}`);
  };

  return (
    <div className="container mt-5">
      <h2>Gestión de Número de Compra (Ximena)</h2>
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
              <th>Número Compra</th>
              <th>Acciones</th>
              <th>Estado</th>
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
                <td>{row.fechaEnvio || 'No definida'}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={inputValues[row.codigoInsumo] || ''}
                    onChange={(e) => handleInputChange(row.codigoInsumo, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSave(row.codigoInsumo)}
                  >
                    Guardar
                  </button>
                </td>
                <td>
                  {inputStatus[row.codigoInsumo] === 'accepted' && (
                    <span role="img" aria-label="ok">
                      ✅
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

export default Ximena;
