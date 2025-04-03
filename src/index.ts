import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupPipeRunServer } from "./server/piperun-server.js";

async function main() {
  // Create an MCP server
  const server = new McpServer({
    name: "PipeRun MCP",
    version: "1.0.0"
  });

  // Set up PipeRun functionality
  await setupPipeRunServer(server);

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("PipeRun MCP server started");
}

main().catch((error) => {
  console.error("Error starting PipeRun MCP server:", error);
  process.exit(1);
});
