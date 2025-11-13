/// <reference types="cypress" />

describe('Оформление заказа', () => {
  beforeEach(() => {
    //мок на ингредиенты
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    //мок данных пользователя
    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test Sanya'
        }
      }
    }).as('getUser');

    //мок создания заказа
    cy.intercept('POST', 'api/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          name: 'Моковый бургер',
          order: {
            _id: '123',
            ingredients: [
              { _id: 'ing1', name: 'Булка', price: 100 },
              { _id: 'ing2', name: 'Котлета', price: 200 }
            ],
            number: 12345,
            name: 'Моковый бургер',
            status: 'done',
            price: 300,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            owner: { name: 'Test Sanya', email: 'test@example.com' }
          }
        }
      });
    }).as('createOrder');

    //подстановка токенов авторизации
    window.localStorage.setItem('accessToken', 'mockAccessToken');
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');

    //открываем страницу
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  it('собирает бургер, оформляет заказ, проверяет модалку и очищает конструктор', () => {
    //добавляем булку
    cy.get('[data-cy="ingredient"]')
      .contains('Краторная булка N-200i')
      .closest('[data-cy="ingredient"]')
      .find('button')
      .click();

    //добавляем начинку
    cy.get('[data-cy="ingredient"]')
      .contains('Биокотлета из марсианской Магнолии')
      .closest('[data-cy="ingredient"]')
      .find('button')
      .click();

    //нажимаем кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click();

    cy.wait('@createOrder');

    //проверяем модалку
    cy.get('#modals', { timeout: 15000 })
      .should('exist')
      .within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="order-number"]').should('contain.text', '12345');
        cy.contains('Ваш заказ начали готовить').should('be.visible');
      });

    //закрываем модалку по оверлею
    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    //проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');

    //проверяем, что конструктор пуст
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    cy.get('[data-cy="constructor-list"]').within(() => {
      cy.get('li').should('have.length', 0);
    });
  });
});
