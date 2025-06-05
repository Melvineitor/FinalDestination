describe('Prueba de Login y Dashboard', () => {
    it('Debería loguearse correctamente y mostrar el dashboard', () => {
      // Ir al login
      cy.visit('https://frontend-production-c40b.up.railway.app');
  
      // Escribir credenciales
      cy.get('#username').type('Melvineitor');
      cy.get('#password').type('121720070725');
  
      // Hacer submit
      cy.get('button[type="submit"]').click();
  
      // Verificar redirección al dashboard
      cy.url().should('include', '/dashboard');
  
      // Validar que aparece algo del dashboard
      cy.contains('Total de Clientes').should('exist'); // o cualquier texto o elemento
      // Alternativamente:
      // cy.get('.nombre-usuario').should('contain.text', 'admin');
    });
  });
  