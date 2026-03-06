import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function PriorityPieChart({ high, medium, low }) {

  const data = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low }
  ];

  const COLORS = ["#EF4444", "#F59E0B", "#10B981"];

  return (
    <div>
      <h3 className="font-semibold mb-3 text-gray-700">
        Priority Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >

            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}

          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default PriorityPieChart;