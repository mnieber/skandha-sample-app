import { Selection, SelectionParamsT } from 'src/todos/TodosCtr/facets';

function _range(start: number, stop: number) {
  var ans: number[] = [];
  for (let i = start; i < stop; i++) {
    ans.push(i);
  }
  return ans;
}

export function handleSelectItem(
  facet: Selection,
  { itemId, isShift, isCtrl }: SelectionParamsT
) {
  const hasItem = facet.ids.includes(itemId);
  const selectableIds = facet.selectableIds;

  if (!selectableIds) {
    throw Error('logical error');
  }

  if (isShift) {
    const startItemId = facet.anchorId || itemId;
    const startIdx = selectableIds.indexOf(startItemId);
    const stopIdx = selectableIds.indexOf(itemId);
    const idxRange = _range(
      Math.min(startIdx, stopIdx),
      1 + Math.max(startIdx, stopIdx)
    );
    facet.ids = idxRange.map((idx) => selectableIds[idx]);
  } else if (isCtrl) {
    facet.ids = hasItem
      ? facet.ids.filter((x) => x !== itemId)
      : [...facet.ids, itemId];
  } else {
    facet.ids = [itemId];
  }

  // Move the anchor
  if (!(isCtrl && hasItem) && !(isShift && !!facet.anchorId)) {
    facet.anchorId = itemId;
  }
}
