import React from 'react';
import { Grid, Space } from '@arco-design/web-react';
import Overview from './overview';
import LineTrend from './line-trend';
import DataOverview from './data-overview';
import PopularContents from './popular-contents';
import ContentPercentage from './content-percentage';
import Shortcuts from './shortcuts';
import Announcement from './announcement';
import Carousel from './carousel';
import Docs from './docs';
import NomulikePolar from './nomulike-polar';
import styles from './style/index.module.less';
import './mock';
import Graph from './graph'
import SendLike from './send-nomulike'
import data from './data'
const { Row, Col } = Grid;

const gutter = 16;

function Workplace() {
  return (
    <div className={styles.wrapper}>
      <Space style={{width:'100%'}} size={16} direction="vertical" >
        <Overview />
        <Row style={{height:'520px'}} gutter={gutter}>
          <Col style={{height:'100%'}} span={14}>
            <SendLike />
          </Col>
          <Col style={{height:'100%'}} span={10}>
            <NomulikePolar />
          </Col>
        </Row>
        <LineTrend />
        <Graph data={data}/>
      </Space>
    </div>
  );
}

export default Workplace;
