it("does not allow login with wrong credentials", () => {
  cy.intercept("POST", "**/api/login", {
    statusCode: 401,
    body: {
      message: "Invalid credentials",
    },
  }).as("loginFail");

  cy.visit("/login");

  cy.get("input[placeholder='Enter your email']").type("wrong@test.com");
  cy.get("input[placeholder='Enter your password']").type("wrongpassword");

  cy.contains("Sign In").click();

  cy.wait("@loginFail").its("response.statusCode").should("eq", 401);

  cy.url().should("include", "/login");
});