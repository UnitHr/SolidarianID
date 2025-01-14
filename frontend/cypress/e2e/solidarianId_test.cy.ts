describe('SolidarianId', () => {
  beforeEach(() => {
    cy.visit('/');
    // Reset application state before each test
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // Constants to avoid repetition and make maintenance easier
  const TEST_USER = {
    email: 'admin@admin.com',
    password: '123456Test*',
  };

  describe('Authentication', () => {
    it('should display the welcome message on the front page', () => {
      cy.contains('h1', 'Welcome to SolidarianID').should('be.visible');
    });

    it('should successfully login with valid credentials', () => {
      cy.contains('Login').click();
      cy.get('label')
        .contains('Email')
        .parent()
        .find('input')
        .type(TEST_USER.email);
      cy.get('label')
        .contains('Password')
        .parent()
        .find('input')
        .type(TEST_USER.password);
      cy.get('form').within(() => {
        cy.contains('Login').click();
      });

      // Verify successful login
      cy.contains('Logout').should('be.visible');
      cy.getCookie('user').should('exist');
    });
  });

  it('should successfully view community report', () => {
    cy.login(TEST_USER.email, TEST_USER.password);

    // Navigate to reports
    cy.contains('Dashboard').click();
    cy.contains('Reports').click();

    // Select a community from the dropdown
    cy.contains('Select Community').click();
    // Verify that the dropdown is visible
    cy.get('#community-select').should('be.visible');

    // Select the first element (excluding the placeholder) by index
    cy.get('#community-select')
      .find('option')
      .eq(1)
      .then((option) => {
        const value = option.val();
        cy.get('#community-select').select(value);
      });

    // View and verify report
    cy.contains('button', 'View Report').click();
    cy.contains('Community Details').should('be.visible');
    cy.contains('Name').should('be.visible');
    cy.contains('Members').should('be.visible');
  });
});
