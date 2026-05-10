describe("Specialist appointments", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: [
        {
          id: 1,
          start_time: "2026-05-08 12:00:00",
          end_time: "2026-05-08 12:30:00",
          status: "SCHEDULED",
          client: {
            name: "Test Client",
          },
        },
      ],
    }).as("getAppointments");

    cy.visit("/specialist/appointments", {
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

    cy.wait("@getAppointments");
  });

  it("shows specialist appointment with status buttons", () => {
    cy.contains("My Appointments").should("be.visible");
    cy.contains("Client Appointments").should("be.visible");
    cy.contains("2026-05-08").should("be.visible");
    cy.contains("12:00").should("be.visible");
    cy.contains("12:30").should("be.visible");
    cy.contains("Test Client").should("be.visible");
    cy.contains("SCHEDULED").should("be.visible");

    cy.contains("button", "Completed").should("be.visible");
    cy.contains("button", "Late").should("be.visible");
    cy.contains("button", "No-show").should("be.visible");
  });

  it("specialist can mark appointment as completed", () => {
    cy.intercept("PUT", "**/api/appointments/1/status", {
      statusCode: 200,
      body: {
        message: "Appointment updated successfully.",
      },
    }).as("markCompleted");

    cy.contains("button", "Completed").click();

    cy.wait("@markCompleted")
      .its("request.body")
      .should("deep.equal", {
        status: "COMPLETED",
      });

    cy.contains("Appointment marked as completed.").should("be.visible");
  });

  it("specialist can mark appointment as late", () => {
    cy.intercept("PUT", "**/api/appointments/1/status", {
      statusCode: 200,
      body: {
        message: "Appointment updated successfully.",
      },
    }).as("markLate");

    cy.contains("button", "Late").click();

    cy.wait("@markLate")
      .its("request.body")
      .should("deep.equal", {
        status: "LATE",
      });

    cy.contains("Appointment marked as late.").should("be.visible");
  });

  it("specialist can mark appointment as no-show", () => {
    cy.intercept("PUT", "**/api/appointments/1/status", {
      statusCode: 200,
      body: {
        message: "Appointment updated successfully.",
      },
    }).as("markNoShow");

    cy.contains("button", "No-show").click();

    cy.wait("@markNoShow")
      .its("request.body")
      .should("deep.equal", {
        status: "NO_SHOW",
      });

    cy.contains("Appointment marked as no-show.").should("be.visible");
  });
});