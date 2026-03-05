function StatsCards({ stats }) {
    if (!stats) return null;
    return (
     <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">

      <div className="bg-blue-50 p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-600">Total Tasks</h4>
        <p className="text-2xl font-bold">{stats.totalTasks}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-600">Completed</h4>
        <p className="text-2xl font-bold">{stats.completedTasks}</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-600">Completion Rate</h4>
        <p className="text-2xl font-bold">{stats.completionRate}%</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-600">High Priority Rate</h4>
        <p className="text-2xl font-bold">
          {stats.highPriorityCompletionRate}%
        </p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-600">Streak</h4>
        <p className="text-2xl font-bold">{stats.streak} days</p>
      </div>

    </div>
  );
}

export default StatsCards;