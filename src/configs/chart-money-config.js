import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,

  data: {
    labels: [], // types
    datasets: []
  },

  options: [],

  legend: {
    display: false
  },

  title: {
    display: true,
    text: `MONEY`,
    position: `left`,
    color: `rgb(0, 0, 0)`,
    fontSize: `30`,
    fullWidth: true,
    padding: 20
  },
};
