import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setExcelData, updateCantidadPedida, updateData } from '../slice/dataSlice'; 
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Compras = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data?.data || []);

  const [inputValues, setInputValues] = useState({});
  const [dateValues, setDateValues] = useState({});
  const [inputStatus, setInputStatus] = useState({});
  const [bimestre, setBimestre] = useState({ startMonth: '', endMonth: '' });

  const months = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' },
  ];

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleBimestreChange = (field, value) => {
    setBimestre((prev) => ({ ...prev, [field]: value }));
  };

  const getWeekInBimester = (date) => {
    const startMonth = parseInt(bimestre.startMonth);
    const endMonth = parseInt(bimestre.endMonth);

    if (isNaN(startMonth) || isNaN(endMonth)) {
      return 'Bimestre no definido';
    }

    const bimestreStart = new Date(date.getFullYear(), startMonth, 1);
    const diffInDays = Math.floor((date - bimestreStart) / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffInDays / 7) + 1;

    const bimestreEnd = new Date(date.getFullYear(), endMonth + 1, 0);
    if (date < bimestreStart || date > bimestreEnd) {
      return 'Fecha fuera del bimestre';
    }

    return week;
  };

  const getBimestreText = () => {
    const startMonth = months.find((month) => month.value === parseInt(bimestre.startMonth))?.label || '';
    const endMonth = months.find((month) => month.value === parseInt(bimestre.endMonth))?.label || '';
    return startMonth && endMonth ? `${startMonth}-${endMonth}` : 'No definido';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://inespro-back-1.onrender.com/api/stock');
        dispatch(setExcelData(response.data));
      } catch (error) {
        console.error('Error al cargar los datos desde la base de datos:', error);
        toast.error('Error al cargar los datos desde la base de datos.');
      }
    };
    fetchData();
  }, [dispatch]);

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

  const handleDateChange = (codigoInsumo, value) => {
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: value }));
  };

  const handleAccept = (codigoInsumo) => {
    const cantidadPedida = inputValues[codigoInsumo];
    const fechaEnvio = dateValues[codigoInsumo] || getCurrentDate();
    const week = getWeekInBimester(new Date(fechaEnvio)); // Calcula la semana
    const bimensualText = getBimestreText(); // Genera el texto del bimensual

    if (cantidadPedida === undefined || isNaN(cantidadPedida)) {
      toast.error(`Por favor, ingrese una cantidad válida para el insumo ${codigoInsumo}.`);
      return;
    }

    dispatch(updateCantidadPedida({ codigoInsumo, cantidadPedida }));
    dispatch(
      updateData({
        codigoInsumo,
        changes: { fechaEnvio, week, bimensual: bimensualText }, // Incluye bimensual
      })
    );

    setInputStatus((prev) => ({ ...prev, [codigoInsumo]: 'accepted' }));
    toast.success(`Cantidad para el insumo ${codigoInsumo}, fecha de envío y bimensual ingresados correctamente.`);
    setInputValues((prev) => ({ ...prev, [codigoInsumo]: '' }));
    setDateValues((prev) => ({ ...prev, [codigoInsumo]: fechaEnvio }));
  };

  return (
    <div className="container mt-5">
      <h2>Compras</h2>

      <div className="mb-4">
        <h5>Seleccionar Bimestre</h5>
        <div className="d-flex">
          <select
            className="form-control me-2"
            onChange={(e) => handleBimestreChange('startMonth', e.target.value)}
          >
            <option value="">Mes de Inicio</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            className="form-control"
            onChange={(e) => handleBimestreChange('endMonth', e.target.value)}
          >
            <option value="">Mes de Fin</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
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
              <th>Pendiente</th>
              <th>Fecha de Envío</th>
              <th>Semana</th>
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
                    onChange={(e) => handleDateChange(row.codigoInsumo, e.target.value)}
                  />
                </td>
                <td>{getWeekInBimester(new Date(dateValues[row.codigoInsumo] || getCurrentDate()))}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={inputValues[row.codigoInsumo] || ''}
                    onChange={(e) => handleInputChange(row.codigoInsumo, e.target.value, row.cantidadMaxima)}
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
                    <span role="img" aria-label="ok">✅</span>
                  )}
                  {inputStatus[row.codigoInsumo] === 'error' && (
                    <span role="img" aria-label="error">❌</span>
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
