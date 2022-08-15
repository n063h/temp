import G6 from '@antv/g6';
import { Button, Card, Divider, Typography } from '@arco-design/web-react';
import { useEffect } from 'react';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import './style/graph.less'


export default ({data}) => {
  const t = useLocale(locale);
  let graph;
  useEffect(() => {
      // cache the initial combo children infomation
  const comboChildrenCache = {};
  // cache the initial parent infomation
  const itemComboMap = {};
  // cache the initial node and combo info
  const itemMap = {};
  // cache the combo related edges
  const comboEdges = {};
  (data.nodes.concat(data.combos)).forEach(item => {
    const { id, comboId, parentId } = item;
    const parentComboId = comboId || parentId;
    if (parentComboId) {
      if (!comboChildrenCache[parentComboId]) comboChildrenCache[parentComboId] = [];
      comboChildrenCache[parentComboId].push(id);
      itemComboMap[id] = parentComboId;
    }
    itemMap[id] = { ...item };
  });
  const comboIds = data.combos.map(combo => combo.id);
  data.edges.forEach(edge => {
    const { source, target } = edge;
    [source, target].forEach(endId => {
      if (comboIds.includes(endId)) {
        if (!comboEdges[endId]) comboEdges[endId] = [];
        comboEdges[endId].push(edge);
      }
    })
  });
  
  // colorize the nodes and combos
  const subjectColors = [
    '#5F95FF', // blue
    '#61DDAA',
    '#65789B',
    '#F6BD16',
    '#7262FD',
    '#78D3F8',
    '#9661BC',
    '#F6903D',
    '#008685',
    '#F08BB4',
  ];
  const backColor = '#fff';
  const theme = 'default';
  const disableColor = '#777';
  const colorSets = G6.Util.getColorSetsBySubjectColors(
    subjectColors,
    backColor,
    theme,
    disableColor,
  );
  data.combos.forEach((combo, i) => {
    const color = colorSets[i % colorSets.length];
    combo.style = {
      stroke: color.mainStroke,
      fill: color.mainFill,
      opacity: 0.8
    }
    itemMap[combo.id].style = { ...combo.style }
  })
  data.nodes.forEach(node => {
    const comboId = itemComboMap[node.id];
    const parentCombo = itemMap[comboId];
    if (parentCombo) {
      node.style = {
        stroke: parentCombo.style.stroke,
        fill: parentCombo.style.fill
      }
    }
  })
  
  const contextMenu = new G6.Menu({
    itemTypes: ['combo', 'node'],
    shouldBegin: (evt) => {
      // avoid showing up context menu in some situations
      const type = evt.item.getType();
      const { id, comboId, collapsed } = evt.item.getModel();
      if (collapsed) return false;
  
      const hasOriComboId = Object.values(comboChildrenCache).find((childrenIds:string[]) => childrenIds.includes(id));
      if (type === 'node' && (comboId || !hasOriComboId)) return false;
      return true;
    },
    getContent: (evt) => {
      const type = evt.item.getType();
      const { id, comboId, parentId, collapsed } = evt.item.getModel();
      const hasOriComboId = Object.values(comboChildrenCache).find((childrenIds:string[]) => childrenIds.includes(id));
  
      if (type === 'combo') {
        // no context menu for collapsed combo
        if (collapsed) return ''
        // does not have parent currently but had parent at initial
        if (hasOriComboId && !parentId) return `<span id="uncombo">uncombo</span><br/><span id="re-combo">re-combo</span>`;
        // did not have parent at initail
        return `<span id="uncombo">uncombo</span>`;
      }
  
      // has combo currently
      if (comboId) return '';
      // does not have combo but had combo at initial
      if (hasOriComboId) return `<span id="recombo">re-combo</span>`;
      return '';
    },
    handleMenuClick: (target, item) => {
      if (target.innerHTML === 'uncombo') {
        graph.uncombo(item);
        graph.layout();
      } else {
        const id = item.getID();
        const comboId = itemComboMap[id];
        if (comboId) {
          const childrenIds = comboChildrenCache[comboId].filter(cid => !!graph.findById(cid));
          graph.createCombo({
            ...itemMap[comboId]
          }, childrenIds);
          // add the related edges back
          comboEdges[comboId]?.forEach(edge => {
            const { source, target } = edge;
            const otherEnd = source === comboId ? target : source;
            // add it back only when the other end of the edge exist currently
            if (graph.findById(otherEnd)) {
              graph.addItem('edge', edge);
            }
          });
          graph.layout();
        }
      }
    },
  })
  
  graph = new G6.Graph({
    container: 'container',
    width:1980,
    height:500,
    fitView: true,
    fitViewPadding: 50,
    animate: true,
    minZoom: 0.00000001,
    plugins: [contextMenu],
    layout: {
      type: 'comboCombined',
      spacing: 5,
      outerLayout: new G6.Layout['forceAtlas2']({
        kr: 10
      })
    },
    defaultNode: {
      size: 15,
      style: {
        lineWidth: 2,
        fill: '#C6E5FF',
      },
    },
    defaultEdge: {
      size: 2,
      color: '#e2e2e2',
      lineWidth: 22,
      style: {
        endArrow: true,
        startArrow: true
      }
    },
    defaultCombo: {
      collapsedSubstituteIcon: {
        show: true,
        img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IEQFS5VtXX8AAAAAAAAAAABkARQnAQ',
        width: 68,
        height: 68
      }
    },
    modes: {
      default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas', 'collapse-expand-combo'],
    },
  });
  graph.data(data);
  graph.render();
  }, [])
  const focusNode = () => {
    const node = graph.findById('id 1');
    if (node) {
      graph.focusItem(node);
    }
  }
  const focusCombo = () => {
    const node = graph.findById('3');
    if (node) {
      graph.focusItem(node);
    }
  }
  const fitCenter = () => {
    graph.fitCenter()
  }
  const fitView = () => {
    graph.fitView(20)
  }
  return (
    <Card>
    <Typography.Title heading={5}>
      {t['likesGraph']}
    </Typography.Title>
    <Divider />
      <div id="container" ></div>
      <Divider />
      <Button onClick={focusNode}>focusNode</Button>
      <Button onClick={focusCombo}>focusCombo</Button>
      <Button onClick={fitCenter}>fitCenter</Button>
      <Button onClick={fitView}>fitView</Button>
      </Card>
  )
}
