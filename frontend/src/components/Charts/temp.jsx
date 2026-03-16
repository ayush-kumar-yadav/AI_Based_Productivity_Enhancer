import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function CompletionBarChart({ total, completed, pending }) {

  const data = [
    { name: "Total", value: total },
    { name: "Completed", value: completed },
    { name: "Pending", value: pending }
  ];

  return (
    <div>
      <h3 className="font-semibold mb-3 text-gray-700">
        Task Overview
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="value" fill="#3B82F6" radius={[6,6,0,0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompletionBarChart;