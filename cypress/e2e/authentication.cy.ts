describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/auth');
  });

  it('logs in a user successfully and navigates to home', () => {
    cy.fixture('user').then(user => {
      cy.login(user.email, user.password);
      cy.contains('Login successful!').should('exist');
      cy.url().should('eq', 'http://localhost:3000/');
    })
    
  });

  it('shows an error for non-existent user', () => {
    cy.login('non-existent@email.com', "password")    
    cy.contains('Invalid credentials').should('exist');
  });
});
