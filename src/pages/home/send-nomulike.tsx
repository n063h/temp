import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, Card, Radio, Table, Typography, Grid, Space, Avatar, Badge, FormInstance, Message, Form, Input, AutoComplete, InputTag, InputNumber, Button, Select, Spin, Popconfirm } from '@arco-design/web-react';
import { IconCaretDown, IconCaretUp } from '@arco-design/web-react/icon';
import axios from 'axios';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/popular-contents.module.less';
import categories from '@/utils/categories'

const { Row, Col } = Grid;


const COLORS_CUSTOM = [
  'rgb(var(--red-1))',
  'rgb(var(--orange-1))',
  'rgb(var(--lime-1))',
  'rgb(var(--cyan-1))',
  'rgb(var(--arcoblue-1))',
  'rgb(var(--pinkpurple-1))',
  'rgb(var(--gray-1))',
];
const Category = ({ text, idx ,checked}) => {
  return (
    <Badge count={<span>{ checked?'✅':''}</span>}>
    <Card
        hoverable
        style={{ width: 135, backgroundColor: checked?'rgb(var(--green-5))':COLORS_CUSTOM[idx],marginBottom:10 }}
      >
            <Space
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Space>
        <Typography.Text>{text}</Typography.Text>
      </Space>
    </Space>
      </Card>
      </Badge>
  );
};

function SendLike() {
  const t = useLocale(locale);
  const formRef = useRef<FormInstance>();
  const [loading, setLoading] = useState(false);
  const [people, setPeople] = useState([]);
  const [showPeople, setShowPeople] = useState([]);
  const [catoOpt,setCatoOpt] = useState(categories[0])
  const fetchData = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `/api/index/people`
      )
      .then((res) => {
        setPeople(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setShowPeople(people);
  },[people])

  useEffect(() => {
    fetchData();
  }, []);

  function submit(data) {
    setLoading(true);
    axios
      .post('/api/index/send', {
        data,
      })
      .then(() => {
        Message.success(t['groupForm.submitSuccess']);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSubmit() {
    formRef.current.validate().then(submit);
  }

  function handleReset() {
    formRef.current.resetFields();
  }
  const debouncedFetchUser = (s) => {
    setShowPeople(people.filter(i=>i.includes(s)))
  }

  const cato = categories.map((ca, idx) => <Radio key={ca}><Category text={ca} checked={idx==0} idx={idx}/></Radio>)

  return (
    <Card style={{height:'100%'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography.Title heading={6}>
          {t['sendLike']}
        </Typography.Title>
      </div>
      <Row >
        <Col flex={6}>
          <div>
            <Typography.Title heading={6}>
              {t['sendLike.categories']}
            </Typography.Title>
            <Space wrap size={[6, 6]}>
            <Radio.Group value={catoOpt} onChange={setCatoOpt}>
              {categories.map((category,idx) => {
                return (
                  <Radio key={category} value={category}>
                    {({ checked }) => <Category text={category} checked={checked} idx={idx}/>}
                  </Radio>
                );
              })}
            </Radio.Group>
              
            </Space>
          
          </div>
          <Form
            initialValues={{
              amount:1
            }}
            layout="vertical"
            ref={formRef}
            className={styles['form-group']}>
            <Row justify='space-between'>
              <Col span={12}>
              <Form.Item
                label={t['sendLike.to']}
                field="to"
              >
                    <Select
                      showSearch
                      mode='multiple'
                      options={showPeople}
                      placeholder='Search by name/group-name'
                      filterOption={false}
                      notFoundContent={
                        loading ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Spin style={{ margin: 12 }} />
                          </div>
                        ) : null
                      }
                      onSearch={debouncedFetchUser}
                    />
              </Form.Item>
              </Col>

              <Col span={6}>
              <Form.Item
                label={t['sendLike.amount']}
                  field="amount"
                  disabled
              >
                  <InputNumber
                    style={{width: 150}}
                    min={1}
                    mode='button'
                    defaultValue={1}
                    suffix='❤️'
                    step={1}
                />
              </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
              <Form.Item
                label={t['sendLike.comment']}
                  field="comment"
              >
                <Input.TextArea placeholder='Please enter ...' style={{ minHeight: 64 }} />
              </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className={styles.actions}>
        <Space>
          <Button onClick={handleReset} size="large">
            {t['sendLike.reset']}
              </Button>
              <Popconfirm
        title='Do you want to send'
                okText='Sure'
                onOk={handleSubmit}
        cancelText='Cancel'
      >
          <Button
            type="primary"
            loading={loading}
            size="large"
          >
            {t['sendLike.submit']}
                </Button>
                </Popconfirm>
        </Space>
      </div>
        </Col>
      </Row>

    </Card>
  );
}

export default SendLike;
