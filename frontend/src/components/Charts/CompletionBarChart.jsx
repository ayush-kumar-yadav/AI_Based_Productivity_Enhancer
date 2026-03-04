import{
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function CompletionBarChart({total, completed ,pending }) {
    const data =[
        {name: "Total", value: total},
        {name: "Completed", value: completed},
        {name: "Pending", value: pending},
    ];
    return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-semibold mb-3">Task Overview</h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CompletionBarChart;