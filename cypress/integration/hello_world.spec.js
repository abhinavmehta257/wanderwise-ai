describe('Hello World Feature', () => {
    it('displays the correct message', () => {
        cy.visit('http://localhost:3000'); // Adjust the URL as needed
        cy.contains('Hello World');
    });
});