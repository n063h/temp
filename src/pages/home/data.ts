const createNode = (idx: number) => {
  const size = Math.floor(Math.random() * 55);
  return {
    id: 'id ' + idx,
    name: 'name ' + idx,
    size: size,
    label: 'idx ' + idx,
    comboId: Math.floor(Math.random() * 5)
  };
};

const createEdge = (start: number, end: number) => {
  const length = end - start;
  const i = Math.floor(Math.random() * length) + start;
  let j = -1;
  while (j < 0 || j === i) {
    j = Math.floor(Math.random() * length) + start;
  }
  const weight = Math.floor(Math.random() * 10) + 1;
  return {
    id: `${i}->${j}`,
    source: 'id ' + i,
    target: 'id ' + j,
    wight: weight,
    label: weight.toString()
  };
};

const createCombo = (idx: number) => {
  return {
    id: `${idx}`,
    label: 'Combo ' + idx,
    parentId: idx > 3 ? '0' : false
  };
};

const createGraph = (len = 100) => {
  const nodes = Array(len)
    .fill(0)
    .map((_, idx) => createNode(idx));
  const edges = Array(len)
    .fill(0)
    .map((_, idx) => createEdge(0, len));
  const combos = Array(5)
    .fill(0)
    .map((_, idx) => createCombo(idx));
  const uniqueEdges = edges.filter(
    (edge, idx) =>
      edges.findIndex(
        (e) => e.source === edge.source && e.target === edge.target
      ) === idx
  );
  return {
    nodes,
    edges: uniqueEdges,
    combos
  };
};

export default createGraph(100);
