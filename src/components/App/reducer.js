function regenerateIndices(array) {
  array.forEach((item, index) => {
    item.index = index;
  });
}

export function reducer(state, action) {
  switch (action.type) {
    case 'remove':
      console.log(action);
      if (typeof action.data.parent === 'undefined') {
        return undefined;
      }
      if (action.data.parent.type === 'arrayItem') {
        const arrayItem = action.data.parent;
        arrayItem.parent.items.splice(action.data.parent.index, 1);
        regenerateIndices(arrayItem.parent.items);

        let result = action.data;
        while (result.parent !== undefined) {
          result = result.parent;
        }
        return Object.assign({}, result);
      } else if (action.data.parent.type === 'objectItem') {
        action.data.parent.parent.items.splice(action.data.parent.index, 1);
        regenerateIndices(action.data.parent.parent.items);

        let result = action.data;
        while (result.parent !== undefined) {
          result = result.parent;
        }
        return Object.assign({}, result);
      }
      break;
    default:
      throw new Error();
  }
}
