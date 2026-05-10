import { describe, test, expect, beforeEach } from "vitest";
import { getUser } from "../src/api/auth";

describe("getUser funkcija", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("grąžina naudotojo duomenis, jeigu naudotojas yra localStorage", () => {
    const user = {
      id: 1,
      name: "Test Specialist",
      email: "specialist@test.com",
      role: "specialist"
    };

    localStorage.setItem("user", JSON.stringify(user));

    const result = getUser();

    expect(result).toEqual(user);
    expect(result.id).toBe(1);
    expect(result.role).toBe("specialist");
  });

  test("grąžina null, jeigu naudotojas nėra prisijungęs", () => {
    const result = getUser();

    expect(result).toBeNull();
  });
});