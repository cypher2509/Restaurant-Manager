import React, { useState } from 'react';
import axios from 'axios';

function ViewReports() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  // State for Sales Report
  const [annualSales, setAnnualSales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);

  // State for Inventory Report
  const [inventoryReport, setInventoryReport] = useState(null);

  // State for Busy Days Report
  const [busyDaysReport, setBusyDaysReport] = useState(null);

  // Fetch Annual Sales Report
  const fetchAnnualSales = async () => {
    const response = await axios.get('http://localhost:3000/reports/sales/annual', { params: { year } });
    setAnnualSales(response.data);
  };

  // Fetch Monthly Sales Report
  const fetchMonthlySales = async () => {
    const response = await axios.get('http://localhost:3000/reports/sales/monthly', { params: { year } });
    setMonthlySales(response.data);
  };

  // Fetch Inventory Report
  const fetchInventoryReport = async () => {
    const response = await axios.get('http://localhost:3000/reports/customer', { params: { year, month } });
    setInventoryReport(response.data);
  };

  // Fetch Busy Days Report
  const fetchBusyDaysReport = async () => {
    const response = await axios.get('http://localhost:3000/reports/busyDays', { params: { year } });
    setBusyDaysReport(response.data);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1>Restaurant Reports Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Sales Report</h2>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={fetchAnnualSales} style={{ marginRight: '10px' }}>
          Get Annual Sales
        </button>
        <button onClick={fetchMonthlySales}>Get Monthly Sales</button>
        <h3>Annual Report</h3>
        <pre>{annualSales && JSON.stringify(annualSales, null, 2)}</pre>
        <h3>Monthly Report</h3>
        <pre>{monthlySales && JSON.stringify(monthlySales, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Inventory Report</h2>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Enter Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={fetchInventoryReport}>Get Inventory Report</button>
        <h3>Report Data</h3>
        <pre>{inventoryReport && JSON.stringify(inventoryReport, null, 2)}</pre>
      </div>

      <div>
        <h2>Busy Days Report</h2>
        <input
          type="number"
          placeholder="Enter Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={fetchBusyDaysReport}>Get Busy Days Report</button>
        <h3>Report Data</h3>
        <pre>{busyDaysReport && JSON.stringify(busyDaysReport, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ViewReports;
