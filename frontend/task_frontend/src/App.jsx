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
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
   
        <div className="w-1/4 min-h-screen bg-white shadow-md p-4 overflow-y-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">Index</h1>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div>
              {companies.map((company, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedCompany(company)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedCompany === company 
                      ? 'bg-blue-100 border-l-4 border-blue-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  } shadow mb-4`}
                >
                  <div className="text-lg font-medium text-gray-800">{company.index_name}</div>
                  <div className="text-sm text-gray-600 mt-2">Date: {company.index_date}</div>
                  <div className={`text-sm mt-2 font-semibold ${
                    parseFloat(company.change_percent) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.change_percent}% Change
                  </div>
                </div>
              ))}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm transition ${
                      page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {selectedCompany ? (
            <div>
   
              <div className="bg-grey rounded-xl shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{selectedCompany.index_name}</h2>
                    <p className="text-gray-600">{selectedCompany.index_date}</p>
                  </div>
                  <div className={`text-2xl font-semibold ${
                    parseFloat(selectedCompany.change_percent) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedCompany.change_percent}%
                  </div>
                </div>

      
                <div className="grid grid-cols-2 gap-6 mb-6">
                {['Open', 'High', 'Low', 'Close'].map((item, idx) => {
                const key =
                 item === 'Close' ? 'closing_index_value' : `${item.toLowerCase()}_index_value`;
                   return (
                 <div key={idx} className="p-4 bg-gray-50 rounded-lg shadow-md">
                <div className="text-sm text-gray-600">{item}</div>
                <div className="text-xl font-semibold text-gray-800">
                {formatNumber(selectedCompany[key])}
                </div>
                </div>
                );  
                })}

                </div>

                <div className="h-96">
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
              {[
              { label: 'Volume ', key: 'volume' },
              { label: 'Turnover (₹ Cr)', key: 'turnover_rs_cr' },
              { label: 'Points Change', key: 'points_change' }
              ].map((item, idx) => (
              <div key={idx} style={{
              backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', padding: '24px'
              }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{item.label}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>{item.label}</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
              {formatNumber(selectedCompany[item.key])}
              </span>
              </div>
              </div>
              ))}
            </div>


            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500 text-lg">
              Select a company from the left to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDashboard;