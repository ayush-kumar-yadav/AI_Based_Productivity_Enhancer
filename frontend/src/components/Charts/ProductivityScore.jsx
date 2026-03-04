import {
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
}from "recharts";

function ProductivityScore({ score }) {
    const data = [
        {
            name: "Score",
            value: score,
        }
    ];
    
  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-center">
      <h2 className="font-semibold mb-3">AI Productivity Score</h2>

      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar dataKey="value" />
        </RadialBarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-xl font-bold">{score}%</p>
    </div>
  );
}

export default ProductivityScore;   