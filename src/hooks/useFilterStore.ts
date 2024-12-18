import { UserFilters } from '@/types';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';

type FilterState = {
  filters: UserFilters;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilters: (filterName: keyof FilterState['filters'], value: any) => void;
};

const useFilterStore = create<FilterState>()(
  devtools((set) => ({
    filters: {
      ageRange: [18, 100],
      gender: ['male', 'female'],
      orderBy: 'updated',
      withPhoto: true,
    },
    setFilters: (filterName, value) =>
      set((state) => {
        return {
          filters: { ...state.filters, [filterName]: value },
        };
      }),
  }))
);

export default useFilterStore;
