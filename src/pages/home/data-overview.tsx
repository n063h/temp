// 数据总览
import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Typography,
  Grid,
  Statistic,
  Skeleton,
} from '@arco-design/web-react';
import axios from 'axios';
import {
  IconUser,
  IconEdit,
  IconHeart,
  IconThumbUp,
} from '@arco-design/web-react/icon';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/data-overview.module.less';
import MultiAreaLine from '@/components/Chart/multi-area-line';

const { Title } = Typography;
export default () => {
  const t = useLocale(locale);
  const [overview, setOverview] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const { data } = await axios
      .get('/api/index/overview')
      .finally(() => setLoading(false));

    const { overviewData, chartData } = data;
    setLineData(chartData);
    setOverview(overviewData);
  };

  useEffect(() => {
    getData();
  }, []);

  const formatedData = useMemo(() => {
    return [
      {
        title: t['likesYouSent'],
        icon: <IconEdit />,
        value: lineData[0],
        background: 'rgb(var(--orange-2))',
        color: 'rgb(var(--orange-6))',
      },
      {
        title: t['likesYouReceived'],
        icon: <IconThumbUp />,
        value: lineData[1],
        background: 'rgb(var(--cyan-2))',
        color: 'rgb(var(--cyan-6))',
      },
    ]
  }, [t, lineData]);

  return (
    <Grid.Row justify="space-between">
      {formatedData.map((item, index) => (
        <Grid.Col span={24 / formatedData.length} key={`${index}`}>
          <Card className={styles.card} title={null}>
            <Title heading={6}>{item.title}</Title>
            <div className={styles.content}>
              <div
                style={{ backgroundColor: item.background, color: item.color }}
                className={styles['content-icon']}
              >
                {item.icon}
              </div>
              {loading ? (
                <Skeleton
                  animation
                  text={{ rows: 1, className: styles['skeleton'] }}
                  style={{ width: '120px' }}
                />
              ) : (
                <Statistic value={item.value} groupSeparator />
              )}
            </div>
          </Card>
        </Grid.Col>
      ))}
      <Grid.Col span={24}>
        <MultiAreaLine data={lineData} loading={loading} />
      </Grid.Col>
    </Grid.Row>
  );
};
