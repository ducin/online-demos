const pageSize = 50

const iteratorFn = (consumerCb) => {
  let aggr = {}
  return (chunk, completedPercent) => {
    aggr = chunk.reduce(groupByNationality, aggr)
    consumerCb(aggr, completedPercent)
  }
}

const $nationalities = c3.generate({
  bindto: '#nationalities',
  data: {
      columns: [],
      type : 'pie'
  }
});

const $completeness = c3.generate({
  bindto: '#completeness',
  data: {
      columns: [
        ['completed', 0]
      ],
      type : 'gauge'
  },
  color: {
    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
    threshold: {
      // unit: 'value', // percentage is default
      // max: 200, // 100 is default
      values: [30, 60, 90, 100]
    }
  },
  size: {
    height: 180
  }
});

processEmployees(pageSize, iteratorFn((columns, completedPercent) => {
  $nationalities.load({ columns: Object.entries(columns) })
  $completeness.load({ columns: [['completed', completedPercent * 100]] })
}))
