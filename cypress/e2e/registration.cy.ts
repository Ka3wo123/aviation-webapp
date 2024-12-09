describe('Registration Flow', () => {
  const deleteUser = (email: string) => {
    cy.fixture('admin').then(admin => {
      cy.request({
        method: 'POST',
        url: `http://localhost:8083/login`,
        body: {
          username: admin.email,
          password: admin.password
        }
      }).then((response) => {
        const token = response.body.access_token;
  
        cy.request({
          method: 'DELETE',
          url: `http://localhost:8082/api/user/${email}`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: { email },
          failOnStatusCode: false,
        });
      });
    })
    
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000/auth');
  });
  
  it('successfully creates new user and display message that use can log in', () => {
    cy.fixture('user').then(user => {
      deleteUser(user.email);
      cy.getByData("name-register-input").type(user.name);
      cy.getByData("surname-register-input").type(user.surname);
      cy.getByData("email-register-input").type(user.email);
      cy.getByData("password-register-input").type(user.password);
      cy.getByData("phone-register-input").type(user.phoneNumber);
      cy.getByData("age-register-input").type(user.age.toString());

      cy.getByData("button-register-submit").click();

      cy.contains('User created - you can login');
    })
  });

  it('fails to register due to lack of one of required fields', () => {
    const requiredFields = [
      { field: "name-register-input", errorMessage: "Name is required" },
      { field: "surname-register-input", errorMessage: "Surname is required" },
      { field: "email-register-input", errorMessage: "Email is required" },
      { field: "password-register-input", errorMessage: "Password is required" }
    ];

    requiredFields.forEach(({ field, errorMessage }) => {
      it(`fails to register when ${field} is missing`, () => {
        cy.fixture('user').then(user => {
          if (field !== "name-register-input") cy.getByData("name-register-input").type(user.name);
          if (field !== "surname-register-input") cy.getByData("surname-register-input").type(user.surname);
          if (field !== "email-register-input") cy.getByData("email-register-input").type(user.email);
          if (field !== "password-register-input") cy.getByData("password-register-input").type(user.password);
  
          cy.getByData("button-register-submit").click();
  
          cy.contains(errorMessage);
        })
      });
    });
  });

  it('fails to register due to duplicate email', () => {
    cy.fixture('user').then(user => {
      cy.getByData("name-register-input").type(user.name);
      cy.getByData("surname-register-input").type(user.surname);
      cy.getByData("email-register-input").type(user.email);
      cy.getByData("password-register-input").type(user.password);
      cy.getByData("phone-register-input").type(user.phoneNumber);
      cy.getByData("age-register-input").type(user.age.toString());
  
      cy.getByData("button-register-submit").click();
  
      cy.contains('Duplicate email violation').should('exist')

    })
  });
})