import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const UserBarChart = ({ statistiques }) => {
  const total = statistiques.nombreTotalUtilisateurs || 0;

  const data = {
    labels: ["Médecin", "Patient"],
    datasets: [
      {
        label: "Nombre d'utilisateurs",
        data:
          total > 0
            ? [
                statistiques.nombreTotalMedecins,
                statistiques.nombreTotalPatients,
              ]
            : [0, 0],
        backgroundColor: ["#2196F3","#4CAF50" ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default UserBarChart;
