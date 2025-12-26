import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RendezVousChart = ({ statistiques }) => {
  const total = statistiques.nombreTotalRendezVous || 0;

  const data = {
    labels: ["Confirmés", "Annulés", "Terminés", "Refusés", "En Attente"],
    datasets: [
      {
        data: total > 0
          ? [
              statistiques.nombreRendezVousConfirmes,
              statistiques.nombreRendezVousAnnules,
              statistiques.nombreRendezVousTermines,
              statistiques.nombreRendezVousRefuses,
              statistiques.nombreRendezVousEnAttente
            ]
          : [0, 0, 0],
        backgroundColor: ["#4CAF50", "#b0b0b0ff", "#2196F3", "#ff0000ff", "#ffb434ff"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
};

export default RendezVousChart;
