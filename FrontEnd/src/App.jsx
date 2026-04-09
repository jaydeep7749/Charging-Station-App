import { useState, useEffect } from 'react'
import StationCard from 'src/components/StationCard'
import StationForm from 'src/components/StationForm'
import StatsCard from 'src/components/StatsCard'
import { Search, Filter, RefreshCw } from 'lucide-react'

function App() {
  const [stations, setStations] = useState([])
  const [stats, setStats] = useState({ total: 0, operational: 0, maintenance: 0, inactive: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [page, setPage] = useState(1)

  // Auto refresh every 1 second
  useEffect(() => {
    const interval = setInterval(fetchData, 1000)
    fetchData()
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page, limit: 9 })
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)
      
      const [stationsRes, statsRes] = await Promise.all([
        fetch(`http://localhost:8000/stations?${params}`).then(r => r.json()),
        fetch('http://localhost:8000/stats').then(r => r.json())
      ])
      
      setStations(stationsRes)
      setStats(statsRes || stats)
    } catch (error) {
      console.log('Using mock data (backend offline)')
      setStations(mockStations)
      setStats(mockStats)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete station?')) {
      try {
        await fetch(`http://localhost:8000/stations/${id}`, { method: 'DELETE' })
        fetchData()
      } catch (e) {
        alert('Delete failed')
      }
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Charging Stations
          </h1>
          <p className="text-xl text-gray-600">Real-time EV Charging Station Management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Stations" value={stats.total} icon="📍" />
          <StatsCard title="Operational" value={stats.operational} color="green" />
          <StatsCard title="Maintenance" value={stats.maintenance} color="red" />
          <StatsCard title="Inactive" value={stats.inactive} color="gray" />
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg"
          >
            + Add Station
          </button>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : stations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Stations Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            stations.map((station) => (
              <StationCard key={station.id} station={station} onDelete={handleDelete} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && stations.length > 0 && (
          <div className="flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-medium">Page {page}</span>
              <button
                onClick={() => setPage(p => p+1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Station Modal */}
      {showForm && (
        <StationForm onClose={() => setShowForm(false)} onSuccess={fetchData} />
      )}
    </div>
  )
}

// Mock data for when backend is offline
const mockStations = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `EV Station ${i + 1}`,
  address: `Pune Station Road ${i + 1}`,
  pincode: "411001",
  connector_type: i % 3 === 0 ? "CCS" : i % 3 === 1 ? "Type 2" : "CHAdeMO",
  status: ["Operational", "Maintenance", "Inactive"][i % 3]
}))

const mockStats = { total: 24, operational: 16, maintenance: 4, inactive: 4 }

export default App