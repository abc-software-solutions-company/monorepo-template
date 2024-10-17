import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type States = {
  trackerTypes: {
    [key: string]: string;
  };
};

type Actions = {
  setTrackerType: (ruleSetId: string, value: string) => void;
};

const initialState: States = {
  trackerTypes: {},
};

export const useTrackerState = create<States & Actions>()(
  devtools(
    immer(set => ({
      ...initialState,
      setTrackerType: (ruleSetId, data) => {
        set(state => {
          state.trackerTypes[ruleSetId] = data;
        });
      },
    }))
  )
);
