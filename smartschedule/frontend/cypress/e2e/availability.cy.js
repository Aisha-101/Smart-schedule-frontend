describe("Specialist availability management", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/specialists/*/schedule", {
      statusCode: 200,
      body: [],
    });

    cy.intercept("GET", "**/api/my-services", {
      statusCode: 200,
      body: [],
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

  it("specialist can fill availability form", () => {
    cy.contains("Specialist Dashboard").should("be.visible");

    cy.get("input[type='date']").first().clear().type("2026-05-15");

    cy.contains("label", "Start Time").parent().find("select").select("09:00");
    cy.contains("label", "End Time").parent().find("select").select("17:00");

    cy.get("input[type='date']").first().should("have.value", "2026-05-15");
    cy.contains("label", "Start Time")
      .parent()
      .find("select")
      .should("have.value", "09:00");
    cy.contains("label", "End Time")
      .parent()
      .find("select")
      .should("have.value", "17:00");
  });
});