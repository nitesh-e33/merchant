'use client';
import { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Charts = ({ txnStatusData, paymentData, serviceTypeData, hourlyData }) => {
  useEffect(() => {
    if (txnStatusData.length === 0) return;

    const processDataAndCreateChart = (data, labels, values, chartCanvas, chartType) => {
      let otherTotal = 0;
      data.forEach(item => {
        if (item[chartType]) {
          labels.push(item[chartType]);
          values.push(item.total);
        } else {
          otherTotal += item.total;
        }
      });
      if (otherTotal > 0) {
        labels.push('Other');
        values.push(otherTotal);
      }

      const ctx = document.getElementById(chartCanvas).getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(0, 128, 0, 0.7)',
              'rgba(255, 0, 255, 0.7)',
              'rgba(128, 128, 128, 0.7)',
              'rgba(0, 0, 255, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(0, 128, 0, 1)',
              'rgba(255, 0, 255, 1)',
              'rgba(128, 128, 128, 1)',
              'rgba(0, 0, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            position: 'right',
          },
        }
      });
    };

    processDataAndCreateChart(paymentData, [], [], 'paymentChart', 'payment_method');
    processDataAndCreateChart(serviceTypeData, [], [], 'serviceTypeChart', 'service_type');

    const successData = hourlyData.success.map(obj => ({ x: obj.hourly, y: obj.total }));
    const failedData = hourlyData.failed.map(obj => ({ x: obj.hourly, y: obj.total }));
    const otherData = hourlyData.other.map(obj => ({ x: obj.hourly, y: obj.total }));

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    new Chart(ctxLine, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Success',
          borderColor: 'green',
          data: successData,
          fill: false,
        }, {
          label: 'Failed',
          borderColor: 'red',
          data: failedData,
          fill: false,
        }, {
          label: 'Other',
          borderColor: 'blue',
          data: otherData,
          fill: false,
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            ticks: {
              stepSize: 1,
              callback: (value) => `${value}:00`
            }
          }
        }
      }
    });
  }, [txnStatusData, paymentData, serviceTypeData, hourlyData]);

  return (
    <>
      { txnStatusData.length !== 0 ? (
        <>
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header">
                    <h3 className="card-title">Line Data</h3>
                    </div>
                    <div className="card-body line-data">
                    <canvas id="lineChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
        <div className="cards">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Payment Mode</h3>
                </div>
                <div className="card-body card-max-ht-350">
                    <canvas id="paymentChart"></canvas>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Service Type</h3>
                </div>
                <div className="card-body card-max-ht-350">
                    <canvas id="serviceTypeChart"></canvas>
                </div>
            </div>
        </div>
        </>
      ) : (
        <div className="no-data-found">
          <div className="no-data-card">
            <i className="fa fa-database"></i>
            <h1>No Data Found</h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Charts;
