import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../src/pages/AdminDashboard";

vi.mock("../src/api/auth", () => ({
  getUser: () => ({
    id: 4,
    name: "admin",
    email: "admin@test.lt",
    role: "ADMIN"
  })
}));

vi.mock("../src/api/api", () => ({
  default: {
    get: vi.fn((url) => {
      if (url.includes("statistics")) {
        return Promise.resolve({
          data: {
            summary: {
              total_appointments: 7,
              scheduled: 1,
              completed: 1,
              canceled: 4,
              canceled_percentage: 57,
              no_shows: 0,
              no_show_percentage: 0,
              late: 0,
              late_percentage: 0,
              average_delay_minutes: 0,
              services_count: 4,
              clients_count: 10,
              specialists_count: 2
            },
            specialist_load: [
              {
                id: 1,
                name: "specialist3",
                email: "specialist3@test.lt",
                appointment_count: 3
              }
            ],
            busy_hours: [
              {
                hour: 10,
                count: 2
              },
              {
                hour: 12,
                count: 1
              }
            ]
          }
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
              specialist: {
                name: "specialist3"
              }
            },
            {
              id: 3,
              name: "Massage",
              duration: 45,
              price: "50.00",
              specialist: {
                name: "test user"
              }
            }
          ]
        });
      }

      if (url.includes("appointments")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              start_time: "2026-05-08 12:00:00",
              end_time: "2026-05-08 12:30:00",
              status: "SCHEDULED",
              client: {
                name: "Test Client"
              },
              specialist: {
                name: "specialist3"
              }
            },
            {
              id: 2,
              start_time: "2026-05-08 10:10:00",
              end_time: "2026-05-08 10:40:00",
              status: "CANCELED",
              client: {
                name: "user"
              },
              specialist: {
                name: "test user"
              }
            }
          ]
        });
      }

      return Promise.resolve({ data: [] });
    }),

    put: vi.fn(() =>
      Promise.resolve({
        data: { message: "Service updated successfully." }
      })
    ),

    delete: vi.fn(() =>
      Promise.resolve({
        data: { message: "Service deleted successfully." }
      })
    )
  }
}));

describe("AdminDashboard komponentas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("atvaizduoja administratoriaus puslapį", async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test("atvaizduoja sistemos statistiką", async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/total appointments/i)).toBeInTheDocument();
    expect(await screen.findByText("7")).toBeInTheDocument();
  });

  test("atvaizduoja paslaugą Massage", async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/massage/i)).toBeInTheDocument();
    });
  });

  test("atvaizduoja vizitą su būsena SCHEDULED", async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/scheduled/i)).toBeInTheDocument();
    });
  });
});