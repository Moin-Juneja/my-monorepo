import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// --- Global fetch mock ---
global.fetch = jest.fn() as jest.Mock;

// Mock Users
const mockUsers = {
  success: true,
  data: [
    { id: 1, name: "John Doe", email: "john@example.com", password: "123" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", password: "456" },
  ],
};

describe("App Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for initial fetch
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ id: 1, name: "John", email: "john@test.com", password: "123" }],
      }),
    });
  });

  // -----------------------------
  // TEST 1: Loading Spinner
  // -----------------------------
  test("shows loading spinner while fetching users", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });

    render(<App />);

    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
  });

  // -----------------------------
  // TEST 2: Renders list correctly
  // -----------------------------
  test("renders user list after fetch", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });
  });

  // -----------------------------
  // TEST 3: Add User
  // -----------------------------
  test("Add User button adds a new blank row", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<App />);

    await waitFor(() => screen.getByText("John Doe"));

    const addBtn = screen.getByRole("button", { name: /Add User/i });
    fireEvent.click(addBtn);

    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  // -----------------------------
  // TEST 4: Edit → Save
  // -----------------------------
  test("Edit → Save updates a row", async () => {
    // 1st fetch → load initial users
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    // 2nd fetch → update API response for save
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 1,
          name: "John Updated",
          email: "john@new.com",
          password: "123",
        },
      }),
    });

    // 3rd fetch → refresh after save
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          { id: 1, name: "John Updated", email: "john@new.com", password: "123" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", password: "456" },
        ],
      }),
    });

    render(<App />);

    await waitFor(() => screen.getByText("John Doe"));

    fireEvent.click(screen.getAllByText("Edit")[0]);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "John Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText("John Updated")).toBeInTheDocument();
    });
  });
});

// Dummy test
test("dummy test", () => {
  expect(1 + 1).toBe(2);
});
