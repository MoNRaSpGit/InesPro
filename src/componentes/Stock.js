import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Stock = () => {
  
  const data = useSelector((state) => state.data?.data || []);

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({ bimensual: '', week: '' });

  const formatDate = (isoString) => {
    if (!isoString) return 'No definida';
    return isoString.split('T')[0];
  };

  useEffect(() => {
    setFilteredData(data.filter((item) => item.cantidadPedida > 0));
  }, [data]);

 

  const applyFilters = async () => {
    const bimensualPart = filters.bimensual.split(' - ')[0]; // Extrae el primer mes para el filtrado
  
    console.log('Aplicando filtros:', { bimensual: bimensualPart, week: filters.week });
  
    try {
      const response = await axios.get('https://inespro-back-1.onrender.com/api/stock/modifications/filter', {
        params: { bimensual: bimensualPart, week: filters.week },
      });
  
      console.log('Datos filtrados recibidos:', response.data); // Log para verificar los datos recibidos
  
      if (response.data.length > 0) {
        setFilteredData(response.data); // Actualiza los datos filtrados
      } else {
        toast.info('No se encontraron datos para los filtros seleccionados.');
        setFilteredData([]); // Limpia los datos si no hay resultados
      }
    } catch (error) {
      console.error('Error al filtrar los datos:', error); // Log del error
      toast.error('Error al filtrar los datos. Por favor, intente nuevamente.');
    }
  };
  

  const handleSaveAsUnique = async (row) => {
    const dataToSave = {
      codigoInsumo: row.codigoInsumo,
      nombreInsumo: row.nombreInsumo,
      unidad: row.unidad,
      cantidadMaxima: row.cantidadMaxima || 0,
      cantidadPedida: row.cantidadPedida || 0,
      pendiente: row.pendiente || 0,
      numeroCompra: row.numeroCompra || null,
      fechaEnvio: row.fechaEnvio || null,
      fechaLlegada: row.fechaLlegada || null,
      cuantosLlegaron: row.cuantosLlegaron || 0,
      week: row.week || 'No definida',
      bimensual: row.bimensual || 'No definido',
      observation: row.observation || '',
    };
  
    console.log('Guardando como único:', dataToSave);
  
    try {
      const response = await axios.post('https://inespro-back-1.onrender.com/api/stock/add-modification', dataToSave);
      if (response.status === 201) {
        toast.success(`Producto ${row.codigoInsumo} guardado como único exitosamente.`);
      }
    } catch (error) {
      console.error('Error al guardar el producto como único:', error);
      toast.error('Error al guardar el producto como único. Por favor, intente nuevamente.');
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Stock General</h2>
     
      </div>

      {/* Filtros */}
      <div className="d-flex align-items-center mb-3">
        <select
          className="form-control me-2"
          value={filters.bimensual}
          onChange={(e) => setFilters({ ...filters, bimensual: e.target.value })}
        >
          <option value="">Seleccione Bimensualidad</option>
          <option value="Enero - Febrero">Enero - Febrero</option>
          <option value="Marzo - Abril">Marzo - Abril</option>
          <option value="Mayo - Junio">Mayo - Junio</option>
          <option value="Julio - Agosto">Julio - Agosto</option>
          <option value="Septiembre - Octubre">Septiembre - Octubre</option>
          <option value="Noviembre - Diciembre">Noviembre - Diciembre</option>
        </select>

        <select
          className="form-control me-2"
          value={filters.week}
          onChange={(e) => setFilters({ ...filters, week: e.target.value })}
        >
          <option value="">Seleccione Semana</option>
          {Array.from({ length: 8 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{`Semana ${i + 1}`}</option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={applyFilters}>
          Aplicar Filtros
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
              <th>Semana</th>
              <th>Bimensual</th>
              <th>Observación</th>
              <th>Acciones</th>
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
                  <td>{formatDate(row.fechaEnvio)}</td>
                  <td>{formatDate(row.fechaLlegada)}</td>
                  <td>{row.week || 'No definida'}</td>
                  <td>{row.bimensual || 'No definido'}</td>
                  <td>{row.observation || 'No definida'}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSaveAsUnique(row)}
                    >
                      Guardar como Único
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" className="text-center">
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
