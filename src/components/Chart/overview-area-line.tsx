import React from 'react';
import { Chart, Line, Axis, Area, Tooltip, Legend } from 'bizcharts';
import { Spin } from '@arco-design/web-react';
import CustomTooltip from './customer-tooltip';

function OverviewAreaLine({
  data,
  loading,
  name = '总内容量',
  color = '#4080FF',
}: {
  data: any[];
  loading: boolean;
  name?: string;
  color?: string;
}) {
  return (
    <Spin loading={loading} style={{ width: '100%' }}>
      <Chart
        scale={{ value: { min: 0 } }}
        padding={[10, 20, 50, 40]}
        autoFit
        height={300}
        data={data}
        color='name'
        className={'chart-wrapper'}
      >
        <Line
          shape="smooth"
          position="date*count"
          size={3}
          color='name'
        />
        <Area
          position="date*count"
          shape="smooth"
          color='name'
        />
        <Tooltip shared showCrosshairs region={null} g2-tooltip-list-item={{display:'flex'}}/>
      </Chart>
    </Spin>
  );
}

export default OverviewAreaLine;
