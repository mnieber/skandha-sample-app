import { setCallbacks } from 'aspiration';
import {
  data,
  facet,
  getm,
  mapDataToFacet,
  registerFacets,
  installPolicies,
} from 'skandha';
import { Filtering, filteringUsesInputItems } from 'skandha-facets/Filtering';
import {
  Highlight,
  highlightUsesItemLookUpTable,
} from 'skandha-facets/Highlight';
import {
  highlightFollowsSelection,
  highlightIsCorrectedOnFilterChange,
} from 'skandha-facets/policies';
import {
  handleSelectItem,
  Selection,
  SelectionCbs,
  selectionUsesItemLookUpTable,
  selectionUsesSelectableIds,
} from 'skandha-facets/Selection';
import { makeCtrObservable } from 'skandha-mobx';
import { TodoByIdT, TodoT } from 'src/todos/types';

class Inputs {
  @data todoById: TodoByIdT = {};
}

class Outputs {
  @data filteredTodoById: TodoByIdT = {};
}

export class TodosCtr {
  @facet inputs: Inputs = new Inputs();
  @facet outputs: Outputs = new Outputs();
  @facet selection: Selection<TodoT> = new Selection<TodoT>();
  @facet highlight: Highlight<TodoT> = new Highlight<TodoT>();
  @facet filtering: Filtering<TodoT> = new Filtering<TodoT>();

  constructor() {
    registerFacets(this);
    this._setCallbacks();
    this._applyPolicies();
    makeCtrObservable(this);
  }

  private _setCallbacks() {
    const ctr = this;

    setCallbacks(this.selection, {
      selectItem: {
        selectItem(this: SelectionCbs['selectItem']) {
          handleSelectItem(ctr.selection, this.selectionParams);
          highlightFollowsSelection(ctr.selection, this.selectionParams);
        },
      },
    });

    setCallbacks(this.filtering, {
      setEnabled: {
        exit() {
          highlightIsCorrectedOnFilterChange(ctr.filtering);
        },
      },
    });
  }

  private _applyPolicies() {
    const policies = [
      selectionUsesSelectableIds(
        getm([Outputs, 'filteredTodoById']),
        Object.keys
      ),
      selectionUsesItemLookUpTable(getm([Inputs, 'todoById'])),
      highlightUsesItemLookUpTable(getm([Inputs, 'todoById'])),
      filteringUsesInputItems(getm([Inputs, 'todoById']), Object.values),
      mapDataToFacet(
        [Outputs, 'filteredTodoById'],
        getm([Filtering, 'filteredItems']),
        (items: TodoT[]) =>
          items.reduce((acc: any, x: TodoT) => ({ ...acc, [x.id]: x }), {})
      ),
    ];

    installPolicies<TodosCtr>(policies, this);
  }
}
