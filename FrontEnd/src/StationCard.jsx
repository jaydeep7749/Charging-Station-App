import { MapPin, Settings, Zap, Trash2, ExternalLink } from 'lucide-react'

const StationCard = ({ station, onDelete }) => {
  const getStatusClass = (status) => {
    if (status === 'Operational') return 'status-green shadow-green-200 hover:shadow-green-300'
    if (status === 'Maintenance') return 'status-red shadow-red-200 hover:shadow-red-300'
    return 'status-gray shadow-gray-200 hover:shadow-gray-300'
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${getStatusClass(station.status)} border-2`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">{station.name}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${station.status === 'Operational' ? 'bg-green-200 text-green-800' : station.status === 'Maintenance' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
          {station.status}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">{station.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          📮 {station.pincode}
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center bg-blue-50 p-3 rounded-xl mb-4">
        <Zap className="w-5 h-5 text-blue-600 mr-2" />
        <span className="font-semibold text-blue-900">{station.connector_type}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {station.location_link && (
          <a href={station.location_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4" />
            Maps
          </a>
        )}
        <button
          onClick={() => onDelete(station.id)}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
          title="Delete station"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default StationCard