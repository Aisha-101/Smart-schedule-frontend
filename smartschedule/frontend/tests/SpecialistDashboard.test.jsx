import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SpecialistDashboard from "../src/pages/SpecialistDashboard";
import { MemoryRouter } from "react-router-dom";
import { fireEvent} from "@testing-library/react";

vi.mock("../src/api/auth", () => ({
  getUser: () => ({
    id: 1,
    name: "Test Specialist",
    email: "specialist@test.lt",
    role: "SPECIALIST"
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
              client_name: "Test Client",
              service_name: "Haircut",
              date: "2026-05-10",
              start_time: "10:00",
              end_time: "10:30"
            }
          ]
        });
      }

      if (url.includes("availability")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              specialist_id: 1,
              date: "2026-05-10",
              start_time: "09:00",
              end_time: "17:00"
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
        data: {
          message: "Sėkmingai išsaugota"
        }
      })
    ),

    delete: vi.fn(() =>
      Promise.resolve({
        data: {
          message: "Sėkmingai ištrinta"
        }
      })
    ),

    put: vi.fn(() =>
      Promise.resolve({
        data: {
          message: "Sėkmingai atnaujinta"
        }
      })
    )
  }
}));

describe("SpecialistDashboard komponentas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("atvaizduoja specialisto paslaugą Haircut", async () => {
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/haircut/i)).toBeInTheDocument();
    });
  });

  test("atvaizduoja specialisto paslaugą Coloring", async () => {
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/coloring/i)).toBeInTheDocument();
    });
  });

  test("atvaizduoja paslaugos kūrimo formos laukus", () => {
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/service name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/duration/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/add service/i)).toBeInTheDocument();
  });

  test("leidžia įvesti naujos paslaugos duomenis", () => {
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/service name/i);
    const durationInput = screen.getByPlaceholderText(/duration/i);
    const priceInput = screen.getByPlaceholderText(/price/i);

    fireEvent.change(nameInput, { target: { value: "Nails" } });
    fireEvent.change(durationInput, { target: { value: "45" } });
    fireEvent.change(priceInput, { target: { value: "30" } });

    expect(nameInput.value).toBe("Nails");
    expect(durationInput.value).toBe("45");
    expect(priceInput.value).toBe("30");
  });

  test("atvaizduoja pranešimą, kai nėra darbo laikų", async () => {
    render(
      <MemoryRouter>
        <SpecialistDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/no availability set/i)).toBeInTheDocument();
  });

});
