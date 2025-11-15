import { describe, test, expect, beforeEach } from '@jest/globals';
import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  addIngredientWithId
} from '../constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

//начальные состояния для beforeEach
let initialState: {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

beforeEach(() => {
  initialState = {
    bun: null,
    ingredients: []
  };
});

describe('addIngredient в constructorSlice', () => {
  test('добавление булки', () => {
    const bun: TConstructorIngredient = {
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
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      id: 'bun-1'
    };

    //вызываем редьюсер с начальным состоянием и действием(addIngredient)
    const state = reducer(initialState, addIngredient(bun));

    //state.bun равен добавленной булке
    expect(state.bun).toEqual(bun);

    //длина массива ingredients равноа 0 - там только булки
    expect(state.ingredients.length).toBe(0);
  });

  test('добавление обычного ингредиента', () => {
    const ingredient: TConstructorIngredient = {
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
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      id: 'ing-1'
    };

    const state = reducer(initialState, addIngredient(ingredient));
    expect(state.ingredients).toEqual([ingredient]);

    //state.bun остается null так как булка не была добавлена
    expect(state.bun).toBeNull();
  });
});

describe('removeIngredient в constructorSlice', () => {
  test('удаляет ингредиент по id', () => {
    //исходный state с двумя ингредиентами
    initialState.ingredients = [
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: 'ing-1'
      },
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        id: 'ing-2'
      }
    ];

    const state = reducer(initialState, removeIngredient('ing-1'));

    //после удаления в массиве должен остаться 1 элемент
    expect(state.ingredients).toHaveLength(1);

    //и это должен быть второй элемент
    expect(state.ingredients[0].id).toBe('ing-2');
  });
});

describe('moveIngredient в constructorSlice', () => {
  test('перемещает ингредиент с одного индекса на другой', () => {
    initialState.ingredients = [
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: 'ing-1'
      },
      {
        _id: '643d69a5c3f7b9001cfa093f',
        name: 'Мясо бессмертных моллюсков Protostomia',
        type: 'main',
        proteins: 433,
        fat: 244,
        carbohydrates: 33,
        calories: 420,
        price: 1337,
        image: 'https://code.s3.yandex.net/react/code/meat-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
        id: 'ing-2'
      },
      {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
        id: 'ing-3'
      }
    ];

    //перемещаем элемент с индекса 0 на индекс 2
    const state = reducer(
      initialState,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    //был порядок ['ing-1', 'ing-2', 'ing-3'] стал ['ing-2', 'ing-3', 'ing-1']
    expect(state.ingredients.map((i) => i.id)).toEqual([
      'ing-2',
      'ing-3',
      'ing-1'
    ]);
  });
});

describe('clearConstructor в constructorSlice', () => {
  test('очищает булку и ингредиенты', () => {
    //state  с булкой и ингредиентами
    initialState.bun = {
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
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      id: 'bun-1'
    };

    initialState.ingredients = [
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
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'ing-1'
      },
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: 'ing-2'
      }
    ];

    const state = reducer(initialState, clearConstructor());

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});

describe('addIngredientWithId thunk', () => {
  test('добавляет ингредиент с уникальным id', () => {
    //мок на dispatch
    const dispatch = jest.fn();
    const ingredient: TIngredient = {
      _id: '123',
      name: 'Тестовый ингредиент',
      type: 'main',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 40,
      price: 50,
      image: 'img.png',
      image_large: 'img-mobile.png',
      image_mobile: 'img-large.png'
    };

    //вызываем thunk с тестовым ингредиентом
    const thunk = addIngredientWithId(ingredient);
    thunk(dispatch);

    //проверяем что dispatch вызвался 1 раз
    expect(dispatch).toHaveBeenCalledTimes(1);

    //проверяем, что в dispatch передается объект с id
    const dispatchedAction = dispatch.mock.calls[0][0];

    //проверяем, что type действия (dispatchedAction) соответствует
    expect(dispatchedAction.type).toBe('burgerConstructor/addIngredient');
    expect(dispatchedAction.payload).toMatchObject({
      ...ingredient
    });

    //проверяем, что id сгенерирован
    expect(dispatchedAction.payload.id).toBeDefined();
  });
});
