import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ProductivityTrendChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Weekly Productivity</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="completed" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductivityTrendChart;