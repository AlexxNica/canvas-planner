import daysReducer from '../days-reducer';

it('groups new state with old state on GOT_ITEMS_SUCCESS', () => {
  const initialState = {
    '2017-04-27': [],
    '2017-04-26': []
  };

  const newState = daysReducer(initialState, {
    type: 'GOT_ITEMS_SUCCESS',
    payload: [{ date: '2017-04-28' }]
  });

  expect(newState).toMatchObject({
    '2017-04-27': [],
    '2017-04-26': [],
    '2017-04-28': [{ date: '2017-04-28' }]
  });
});

it('adds a new day on ADD_DAY', () => {
  const initialState = {
    '2017-04-27': [],
    '2017-04-26': []
  };

  const newState = daysReducer(initialState, {
    type: 'ADD_DAY',
    payload: '2017-04-29'
  });

  expect(newState).toMatchObject({
    '2017-04-27': [],
    '2017-04-26': [],
    '2017-04-29': []
  });
});