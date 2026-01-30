import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler((server) => {
  // Tool 1 — Roll dice (déjà présent)
  server.tool(
    "roll_dice",
    "Rolls an N-sided die",
    { sides: z.number().int().min(2) },
    async ({ sides }) => {
      const value = 1 + Math.floor(Math.random() * sides);
      return {
        content: [{ type: "text", text: `🎲 You rolled a ${value}!` }],
      };
    },
  );

  // Tool 2 — Weather (déjà présent)
  server.tool(
    "get_weather",
    "Get the current weather at a location",
    {
      latitude: z.number(),
      longitude: z.number(),
      city: z.string(),
    },
    async ({ latitude, longitude, city }) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`,
      );
      const weatherData = await response.json();
      return {
        content: [
          {
            type: "text",
            text: `🌤️ Weather in ${city}: ${weatherData.current.temperature_2m}°C, Humidity: ${weatherData.current.relativehumidity_2m}%`,
          },
        ],
      };
    },
  );

  // Tool 3 — Landing page (CE QUE TU AJOUTES)
  server.tool(
    "generate_landing_page",
    "Génère le HTML d’une landing page simple",
    {
      title: z.string(),
    },
    async ({ title }) => {
      const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 32px; }
    .card { border: 1px solid #eee; border-radius: 16px; padding: 16px; background: #fafafa; }
    .btn { display: inline-block; padding: 12px 16px; border-radius: 12px; background: #111; color: #fff; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${title}</h1>
    <p>Cette landing page a été générée par un <strong>tool MCP</strong>.</p>
    <div class="card">
      <p>Le MCP est déployé sur Vercel et expose ce tool.</p>
      <a class="btn" href="/">Retour au site</a>
    </div>
  </div>
</body>
</html>`;

      return {
        content: [{ type: "text", text: html }],
      };
    },
  );
});

export { handler as GET, handler as POST, handler as DELETE };
