import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RegisterForm from "@/components/forms/RegisterForm";

// Mock de hooks
const mockLogin = jest.fn();
const mockPush = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    login: mockLogin,
    logout: jest.fn(),
    isLoading: false,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock de fetch global
global.fetch = jest.fn();

describe("RegisterForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch exitoso por defecto
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, name: "Test User", email: "test@example.com" },
        }),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza el formulario correctamente", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /crear cuenta/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tu nombre completo")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
  });

  it("actualiza el estado de los campos cuando el usuario escribe", async () => {
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");

    expect(nameInput).toHaveValue("Juan Pérez");
    expect(emailInput).toHaveValue("juan@example.com");
  });

  it("envía el formulario correctamente con datos válidos", async () => {
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Juan Pérez",
          email: "juan@example.com",
        }),
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("muestra error cuando el servidor responde con error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "El email ya está registrado",
        }),
    });

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("El email ya está registrado")
      ).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("muestra estado de carga durante el submit", async () => {
    // Mock fetch que tarda en resolver
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    user: {
                      id: 1,
                      name: "Test User",
                      email: "test@example.com",
                    },
                  }),
              }),
            100
          )
        )
    );

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    // Verificar estado de carga
    expect(screen.getByText(/creando cuenta/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Esperar a que termine la carga
    await waitFor(() => {
      expect(screen.queryByText(/creando cuenta/i)).not.toBeInTheDocument();
    });
  });

  it("maneja errores de red correctamente", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Error de red"));

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Error de red")).toBeInTheDocument();
    });
  });

  it("requiere que ambos campos estén llenos", async () => {
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    // Intentar enviar solo con nombre
    await user.type(nameInput, "Juan Pérez");
    await user.click(submitButton);

    // HTML5 validation debería prevenir el envío
    expect(global.fetch).not.toHaveBeenCalled();

    // Limpiar y intentar solo con email
    await user.clear(nameInput);
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    // HTML5 validation debería prevenir el envío
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("valida el formato de email con HTML5", () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
  });

  it("valida que el nombre sea requerido", () => {
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);

    expect(nameInput).toHaveAttribute("type", "text");
    expect(nameInput).toHaveAttribute("required");
  });

  it("limpia el error cuando se corrige el problema", async () => {
    // Primero mostrar un error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () =>
        Promise.resolve({
          error: "El email ya está registrado",
        }),
    });

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /crear cuenta/i });

    await user.type(nameInput, "Juan Pérez");
    await user.type(emailInput, "juan@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("El email ya está registrado")
      ).toBeInTheDocument();
    });

    // Cambiar el email y enviar de nuevo con éxito
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          user: { id: 1, name: "Juan Pérez", email: "juan.nuevo@example.com" },
        }),
    });

    await user.clear(emailInput);
    await user.type(emailInput, "juan.nuevo@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText("El email ya está registrado")
      ).not.toBeInTheDocument();
    });
  });
});
