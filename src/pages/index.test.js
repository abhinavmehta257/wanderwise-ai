describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust the URL as needed
  });

  it('renders the Hero component with correct props', () => {
    cy.get('.py-[16px] > div').should('exist');
    cy.get('.py-[16px] > div').should('have.attr', 'description');
    cy.get('.py-[16px] > div').should('have.attr', 'destination');
    cy.get('.py-[16px] > div').should('have.attr', 'trip_duration');
  });

  it('renders the Itinerary component with correct props', () => {
    cy.get('div > Itinerary').should('exist');
    cy.get('div > Itinerary').should('have.attr', 'itinerary');
    cy.get('div > Itinerary').should('have.attr', 'start_date');
  });

  it('has the correct overall structure', () => {
    cy.get('div.px-[24px].bg-[white].h-full').should('exist');
    cy.get('div.px-[24px].bg-[white].h-full > div.py-[16px]').should('exist');
  });
});