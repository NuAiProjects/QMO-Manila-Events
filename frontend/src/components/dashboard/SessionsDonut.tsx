import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Keynotes", value: 8, color: "hsl(252, 84%, 27%)" },
  { name: "Workshops", value: 24, color: "hsl(45, 100%, 51%)" },
  { name: "Panels", value: 12, color: "hsl(142, 76%, 36%)" },
  { name: "Networking", value: 6, color: "hsl(199, 89%, 48%)" },
];

export function SessionsDonut() {
  return (
    <div className="card-elevated p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sessions by Type</h3>
        <p className="text-sm text-muted-foreground">Distribution of event sessions</p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "var(--shadow-lg)",
              }}
              formatter={(value: number) => [`${value} sessions`, ""]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-4">
        <p className="text-3xl font-bold text-foreground">50</p>
        <p className="text-sm text-muted-foreground">Total Sessions</p>
      </div>
    </div>
  );
}
