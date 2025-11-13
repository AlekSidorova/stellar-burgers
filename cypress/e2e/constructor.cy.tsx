/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  //выполняем ДО
  beforeEach(() => {
    //мок на ингредиенты
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    //открываем страницу приложения(словно пользователь заходит на сайт)
    cy.visit('http://localhost:4000');
    //ждем, чтобы проверка началась не раньше времени
    cy.wait('@getIngredients');
  });

  it('должен отображать список ингредиентов', () => {
    //ищем элементы, проверяем, что их 3
    cy.get('[data-cy="ingredient"]').should('have.length', 3);
    //ищем на странице текст-проверяем, что они отображаются в UI
    cy.get('[data-cy="ingredient"]').contains('Краторная булка N-200i');
    cy.get('[data-cy="ingredient"]').contains(
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy="ingredient"]').contains('Соус Spicy-X');
  });

  it('добавляет булку в конструктор', () => {
    //кликаем на булку
    cy.get('[data-cy="ingredient"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient"]') // поднимаемся к <li>
      .find('button') //ищем кнопку внутри этого <li>
      .click();
    //проверяем верхнюю и нижнюю булку
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  it('добавляет начинку в конструктор', () => {
    //кликаем на первую начинку
    cy.get('[data-cy="ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient"]')
      .find('button')
      .click();
    //проверяем, что начинка появилась
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 1);
    cy.get('[data-cy="constructor-ingredient"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });
});
