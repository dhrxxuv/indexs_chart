import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const StockDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      fetch(`http://localhost:3000/get-csv-data?page=${page}&limit=15`)
        .then((res) => res.json())
        .then((data) => {
          setCompanies(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    };

    fetchData();
  }, [page]);

  const formatNumber = (num) => {
    if (isNaN(num)) return 'N/A';
    return parseFloat(num).toLocaleString('en-IN', { 
      maximumFractionDigits: 2 
    });
  };

  const prepareChartData = (company) => {
    if (!company) return [];
    return [{
      name: company.index_date,
      Open: parseFloat(company.open_index_value),
      High: parseFloat(company.high_index_value),
      Low: parseFloat(company.low_index_value),
      Close: parseFloat(company.closing_index_value),
      Volume: parseFloat(company.volume),
      Change: parseFloat(company.change_percent)
    }];
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      <div style={{ display: 'flex' }}>
        <div style={{
          width: '25%', minHeight: '100vh', backgroundColor: '#FFFFFF', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '16px', overflowY: 'auto'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '24px' }}>Companies</h1>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '128px' }}>
              <div style={{
                animation: 'spin 1s linear infinite', borderRadius: '50%', height: '32px', width: '32px', 
                borderBottom: '4px solid #3B82F6'
              }} />
            </div>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              {companies.map((company, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCompany(company)}
                  style={{
                    padding: '16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', 
                    backgroundColor: selectedCompany === company ? '#E0F2FE' : '#F9FAFB', 
                    borderLeft: selectedCompany === company ? '4px solid #3B82F6' : '4px solid transparent', 
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '16px'
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#374151' }}>
                    {company.index_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                    Date: {company.index_date}
                  </div>
                  <div style={{
                    fontSize: '12px', marginTop: '8px', color: parseFloat(company.change_percent) >= 0 ? '#16A34A' : '#DC2626'
                  }}>
                    {company.change_percent}% Change
                  </div>
                </div>
              ))}
              
              <div style={{ position: 'sticky', bottom: '0', backgroundColor: '#FFFFFF', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      flex: '1', padding: '8px 16px', backgroundColor: '#3B82F6', color: '#FFFFFF', borderRadius: '8px',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? '0.6' : '1', 
                      transition: 'background-color 0.3s', fontSize: '14px'
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    style={{
                      flex: '1', padding: '8px 16px', backgroundColor: '#3B82F6', color: '#FFFFFF', borderRadius: '8px', 
                      cursor: 'pointer', transition: 'background-color 0.3s', fontSize: '14px'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          flex: '1', padding: '24px', overflowY: 'auto'
        }}>
          {selectedCompany ? (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151' }}>
                      {selectedCompany.index_name}
                    </h2>
                    <p style={{ color: '#6B7280' }}>
                      {selectedCompany.index_date}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '28px', fontWeight: '600', color: parseFloat(selectedCompany.change_percent) >= 0 ? '#16A34A' : '#DC2626'
                  }}>
                    {selectedCompany.change_percent}%
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                  {['Open', 'High', 'Low', 'Close'].map((item, idx) => (
                    <div key={idx} style={{
                      padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>{item}</div>
                      <div style={{
                        fontSize: '20px', fontWeight: '600', color: '#111827'
                      }}>
                        {formatNumber(selectedCompany[`${item.toLowerCase()}_index_value`])}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareChartData(selectedCompany)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Open" stroke="#2563eb" strokeWidth={2} />
                      <Line type="monotone" dataKey="High" stroke="#16a34a" strokeWidth={2} />
                      <Line type="monotone" dataKey="Low" stroke="#dc2626" strokeWidth={2} />
                      <Line type="monotone" dataKey="Close" stroke="#7c3aed" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>


              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {['Volume', 'Turnover (₹ Cr)', 'Points Change'].map((item, idx) => (
                  <div key={idx} style={{
                    backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', padding: '24px'
                  }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{item}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>{item}</span>
                      <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                        {formatNumber(selectedCompany[item.toLowerCase().replace(/ /g, '_')])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#6B7280', fontSize: '18px'
            }}>
              Select a company from the left to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;
