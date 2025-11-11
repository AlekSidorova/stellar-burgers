/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  //выполняем ДО
  beforeEach(() => {
    //перехватываем сетевые запросы-возвращаем наш моковый файл ingredients.json
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    //открываем страницу приложения(словно пользователь заходит на сайт)
    cy.visit('http://localhost:4000');
    //ждем, чтобы проверка началась не раньше времени
    cy.wait('@getIngredients');
  });

  it('должен отображать список ингредиентов', () => {
    //ищем элементы по селектору, проверяем, что их 3
    cy.get('[data-cy="ingredient"]').should('have.length', 3);
    //ищем на странице текст-проверяем, что они отображаются в UI
    cy.get('[data-cy="ingredient"]').contains('Краторная булка N-200i');
    cy.get('[data-cy="ingredient"]').contains(
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy="ingredient"]').contains('Соус Spicy-X');
  });
});
