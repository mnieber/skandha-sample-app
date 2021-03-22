import { Cbs, host, stub } from 'aspiration';
import { data, operation } from 'skandha';

export type SelectionParamsT = {
  itemId: string;
  isShift: boolean;
  isCtrl: boolean;
};

export class Selection_select extends Cbs {
  selectionParams: SelectionParamsT = stub();
  selectItem() {}
}

export class Selection<ValueT = any> {
  @data selectableIds: Array<string> = stub();
  @data ids: Array<string> = [];
  @data anchorId?: string;
  @data items?: Array<ValueT>;

  @operation @host select(selectionParams: SelectionParamsT) {
    return (cbs: Selection_select) => {
      if (!this.selectableIds.includes(selectionParams.itemId)) {
        throw Error(`Invalid id: ${selectionParams.itemId}`);
      }
      cbs.selectItem();
    };
  }
}

export class Highlight_highlightItem extends Cbs {
  id: string = stub();
}

export class Highlight<ValueT = any> {
  @data id: string | undefined;
  @data item?: ValueT;

  @operation @host highlightItem(id: string) {
    return (cbs: Highlight_highlightItem) => {
      this.id = id;
    };
  }
}

export type FilterT = (x: any) => Array<any>;

export class Filtering_apply extends Cbs {
  filter?: FilterT;
}

export class Filtering_setEnabled extends Cbs {
  flag: boolean = stub();
}

export class Filtering<ValueT = any> {
  @data isEnabled: boolean = false;
  @data filter: FilterT = () => [];

  @data inputItems?: Array<ValueT>;
  @data get filteredItems() {
    return this.isEnabled ? this.filter(this.inputItems) : this.inputItems;
  }

  @operation @host apply(filter: FilterT) {
    return (cbs: Filtering_apply) => {
      this.filter = filter;
      this.isEnabled = true;
    };
  }

  @operation @host setEnabled(flag: boolean) {
    return (cbs: Filtering_setEnabled) => {
      this.isEnabled = flag;
    };
  }
}
