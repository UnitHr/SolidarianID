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

  it('should successfully accept a pending request', () => {
    cy.login(TEST_USER.email, TEST_USER.password).then(() => {
      cy.getCookie('user').then((cookie) => {
        const rawValue = decodeURIComponent(cookie.value);
        const userData =
          typeof rawValue === 'string' && rawValue.startsWith('j:')
            ? JSON.parse(rawValue.slice(2))
            : JSON.parse(rawValue);

        const token = userData.token;
        const communityName = 'Community Test';

        // Create a community request
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/v1/communities',
          body: {
            name: communityName,
            description: 'This is a test community created for Cypress tests.',
            cause: {
              title: 'Causa principal',
              description: 'Descripción de la causa principal',
              end: '2025-12-31T23:59:59.000Z',
              ods: [1, 2],
            },
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        cy.contains('Dashboard').click();
        cy.contains('Validation').click();

        cy.contains(communityName)
          .should('be.visible')
          .parent()
          .parent()
          .within(() => {
            // Select the checkbox
            cy.get('input[type="checkbox"]').check();
          });

        cy.contains('button', 'Validate').click();

        // Verify request removal and success notification
        cy.contains(communityName).should('not.exist');
      });
    });
  });
});
