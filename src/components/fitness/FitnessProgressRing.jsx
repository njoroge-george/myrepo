import { Doughnut } from 'react-chartjs-2';

export default function FitnessProgressRing({ value, goal }) {
    const data = {
        labels: ['Completed', 'Remaining'],
        datasets: [{
            data: [value, Math.max(0, goal - value)],
            backgroundColor: ['#4caf50', '#e0e0e0'],
            borderWidth: 0,
        }]
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
        }
    };

    return <Doughnut data={data} options={options} />;
}
