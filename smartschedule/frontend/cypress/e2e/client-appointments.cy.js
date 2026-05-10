describe("Client appointments", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/appointments/my", {
      statusCode: 200,
      body: [
        {
          id: 1,
          start_time: "2026-05-08 12:00:00",
          end_time: "2026-05-08 12:30:00",
          status: "SCHEDULED",
          specialist: {
            name: "test user",
          },
        },
      ],
    }).as("getAppointments");

    cy.visit("/my-appointments", {
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

    cy.wait("@getAppointments");
  });

  it("shows scheduled appointment with cancel and reschedule buttons", () => {
    cy.contains("My Appointments").should("be.visible");
    cy.contains("Appointment History").should("be.visible");
    cy.contains("2026-05-08").should("be.visible");
    cy.contains("12:00").should("be.visible");
    cy.contains("12:30").should("be.visible");
    cy.contains("test user").should("be.visible");
    cy.contains("SCHEDULED").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");
    cy.contains("button", "Reschedule").should("be.visible");
  });

  it("clicking cancel selects appointment for cancellation", () => {
    cy.contains("button", "Cancel").click();

    cy.contains("My Appointments").should("be.visible");
    cy.contains("SCHEDULED").should("be.visible");
  });

  it("reschedule button redirects to dashboard", () => {
    cy.contains("button", "Reschedule").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Client Dashboard").should("be.visible");
  });
});