import { createSelector } from 'reselect';

const userDetailsState = (state) => state.userDetails;

export const userDetailsSelector = createSelector(userDetailsState, (userDetails) => {
    return userDetails;
  });

