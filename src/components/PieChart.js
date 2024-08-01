import { PureComponent } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
export class Example extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: null,
    };
  }

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  };

  onPieLeave = () => {
    this.setState({ activeIndex: null });
  };

  render() {
    const { dataIn, colors } = this.props;

    // const { activeIndex } = this.state;

    const defaultValue = [
      { name: "pending", value: 0 },
      { name: "ongoing", value: 0 },
      { name: "review", value: 0 },
      { name: "done", value: 0 },
      { name: "archive", value: 0 },
    ];
    // xử lý data
    //kiểm tra dataIn mới xử lý tránh trường hợp bị null
    if (dataIn) {
      Object.values(dataIn).forEach((item) => {
        const status = item.status;
        const statusEntry = defaultValue.find((entry) => entry.name === status);
        if (statusEntry) {
          statusEntry.value += 1;
        }
      });
    }

    const data = [...defaultValue];

    return (
      <PieChart width={300} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={this.onPieEnter}
          onMouseLeave={this.onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {/* <Pie
          data={data}
          cx={420}
          cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          onMouseEnter={this.onPieEnter}
          onMouseLeave={this.onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie> */}
        <Tooltip
          content={({ payload }) => {
            if (!payload || payload.length === 0) return null;
            const { value, name } = payload[0].payload;
            return (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  {name}: {value}
                </p>
              </div>
            );
          }}
          formatter={(value, name) => [value, name]}
          labelStyle={{ color: "black" }}
        />
      </PieChart>
    );
  }
}
