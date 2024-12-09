describe('Assigning user to flight flow', () => {
    let email: string;
    let password: string;

    const deleteUsersFlight = (email: string) => {
        cy.fixture('user').then(user => {
            cy.request({
                method: 'POST',
                url: `http://localhost:8083/login`,
                body: {
                    username: user.email,
                    password: user.password
                }
            }).then((response) => {
                const token = response.body.access_token;

                cy.request({
                    method: 'GET',
                    url: `http://localhost:8082/api/user/${email}/flights`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(
                    response => {
                        cy.request({
                            method: 'DELETE',
                            url: `http://localhost:8082/api/user/${email}/flight/${response.body[0]?.id}`,
                            headers: {
                                Authorization: `Bearer ${token}`
                            }                            
                        });
                    }
                )
            });
        })
    };

    beforeEach(() => {
        cy.fixture('user').then(user => {
            email = user.email
            password = user.password
        });
    });

    function searchFlight() {
        cy.visit('http://localhost:3000/flight/search')
        cy.getByData('origin-airport-input').select("Balice (KRK)");
        cy.getByData('destination-airport-input').select("Darwin (DRW)");

        cy.get('.react-datepicker-wrapper').should('be.visible').click();

        let currentMonthYear;

        function checkMonth() {
            cy.get('.react-datepicker__current-month').should('be.visible').then(($monthYear) => {
                currentMonthYear = $monthYear.text().trim();
                if (currentMonthYear.includes('November 2025')) {
                    return;
                } else {
                    cy.get('.react-datepicker__navigation--next').click();
                    checkMonth();
                }
            });
        }

        checkMonth();

        cy.get('.react-datepicker__day').filter((_, element) => {
            return Cypress.$(element).text().trim() === '1';
        }).first().click();

        cy.getByData('submit-button').click();
    }

    it('should return flights based on user search and display error when want to assign unauthorized', () => {
        searchFlight();

        cy.getByData('assign-button').click();
        cy.url().should('eq', 'http://localhost:3000/auth');

        cy.login(email, password)

        cy.url().should('eq', 'http://localhost:3000/flight/search');

        searchFlight();
        cy.getByData('assign-button').click();

        cy.visit(`http://localhost:3000/user/flights/${email}`);
        cy.getByData('current-flight-list')
            .should('include.text', 'Balice')
            .and('include.text', 'Darwin')
            .and('include.text', '1.11.2025')
    });

    it('should display info that user is already assign to specified flight', () => {
        cy.login(email, password);
        searchFlight();
        cy.getByData('submit-button').click();
        cy.getByData('assign-button').click();
        cy.contains('User already assigned to this flight');
        deleteUsersFlight(email);
    })
});
