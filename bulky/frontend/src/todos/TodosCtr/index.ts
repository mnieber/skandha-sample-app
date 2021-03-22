import { setCallbacks } from 'aspiration';
import {
  data,
  facet,
  getm,
  mapDataToFacet,
  mapDatasToFacet,
  registerFacets,
} from 'skandha';
import { makeCtrObservable } from 'skandha-mobx';
import { TodoByIdT, TodoT } from 'src/todos/types';
import { Filtering, Highlight, Selection, Selection_select } from './facets';
import { handleSelectItem } from './handlers';
import {
  highlightFollowsSelection,
  highlightIsCorrectedOnFilterChange,
} from './policies';

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
      select: {
        selectItem(this: Selection_select) {
          handleSelectItem(ctr.selection, this.selectionParams);
          highlightFollowsSelection(ctr.selection, this.selectionParams);
        },
      },
    });

    setCallbacks(this.filtering, {
      apply: {
        exit() {
          highlightIsCorrectedOnFilterChange(ctr.filtering);
        },
      },
    });
  }

  private _applyPolicies() {
    mapDataToFacet(
      [Filtering, 'inputItems'],
      getm([Inputs, 'todoById']),
      (x: TodoByIdT) => Object.values(x)
    )(this);

    mapDataToFacet(
      [Outputs, 'filteredTodoById'],
      getm([Filtering, 'filteredItems']),
      (items: TodoT[]) =>
        items.reduce((acc: any, x: TodoT) => ({ ...acc, [x.id]: x }), {})
    )(this);

    mapDataToFacet(
      [Selection, 'selectableIds'],
      getm([Outputs, 'filteredTodoById']),
      (x: TodoByIdT) => Object.keys(x)
    )(this);

    mapDatasToFacet(
      [Selection, 'items'],
      [
        //
        getm([Selection, 'ids']),
        getm([Inputs, 'todoById']),
      ],
      (ids: string[], todoById: TodoByIdT) => ids.map((id) => todoById[id])
    )(this);

    mapDatasToFacet(
      [Highlight, 'item'],
      [
        //
        getm([Highlight, 'id']),
        getm([Inputs, 'todoById']),
      ],
      (id: string, todoById: TodoByIdT) => todoById[id]
    )(this);
  }
}
