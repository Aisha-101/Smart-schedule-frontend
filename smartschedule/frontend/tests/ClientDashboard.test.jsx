import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ClientDashboard from "../src/pages/ClientDashboard";

vi.mock("@fullcalendar/react", () => ({
  default: () => <div>Calendar Mock</div>
}));

vi.mock("@fullcalendar/daygrid", () => ({
  default: {}
}));

vi.mock("@fullcalendar/timegrid", () => ({
  default: {}
}));

vi.mock("@fullcalendar/interaction", () => ({
  default: {}
}));

vi.mock("../src/api/auth", () => ({
  getUser: () => ({
    id: 3,
    name: "Test Client",
    email: "user@test.lt",
    role: "CLIENT"
  })
}));

vi.mock("../src/api/api", () => ({
  default: {
    get: vi.fn((url) => {
      if (url.includes("appointments")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              appointment_time: "2026-05-08 12:00:00",
              status: "SCHEDULED",
              service_name: "Haircut",
              specialist_name: "Specialist"
            },
            {
              id: 2,
              appointment_time: "2026-05-08 10:10:00",
              status: "CANCELED",
              service_name: "Coloring",
              specialist_name: "Specialist"
            }
          ]
        });
      }

      if (url.includes("services")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              name: "Haircut",
              duration: 30,
              price: "25.00",
              specialist_id: 1
            },
            {
              id: 2,
              name: "Coloring",
              duration: 60,
              price: "60.00",
              specialist_id: 1
            }
          ]
        });
      }

      return Promise.resolve({ data: [] });
    }),

    post: vi.fn(() =>
      Promise.resolve({
        data: { message: "Sėkmingai rezervuota" }
      })
    ),

    put: vi.fn(() =>
      Promise.resolve({
        data: { message: "Sėkmingai atnaujinta" }
      })
    ),

    delete: vi.fn(() =>
      Promise.resolve({
        data: { message: "Sėkmingai ištrinta" }
      })
    )
  }
}));

describe("ClientDashboard komponentas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("atvaizduoja kliento puslapį", async () => {
    render(
      <MemoryRouter>
        <ClientDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/client/i)).toBeInTheDocument();
    });
  });

  test("atvaizduoja kalendoriaus bloką", async () => {
    render(
        <MemoryRouter>
        <ClientDashboard />
        </MemoryRouter>
    );

    expect(await screen.findByText(/calendar view/i)).toBeInTheDocument();
    expect(await screen.findByText(/calendar mock/i)).toBeInTheDocument();
    });
  test("atvaizduoja paslaugą Haircut", async () => {
    render(
      <MemoryRouter>
        <ClientDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/haircut/i)).toBeInTheDocument();
    });
  });
});