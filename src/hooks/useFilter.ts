import { IChangeItemParams } from "../components/filter/FilterGroup";
import {
  INITIAL_FILTER_OPTION_STATE,
  INITIAL_FILTER_OPTION_VALUE,
} from "../constants/initialFilterValues";
import {
  IFilterGroup,
  OnFilterChangeFunction,
} from "../interfaces/filterInterfaces";
import { deepClone } from "../utils/functions/deepClone";

interface IUseFilterProps {
  filterValues: IFilterGroup[];
  onFilterChange: OnFilterChangeFunction;
  onResetFilter: () => void;
}

export function useFilter({
  onFilterChange,
  onResetFilter,
  filterValues,
}: IUseFilterProps) {
  function addOr(id: string) {
    const updateArray = deepClone(filterValues);
    const boxIndex = updateArray.findIndex((box) => box.id === id);
    if (boxIndex === -1) {
      return console.error(`Box with ID ${id} not found.`);
    }
    updateArray[boxIndex].values.push(INITIAL_FILTER_OPTION_VALUE());
    onFilterChange({
      newValues: updateArray,
      shouldRefilter: false,
    });
  }

  function addAnd() {
    const currentValues = deepClone(filterValues);
    onFilterChange({
      newValues: [...currentValues, INITIAL_FILTER_OPTION_STATE()],
      shouldRefilter: false,
    });
  }

  function removeOr(parentId: string, id: string) {
    const updateArray = deepClone(filterValues);
    const boxIndex = updateArray.findIndex((box) => box.id === parentId);
    if (updateArray[boxIndex].values.length === 1) {
      const filteredArray = updateArray.filter((box) => box.id !== parentId);

      return onFilterChange({ newValues: filteredArray, shouldRefilter: true });
    }
    updateArray[boxIndex].values = updateArray[boxIndex].values.filter(
      (value) => value.id !== id
    );
    onFilterChange({ newValues: updateArray, shouldRefilter: true });
  }

  function onChangeItem({ e, field, parentId, id }: IChangeItemParams<string>) {
    const updatedFilters = deepClone(filterValues);
    const parentIndex = updatedFilters.findIndex((box) => box.id === parentId);
    if (parentIndex === -1) {
      return console.error(`Parent object with ID ${parentId} not found.`);
    }
    const targetIndex = updatedFilters[parentIndex].values.findIndex(
      (item) => item.id === id
    );
    if (targetIndex === -1) {
      return console.error(`Target object with ID ${id} not found.`);
    }
    const updatedTarget = {
      ...updatedFilters[parentIndex].values[targetIndex],
    };

    updatedFilters[parentIndex].values[targetIndex] = {
      ...updatedTarget,
      [field]: e.target.value,
    };

    onFilterChange({ newValues: updatedFilters, shouldRefilter: true });
  }

  function resetFilter() {
    onResetFilter();
    onFilterChange({
      newValues: [INITIAL_FILTER_OPTION_STATE()],
      shouldRefilter: true,
    });
  }

  return {
    addOr,
    addAnd,
    removeOr,
    onChangeItem,
    resetFilter,
  };
}
