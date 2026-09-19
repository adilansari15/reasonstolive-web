import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

export function configureSecurity(app) {
  // Helmet HTTP security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled to allow Vite SPA dev/static assets to run smoothly
      crossOriginEmbedderPolicy: false,
    })
  );

  // Sanitize user inputs to prevent MongoDB Operator Injection ($gt, $ne, etc.)
  app.use(
    mongoSanitize({
      replaceWith: "_",
    })
  );
}
