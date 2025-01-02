import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const StockDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch company data from the provided API
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/get-csv-data?page=1&limit=15')
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Function to format number
  const formatNumber = (num) => {
    if (isNaN(num)) return 'N/A';
    return parseFloat(num).toLocaleString('en-IN', {
      maximumFractionDigits: 2
    });
  };

  // Prepare chart data
  const prepareChartData = (company) => {
    if (!company) return [];
    return [
      {
        name: company.index_date,
        Open: parseFloat(company.open_index_value),
        High: parseFloat(company.high_index_value),
        Low: parseFloat(company.low_index_value),
        Close: parseFloat(company.closing_index_value),
        Volume: parseFloat(company.volume),
        Change: parseFloat(company.change_percent)
      }
    ];
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
      {/* Sidebar with Company List */}
      <div style={{
        width: '250px', 
        backgroundColor: '#ffffff', 
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        overflowY: 'auto'
      }}>
        <h2 style={{ textAlign: 'center', color: '#4A5568' }}>Companies</h2>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '32px', width: '32px', borderBottom: '4px solid #3b82f6' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>
            {error}
          </div>
        ) : (
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {companies.map((company) => (
              <li
                key={company.index_name}
                onClick={() => setSelectedCompany(company)}
                style={{
                  padding: '10px', 
                  marginBottom: '15px', 
                  cursor: 'pointer', 
                  backgroundColor: '#edf2f7', 
                  borderRadius: '8px', 
                  transition: 'background-color 0.3s ease', 
                  textAlign: 'center'
                }}
              >
                {company.index_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main content - Chart View */}
      <div style={{ flex: '1', padding: '20px', backgroundColor: '#ffffff' }}>
        {selectedCompany ? (
          <div>
            <h2 style={{ textAlign: 'center', color: '#4A5568' }}>{selectedCompany.index_name} - {selectedCompany.index_date}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
              <div style={{ backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ textAlign: 'center', color: '#6B7280' }}>Open Value</h3>
                <p style={{ textAlign: 'center', fontSize: '20px', color: '#374151' }}>
                  {formatNumber(selectedCompany.open_index_value)}
                </p>
              </div>
              <div style={{ backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h3 style={{ textAlign: 'center', color: '#6B7280' }}>Change (%)</h3>
                <p style={{
                  textAlign: 'center', 
                  fontSize: '20px', 
                  color: parseFloat(selectedCompany.change_percent) >= 0 ? '#16A34A' : '#DC2626'
                }}>
                  {selectedCompany.change_percent}%
                </p>
              </div>
            </div>

            <div style={{ marginTop: '40px', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData(selectedCompany)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Open" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="High" stroke="#16A34A" strokeWidth={3} />
                  <Line type="monotone" dataKey="Low" stroke="#DC2626" strokeWidth={3} />
                  <Line type="monotone" dataKey="Close" stroke="#F59E0B" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#6B7280', fontSize: '18px', marginTop: '50px' }}>
            <p>Select a company to view the chart and details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
