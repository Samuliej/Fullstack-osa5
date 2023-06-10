describe('Blog app', function() {
  const user = {
    name: 'test user',
    username: 'testuser',
    password: 'password'
  }


  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })


  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('test user logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('eionnaa')
      cy.get('#login-button').click()

      cy.should('not.contain', 'test user logged in')
      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'background-color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'password' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('www.thisisadrill.com')
      cy.get('#create-button').click()

      cy.contains('a blog created by cypress')
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'first blog', author: 'cypress1', url: 'www.cyptest.com', user: user })
        cy.createBlog({ title: 'second blog', author: 'cypress2', url: 'www.cyptest2.com', user: user })
        cy.createBlog({ title: 'third blog', author: 'cypress3', url: 'www.cyptest3.com', user: user })
      })

      it('one of the blogs exist', function() {
        cy.contains('second blog')
        cy.contains('cypress2')
      })


      // The implementation for these two tests are done acknowledging, that if
      // there would be multiple blogs with all their information out,
      // the buttons would not likely be the correct ones
      it('a blog can be liked', function() {
        cy.contains('first blog').parent().find('button').click()
        cy.contains('www.cyptest.com')
        cy.contains('0')
        cy.contains('like').click()
        cy.contains('1')
      })

      it('a blog can be removed by the signed in user', function() {
        cy.contains('second blog').parent().find('button').click()
        cy.contains('remove').click()
        cy.contains('Blog second blog by cypress2 removed successfully.')
        cy.visit('')
        cy.get('html').should('not.contain', 'second blog')
      })
    })
  })

})