import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setExcelData } from '../slice/dataSlice'; // Actualiza el store global

const Stock = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []);

  // Filtrar filas donde la cantidad pedida sea mayor a 0
  const filteredData = data.filter((item) => item.cantidadPedida > 0);

  // Función para formatear fechas que llegan en formato completo "YYYY-MM-DDTHH:mm:ss.sssZ" a "YYYY-MM-DD"
  const formatDate = (isoString) => {
    if (!isoString) return 'No definida';
    return isoString.split('T')[0]; // Tomamos solo la parte de la fecha
  };

  const handleSaveAllData = async () => {
    // Validar los datos antes de enviar
    const validatedData = filteredData.map((item) => ({
      ...item,
      cantidadMaxima: item.cantidadMaxima || 0, // Asegurarse de que la cantidad máxima no sea null o NaN
    }));

    try {
      // Enviar los datos actualizados al backend
      const response = await axios.put('https://inespro-back-1.onrender.com/api/stock/update', validatedData);
      if (response.status === 200) {
        toast.success('Datos actualizados exitosamente.');

        // Mostrar log con los datos actualizados en la base de datos
        console.log('Datos actualizados en la base de datos:', validatedData);

        // Sincronizar con la base de datos y actualizar el store global
        const fetchUpdatedData = await axios.get('https://inespro-back-1.onrender.com/api/stock');
        dispatch(setExcelData(fetchUpdatedData.data));

        // Mostrar log con los datos actualizados en el store global
        console.log('Store global actualizado correctamente con los datos:', fetchUpdatedData.data);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      toast.error('Error al actualizar los datos. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Stock General</h2>
        <button className="btn btn-success" onClick={handleSaveAllData}>
          Actualizar Todos los Datos
        </button>
      </div>
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
              <th>Cuantos Llegaron</th>
              <th>Pendiente</th>
              <th>Número Compra</th>
              <th>Fecha de Envío</th>
              <th>Fecha de Llegada</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.numero}</td>
                  <td>{row.codigoInsumo}</td>
                  <td>{row.nombreInsumo}</td>
                  <td>{row.unidad}</td>
                  <td>{row.cantidadMaxima}</td>
                  <td>{row.cantidadPedida}</td>
                  <td>{row.cuantosLlegaron}</td>
                  <td>{row.pendiente}</td>
                  <td>{row.numeroCompra || 'No definido'}</td>
                  <td
                    style={{
                      width: '130px', // Ancho de 130 pixeles
                    }}
                  >
                    {formatDate(row.fechaEnvio)}
                  </td>
                  <td>{formatDate(row.fechaLlegada)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No hay datos modificados para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Stock;
