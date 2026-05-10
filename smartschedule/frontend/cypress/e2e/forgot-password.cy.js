describe("Forgot password testing", () => {
  it("opens forgot password page from login", () => {
    cy.visit("/login");

    cy.contains("Forgot password?").click();

    cy.url().should("include", "/forgot-password");
  });

  it("sends forgot password request", () => {
    cy.intercept("POST", "**/api/forgot-password", {
      statusCode: 200,
      body: {
        message: "Password reset link sent",
      },
    }).as("forgotPassword");

    cy.visit("/forgot-password");

    cy.get("input[type='email']").type("user@test.lt");

    cy.contains(/send|reset|submit/i).click();

    cy.wait("@forgotPassword");
  });
});