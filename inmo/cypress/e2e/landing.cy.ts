describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/') // Visita la página principal
  })

  it('should load the landing page successfully', () => {
    cy.url().should('include', '/')
    cy.get('body').should('be.visible')
  })

  it('should display the main heading', () => {
    cy.get('h1').should('be.visible')
  })

  it('should have navigation links', () => {
    cy.get('nav').should('exist')
    cy.get('nav a').should('have.length.at.least', 1)
  })

  it('should allow navigation to login/register', () => {
    cy.get('nav').within(() => {
      cy.contains(/login|iniciar sesión/i).should('exist')
      cy.contains(/register|registrarse/i).should('exist')
    })
  })

  it('should display main content sections', () => {
    cy.get('main').should('exist')
    cy.get('main section').should('have.length.at.least', 1)
  })
}) 