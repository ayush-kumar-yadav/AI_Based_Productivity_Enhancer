import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

function ProductivityScore({ score }) {

  const safeScore = Number(score) || 0;

  const data = [
    {
      name: "Score",
      value: safeScore
    }
  ];

  return (
    <div>

      <h3 className="font-semibold mb-3 text-gray-700">
        AI Productivity Score
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >

          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill="#6366F1"
          />

        </RadialBarChart>
      </ResponsiveContainer>

      <div className="text-center text-2xl font-bold mt-2">
        {safeScore}%
      </div>

    </div>
  );
}

export default ProductivityScore;