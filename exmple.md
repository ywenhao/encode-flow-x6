```ts
graph.addEdge({
  source,
  target,
  // https://x6.antv.vision/zh/docs/api/registry/router#er
  router: {
    name: 'er',
    args: {
      offset: 'center',
    },
  },
  connector: {
    name: 'rounded',
    args: {
      radius: 10,
    },
  },
  attrs: {
    line: {
      stroke: '#722ed1',
    },
  },
})
```