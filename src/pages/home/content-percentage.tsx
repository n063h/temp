import React, { useState, useEffect } from 'react';
import { Card, Spin, Typography } from '@arco-design/web-react';
import { DonutChart } from 'bizcharts';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import AreaPolar from '@/components/Chart/area-polar';

function PopularContent() {
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
    <Card>
      <Typography.Title heading={6}>
        {t['workplace.contentPercentage']}
      </Typography.Title>
      <AreaPolar
            data={data.list}
            fields={data.fields}
            height={257}
            loading={loading}
          />
    </Card>
  );
}

export default PopularContent;
