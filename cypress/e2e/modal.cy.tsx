/// <reference types="cypress" />

describe('Модальные окна ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открыть модалку и проверить данные', () => {
    cy.get('[data-cy="ingredient"]').first().click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="ingredient-details"]').should('exist');

    //проверяем изображение
    cy.get('[data-cy="ingredient-details"] img')
      .should('have.attr', 'src')
      .and('not.be.empty');

    //проверяем название
    cy.get('[data-cy="ingredient-details"] h3')
      .invoke('text')
      .should('not.be.empty');

    //проверяем калории и питательные вещества
    cy.get('[data-cy="ingredient-details"]').within(() => {
      cy.contains('Калории, ккал').next().should('not.be.empty');
      cy.contains('Белки, г').next().should('not.be.empty');
      cy.contains('Жиры, г').next().should('not.be.empty');
      cy.contains('Углеводы, г').next().should('not.be.empty');
    });
  });

  it('закрыть модалку по крестику', () => {
    //открываем модалку
    cy.get('[data-cy="ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');

    //кликаем по кнопке закрытия
    cy.get('[data-cy="modal-close-button"]').click();
    //проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрыть модалку по оверлею', () => {
    //открываем модалку
    cy.get('[data-cy="ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');

    //кликаем по оверлею
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    //проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрыть модалку клавишей Esc', () => {
    //выбираем первый ингредиент и кликаем
    cy.get('[data-cy="ingredient"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    //имитируем нажатие клавиши Escape
    cy.get('body').type('{esc}');

    //проверяем, что модалка закрылась
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});
