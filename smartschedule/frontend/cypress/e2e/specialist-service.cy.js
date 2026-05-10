describe("Specialist service management", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/specialists/*/schedule", {
      statusCode: 200,
      body: [],
    });

    cy.intercept("GET", "**/api/my-services", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Haircut",
          duration: 30,
          price: "25.00",
        },
      ],
    });

    cy.visit("/specialist", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 19,
            name: "test user",
            email: "cekimi3432@inraud.com",
            role: "SPECIALIST",
          })
        );
      },
    });
  });

  it("shows specialist dashboard and existing service", () => {
    cy.contains("Specialist Dashboard").should("be.visible");
    cy.contains("Haircut").should("be.visible");
  });

  it("specialist can fill service creation form", () => {
    cy.get("input[placeholder='Service Name']").type("Test Service Cypress");
    cy.get("input[placeholder='Duration (minutes)']").type("30");
    cy.get("input[placeholder='Price (€)']").type("25");

    cy.get("input[placeholder='Service Name']").should(
      "have.value",
      "Test Service Cypress"
    );
    cy.get("input[placeholder='Duration (minutes)']").should("have.value", "30");
    cy.get("input[placeholder='Price (€)']").should("have.value", "25");
  });
});