import type { IncomingMessage, ServerResponse } from "node:http";

import type { Plugin, ViteDevServer } from "vite";

import type { ServerEnvironment } from "./config.ts";

const API_PATH = "/api/shuiling/chat";

async function toWebRequest(request: IncomingMessage, signal: AbortSignal) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
    else if (value !== undefined) headers.set(name, value);
  }

  const body: Buffer[] = [];
  for await (const chunk of request) {
    body.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const host = request.headers.host ?? "127.0.0.1";
  const method = request.method ?? "GET";
  return new Request(`http://${host}${request.url ?? API_PATH}`, {
    method,
    headers,
    signal,
    ...(method === "GET" || method === "HEAD" ? {} : { body: Buffer.concat(body) }),
  });
}

async function sendWebResponse(response: Response, serverResponse: ServerResponse) {
  serverResponse.statusCode = response.status;
  response.headers.forEach((value, name) => serverResponse.setHeader(name, value));
  serverResponse.end(Buffer.from(await response.arrayBuffer()));
}

function installMiddleware(server: ViteDevServer, environment: ServerEnvironment) {
  server.middlewares.use(async (request, response, next) => {
    if (request.url?.split("?", 1)[0] !== API_PATH) {
      next();
      return;
    }

    const controller = new AbortController();
    const abortProviderRequest = () => controller.abort();
    request.once("aborted", abortProviderRequest);
    response.once("close", () => {
      if (!response.writableEnded) abortProviderRequest();
    });

    try {
      const module = (await server.ssrLoadModule("/server/shuiling/handler.ts")) as {
        handleShuiLingChat: (
          request: Request,
          options: { environment: ServerEnvironment },
        ) => Promise<Response>;
      };
      await sendWebResponse(
        await module.handleShuiLingChat(await toWebRequest(request, controller.signal), { environment }),
        response,
      );
    } catch {
      await sendWebResponse(
        new Response(
          JSON.stringify({
            error: {
              code: "DEEPSEEK_UPSTREAM_ERROR",
              message: "The local Shuiling API adapter failed.",
            },
          }),
          { status: 500, headers: { "Content-Type": "application/json; charset=utf-8" } },
        ),
        response,
      );
    } finally {
      request.removeListener("aborted", abortProviderRequest);
    }
  });
}

export function shuiLingApiPlugin(environment: ServerEnvironment): Plugin {
  return {
    name: "shuiling-deepseek-api",
    apply: "serve",
    configureServer(server) {
      installMiddleware(server, environment);
    },
  };
}
