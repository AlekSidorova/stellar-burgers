import { describe, test, expect, beforeEach } from '@jest/globals';
import reducer, { fetchIngredientsThunk } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

let initialState: {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};
let mockIngredients: TIngredient[];

beforeEach(() => {
  initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];
});

describe('fetchIngredientsThunk extraReducers', () => {
  //проверяет, что происходит, когда действие fetchIngredientsThunk.pending выполняется
  test('pending - когда загрузка начинается', () => {
    initialState.error = 'Ошибка';

    const action = { type: fetchIngredientsThunk.pending.type };
    const state = reducer(initialState, action);

    //началась загрузка и ошибка очищается
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  //что происходит, когда данные успешно загружены (действие fulfilled)
  test('fulfilled - когда данные успешно загружены', () => {
    const action = {
      type: fetchIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer(initialState, action);

    //загрузка завершена-обновились данные-ошибка очищена
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  //то происходит, когда возникает ошибка при загрузке (действие rejected)
  test('rejected - когда произошла ошибка', () => {
    const action = {
      type: fetchIngredientsThunk.rejected.type,
      error: { message: 'Ошибка загрузки данных' }
    };
    const state = reducer(initialState, action);

    //загрузка завершена и получено сообщение об ошибке
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки данных');
  });

  //что происходит, если нет сообщения об ошибке
  test('rejected без сообщения устанавливает дефолтный error', () => {
    const action = { type: fetchIngredientsThunk.rejected.type, error: {} };
    const state = reducer(initialState, action);

    //значение по умолчанию
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
