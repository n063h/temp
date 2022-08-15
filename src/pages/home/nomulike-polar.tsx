import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography } from '@arco-design/web-react';
import { DonutChart } from 'bizcharts';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import AreaPolar from '@/components/Chart/area-polar';

function NomulikePolar() {
  const t = useLocale(locale);
  const [data, setData] = useState({ list: [], fields: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    axios
      .get('/api/index/polar')
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card style={{height:'100%'}}>
      <Typography.Title heading={6}>
        {t['nomulikePolar.title']}
      </Typography.Title>
      <div style={{marginTop:100}}>
      <AreaPolar
            data={data.list}
            fields={data.fields}
            height={280}
            loading={loading}
          />
      </div>
    </Card>
  );
}

export default NomulikePolar;
