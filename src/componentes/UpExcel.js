import React from 'react';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpExcel = () => {
  const navigate = useNavigate();

  // Función para manejar la carga de archivo Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('Por favor, selecciona un archivo.', {
        position: 'top-right',
        icon: '⚠️',
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const extractedData = jsonData
          .slice(4)
          .filter((row) => row[0] !== 'N°')
          .map((row) => ({
            numero: row[0] || '',
            codigoInsumo: row[2] || '',
            nombreInsumo: row[3] || '',
            unidad: row[4] || '',
            mes01: row[5] || 0,
            mes02: row[6] || 0,
            cantidadMaxima: (row[5] || 0) + (row[6] || 0), // Calcular cantidad máxima
            cantidadPedida: 0,
            pendiente: 0,
            numeroCompra: null,
            fechaEnvio: null,
            fechaLlegada: null,
            cuantosLlegaron: 0,
          }))
          .filter((row) => row.mes01 || row.mes02);

        // Hacer la petición POST al servidor para guardar los datos en la base de datos
        await axios.post('http://localhost:5000/api/stock', extractedData);

        toast.success('Archivo procesado y datos guardados en la base de datos exitosamente.', {
          position: 'top-right',
          icon: '📊',
        });

        // Redirigir al usuario al componente Compras
        navigate('/compras');
      } catch (error) {
        console.error('Error al procesar o guardar el archivo:', error);
        toast.error('Error al procesar o guardar los datos en la base de datos.', {
          position: 'top-right',
          icon: '⚠️',
        });
      }
    };

    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
      toast.error('Error al leer el archivo.', {
        position: 'top-right',
        icon: '⚠️',
      });
    };

    reader.readAsBinaryString(file);
  };

  // Función para borrar todos los datos de la base de datos
  const handleDeleteAllData = async () => {
    const confirmDelete = window.confirm(
      '¿Está seguro que desea borrar todos los datos de la base de datos? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) {
      toast.info('Operación cancelada por el usuario.', {
        position: 'top-right',
        icon: '❌',
      });
      return;
    }

    try {
      // Hacer la petición DELETE al servidor para eliminar todos los datos
      await axios.delete('http://localhost:5000/api/stock/deleteAll');

      toast.success('Todos los datos de stock fueron eliminados exitosamente.', {
        position: 'top-right',
        icon: '🗑️',
      });
    } catch (error) {
      console.error('Error al eliminar los datos de la base de datos:', error);
      toast.error('Error al eliminar los datos de la base de datos.', {
        position: 'top-right',
        icon: '⚠️',
      });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="card p-4 shadow">
        <div className="text-center mb-4">
          <h2>Sube tu Excel</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="form-control-file mb-3"
            onChange={handleFileUpload}
          />
          <button
            className="btn btn-danger"
            onClick={handleDeleteAllData}
          >
            Borrar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpExcel;
