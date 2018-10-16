import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js';
import style from '../styles/style.scss';
import axios from 'axios';

export default class Charfer extends React.Component {
  state = {
    data: [
      {
        date: '11/09/2018',
        value: 30
      },
      {
        date: '11/09/2018',
        value: 50
      },
      {
        date: '11/09/2018',
        value: 80
      }]
  }

  fetchData = () => {
    axios.get("https://api.dev.pgsoft.tech/game_api/")
  }

  componentDidUpdate() {

  }

  render() {

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };

    return (
      <div>
        <Line
          data={data}
          width="600"
          height="250"
        />
      </div>
    )
  }
}

