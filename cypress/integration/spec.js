describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('http://localhost:4000')
    cy.wait(1000)
    cy.window().then(({ pages }) => {
      expect([...pages]).to.deep.equal([1, 2, 3])
    })
    cy.get('#bottom').then($ => {
      $[0].scrollIntoView()
    })
    cy.wait(1000)
    cy.window().then(({ pages }) => {
      expect([...pages]).to.deep.equal([1, 2, 3, 4, 5, 6])
    })
  })
})
