describe("Register testing", () => {
  it("shows weak password feedback", () => {
    cy.visit("/register");

    cy.get("input[placeholder='Name Surname']").type("Test User");
    cy.get("input[placeholder='you@example.com']").type("test@example.com");
    cy.get("input[placeholder='Create a strong password']").type("weak");
    cy.get("input[placeholder='Re-enter your password']").type("weak");

    cy.contains("Strength: Weak").should("be.visible");
    cy.contains("Add at least 8 characters").should("be.visible");
  });

  it("shows password strength and matching message", () => {
    cy.visit("/register");

    cy.get("input[placeholder='Create a strong password']").type("Password123!");
    cy.get("input[placeholder='Re-enter your password']").type("Password123!");

    cy.contains("Strength: Strong").should("be.visible");
    cy.contains("Passwords match").should("be.visible");
  });

  it("shows email verification message after successful registration", () => {
    cy.intercept("POST", "**/api/register", {
      statusCode: 200,
      body: {
        message: "Account created",
      },
    }).as("registerUser");

    cy.visit("/register");

    cy.get("input[placeholder='Name Surname']").type("Test User");
    cy.get("input[placeholder='you@example.com']").type("newuser@example.com");
    cy.get("input[placeholder='Create a strong password']").type("Password123!");
    cy.get("input[placeholder='Re-enter your password']").type("Password123!");

    cy.contains("button", "Create Account").click();

    cy.wait("@registerUser");

    cy.contains("Check your email").should("be.visible");
    cy.contains("newuser@example.com").should("be.visible");
  });

  it("resends verification email", () => {
    cy.intercept("POST", "**/api/register", {
      statusCode: 200,
      body: {
        message: "Account created",
      },
    }).as("registerUser");

    cy.intercept("POST", "**/api/email/resend", {
      statusCode: 200,
      body: {
        message: "Verification email resent",
      },
    }).as("resendEmail");

    cy.visit("/register");

    cy.get("input[placeholder='Name Surname']").type("Test User");
    cy.get("input[placeholder='you@example.com']").type("newuser@example.com");
    cy.get("input[placeholder='Create a strong password']").type("Password123!");
    cy.get("input[placeholder='Re-enter your password']").type("Password123!");

    cy.contains("button", "Create Account").click();

    cy.wait("@registerUser");

    cy.contains("Resend verification email").click();

    cy.wait("@resendEmail");
  });
});