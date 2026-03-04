import{
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
}from "recharts";

function PriorityPieChart({high, medium, low}) {
    const data = [
        {name: "High", value: high},
        {name: "Medium", value: medium},
        {name: "Low", value: low},
    ];
    
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-semibold mb-3">Priority Distribution</h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriorityPieChart;