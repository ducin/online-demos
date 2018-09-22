const lazyReduce = (reducerFn, state) =>
  (item) => {
    state = reducerFn(state, item)
    return state
  }

const groupByReducer = (subReducer, getInitial, key) =>
  (groupedItems, item) => {
      if (!groupedItems[item[key]]) {
        groupedItems[item[key]] = getInitial();
      }
      groupedItems[item[key]] = subReducer(groupedItems[item[key]], item)
      return groupedItems;
    }

const countReducer = (c, _) => c + 1
const groupByNationality = groupByReducer(countReducer, () => 0, 'nationality')

// const lazyGroupBy = lazyReduce(groupByNationality, {})
