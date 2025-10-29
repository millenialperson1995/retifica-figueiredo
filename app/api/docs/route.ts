import { NextRequest } from 'next/server';
import specs from '../../../lib/swagger';

export async function GET(req: NextRequest) {
  // This route will redirect to the Swagger UI page
  // Since swagger-ui-express doesn't work directly with Next.js App Router,
  // we'll redirect to a static page that loads Swagger UI
  const swaggerUIHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Retífica Figueirêdo API</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api/docs/swagger-json',
              dom_id: '#swagger-ui',
            });
          };
        </script>
      </body>
    </html>
  `;
  
  return new Response(swaggerUIHTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}