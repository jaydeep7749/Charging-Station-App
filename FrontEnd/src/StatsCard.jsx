const StatsCard = ({ title, value, icon, color = 'gray' }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group ${color === 'green' ? 'hover:border-green-200' : color === 'red' ? 'hover:border-red-200' : ''}`}>
    <div className="flex items-center justify-between mb-2">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color === 'green' ? 'from-green-400 to-green-500' : color === 'red' ? 'from-red-400 to-red-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <div className={`w-2 h-2 rounded-full animate-pulse ${color === 'green' ? 'bg-green-400' : color === 'red' ? 'bg-red-400' : 'bg-gray-400'}`}></div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600 font-medium">{title}</p>
  </div>
)

export default StatsCard