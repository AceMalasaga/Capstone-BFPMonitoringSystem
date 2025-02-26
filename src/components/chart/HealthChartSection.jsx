import React from 'react';
import LineChart  from './LineChart'; // Import the reusable LineChart
import { ResponsiveContainer } from 'recharts';


const HealthChartSection = ({HeartRate,temperatureData}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col text-center h-auto">
      <div className="p-3 w-full bg-bfpNavy rounded-lg mb-4 text-white">
        <h3 className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] 2xl::text-[24px] font-bold">Health Analytics</h3>
      </div>

      {/* Center the grid and ensure the charts are centered */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-x-auto mb-4">
        {/* Heart Rate Chart */}

        <ResponsiveContainer>
          <div className='flex justify-center col-span-1'>
            <LineChart
              data={HeartRate}
              xKey="time"
              yKey="value"
              color="#ff0000" // bfpOrange
              title="Heart Rate"
              yLabel="BPM"
              description="This chart shows heart rate trends over time."
              unit="BPM"
            />
          </div>
        </ResponsiveContainer>
        

        {/* Body Temperature Chart */}
        <ResponsiveContainer>
          <div className='flex justify-center col-span-1'>
            <LineChart
              data={temperatureData}
              xKey="time"
              yKey="value"
              color="#00C49F" // bfpBlue
              title="Body Temperature"
              yLabel="°C"
              description="This chart shows body temperature trends over time."
              unit="°C"
            />
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChartSection;
