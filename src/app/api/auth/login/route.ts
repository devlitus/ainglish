import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { sanitizeEmail } from '@/lib/validations'
import { 
  RateLimiter, 
  RATE_LIMIT_CONFIG, 
  VALIDATION_CONFIG, 
  addSecurityHeaders, 
  validateRequestSize,
  logSecurityEvent 
} from '@/lib/security'


const loginRateLimiter = new RateLimiter(
  RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
  RATE_LIMIT_CONFIG.LOGIN.WINDOW_TIME,
  RATE_LIMIT_CONFIG.LOGIN.LOCKOUT_TIME
);

setInterval(() => {
  loginRateLimiter.cleanup();
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  let response: NextResponse;

  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const contentLength = request.headers.get("content-length");

    if (!validateRequestSize(contentLength)) {
      logSecurityEvent({
        type: "SUSPICIOUS_INPUT",
        ip,
        userAgent,
        details: {
          input: `Content-Length: ${contentLength}`,
          patterns: "request_too_large",
          field: "content-length",
        },
      });

      response = NextResponse.json(
        { error: "Request demasiado grande" },
        { status: 413 }
      );
      return addSecurityHeaders(response);
    }

    const rateLimit = loginRateLimiter.isAllowed(ip);
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.remainingTime || 0) / 60000);

      logSecurityEvent({
        type: "RATE_LIMIT",
        ip,
        userAgent,
        details: {
          attempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
          maxAttempts: RATE_LIMIT_CONFIG.LOGIN.MAX_ATTEMPTS,
          remainingTime: rateLimit.remainingTime,
          endpoint: "/api/auth/login",
        },
      });

      response = NextResponse.json(
        {
          error: `Demasiados intentos de inicio de sesi?n. Intenta de nuevo en ${minutes} minutos.`,
        },
        { status: 429 }
      );
      return addSecurityHeaders(response);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      response = NextResponse.json(
        { error: "Formato de datos invalido" },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const { email } = body;

    if (!email) {
      response = NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const sanitizedEmail = sanitizeEmail(email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      response = NextResponse.json(
        { error: "Formato de email inv?lido" },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    if (sanitizedEmail.length > VALIDATION_CONFIG.EMAIL_MAX_LENGTH) {
      response = NextResponse.json(
        { error: "Email demasiado largo" },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    const user = await loginUser(sanitizedEmail, { ip, userAgent });

    loginRateLimiter.reset(ip);

    response = NextResponse.json({ user });
    return addSecurityHeaders(response);
  } catch (error: unknown) {
    console.error("Login error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error al iniciar sesi?n";

    const publicError =
      errorMessage.includes("Usuario no encontrado") ||
      errorMessage.includes("Datos de entrada inv?lidos")
        ? errorMessage
        : "Error interno del servidor";

    const statusCode = errorMessage.includes("Usuario no encontrado")
      ? 401
      : errorMessage.includes("Datos de entrada inv?lidos")
      ? 400
      : 500;

    response = NextResponse.json(
      { error: publicError },
      { status: statusCode }
    );
    return addSecurityHeaders(response);
  }
}