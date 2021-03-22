import { getf, getc } from 'skandha';
import {
  Highlight,
  Selection,
  SelectionParamsT,
  Filtering,
} from 'src/todos/TodosCtr/facets';

export function highlightFollowsSelection(
  facet: Selection,
  selectionParams: SelectionParamsT
) {
  const { isCtrl, isShift, itemId } = selectionParams;
  const ctr = getc(facet);
  if (!isCtrl && !isShift) {
    getf(Highlight, ctr).highlightItem(itemId);
  }
}

function _findNeighbourIdx(
  filteredItems: Array<any>,
  allItems: Array<any>,
  beginIndex: number,
  endIndex: number,
  step: number
) {
  for (var idx = beginIndex; idx !== endIndex; idx += step) {
    if (filteredItems.includes(allItems[idx])) {
      return { result: idx };
    }
  }
  return undefined;
}

export function highlightIsCorrectedOnFilterChange(facet: Filtering) {
  const ctr = getc(facet);
  if (facet.isEnabled) {
    const highlight = getf(Highlight, ctr).id;
    const inputItems = facet.inputItems;
    const filteredItemIds = (facet.filteredItems ?? []).map((x) => x.id);
    const inputIds = (inputItems || []).map((x) => x.id);

    if (
      highlight &&
      inputIds.includes(highlight) &&
      !filteredItemIds.includes(highlight)
    ) {
      const highlightedItemIdx = inputIds.indexOf(highlight);
      const newIdx =
        _findNeighbourIdx(
          filteredItemIds,
          inputIds,
          highlightedItemIdx,
          inputIds.length,
          1
        ) ||
        _findNeighbourIdx(
          filteredItemIds,
          inputIds,
          highlightedItemIdx,
          -1,
          -1
        );

      if (newIdx) {
        getf(Highlight, ctr).highlightItem(inputIds[newIdx.result]);
      }
    }
  }
}
