import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Grid,
  Card,
  Typography,
  Divider,
  Skeleton,
  Link,
  Statistic,
} from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { IconCaretUp, IconEdit, IconHeart, IconHeartFill, IconSend, IconThumbUp } from '@arco-design/web-react/icon';
import OverviewAreaLine from '@/components/Chart/overview-area-line';
import axios from 'axios';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import styles from './style/overview.module.less';
import IconCalendar from './assets/calendar.svg';
import IconComments from './assets/comments.svg';
import IconContent from './assets/content.svg';
import IconIncrease from './assets/increase.svg';
import Title from '@arco-design/web-react/es/Typography/title';

const { Row, Col } = Grid;

type StatisticItemType = {
  icon?: ReactNode;
  title?: ReactNode;
  count?: ReactNode;
  loading?: boolean;
  unit?: ReactNode;
};

function StatisticItem(props: StatisticItemType) {
  const { icon, title, count, loading, unit } = props;
  return (
    <div className={styles.item}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <Skeleton loading={loading} text={{ rows: 2, width: 60 }} animation>
          <div className={styles.title}>{title}</div>
          <div className={styles.count}>
            {count}
            <span className={styles.unit}>{unit}</span>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

type DataType = {
  likesYouHave?: string;
  likesYouSent?: string;
  likesYouReceived?: string;
  growthRate?: string;
  chartData?: { count?: number; date?: string }[];
  down?: boolean;
};

function Overview() {
  const [data, setData] = useState<DataType>({});
  const [loading, setLoading] = useState(true);
  const t = useLocale(locale);

  const userInfo = useSelector((state: any) => state.userInfo || {});

  const fetchData = () => {
    setLoading(true);
    axios
      .get('/api/index/overview-content')
      .then((res) => {
        setData(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatedData = useMemo(() => {
    return [
      {
        title: t['likesYouSent'],
        icon: <IconSend />,
        value: data['likesYouSent'],
        background: 'rgb(var(--orange-2))',
        color: 'rgb(var(--orange-6))',
      },
      {
        title: t['likesYouReceived'],
        icon: <IconHeartFill />,
        value: data['likesYouHave'],
        background: 'rgb(var(--cyan-2))',
        color: 'rgb(var(--red-6))',
      },
    ]
  }, [t, data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <Typography.Title heading={5}>
        {t['likesTrend']}
      </Typography.Title>
      <Divider />
      <Row>
        {formatedData.map((item, index) => 
          <Col key={index} flex={1}>
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
          </Col>
        )}
      </Row>
      <Row>
        <Col flex={1}>
        <div>
        <div className={styles.ctw}>
          <Typography.Paragraph
            className={styles['chart-title']}
            style={{ marginBottom: 0 }}
          >
            {t['1year']}
          </Typography.Paragraph>
        </div>
        <OverviewAreaLine name={t['likesTrend']} data={data.chartData} loading={loading} />
      </div>
        </Col>
      </Row>
      <Divider />
    </Card>
  );
}

export default Overview;
