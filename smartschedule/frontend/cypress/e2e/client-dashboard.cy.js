describe("Client dashboard", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: [
        {
          id: 1,
          start_time: "2026-05-08 12:00:00",
          end_time: "2026-05-08 12:30:00",
          status: "SCHEDULED",
        },
      ],
    });

    cy.intercept("GET", "**/api/services", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Haircut",
          duration: 30,
          price: "25.00",
        },
        {
          id: 2,
          name: "Coloring",
          duration: 60,
          price: "60.00",
        },
      ],
    });

    cy.intercept("GET", "**/api/specialists", {
      statusCode: 200,
      body: [
        {
          id: 19,
          name: "test user",
        },
      ],
    });

    cy.visit("/dashboard", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
        win.localStorage.setItem(
          "user",
          JSON.stringify({
            id: 3,
            name: "Test Client",
            email: "user@test.lt",
            role: "CLIENT",
          })
        );
      },
    });
  });

  it("client can see booking form", () => {
    cy.contains("Client Dashboard").should("be.visible");
    cy.contains("Book Appointment").should("be.visible");
    cy.contains("Service").should("be.visible");
    cy.contains("Specialist").should("be.visible");
    cy.contains("Find Best Times").should("be.visible");
  });

  it("client can select service, specialist and date", () => {
    cy.contains("label", "Service").parent().find("select").select("Haircut");

    cy.contains("label", "Specialist")
      .parent()
      .find("select")
      .select("test user");

    cy.contains("label", "Date")
      .parent()
      .find("input[type='date']")
      .clear()
      .type("2026-05-15");

    cy.contains("label", "Service")
      .parent()
      .find("select")
      .should("not.have.value", "");

    cy.contains("label", "Specialist")
      .parent()
      .find("select")
      .should("not.have.value", "");

    cy.contains("label", "Date")
      .parent()
      .find("input[type='date']")
      .should("have.value", "2026-05-15");
  });
});