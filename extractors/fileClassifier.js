export function classifyFile(filePath) {
  const lowerPath = filePath.toLowerCase();

  if (lowerPath.includes("/controllers/")) return "controller";
  if (lowerPath.includes("/models/")) return "model";
  if (lowerPath.includes("/routes/")) return "route";
  if (lowerPath.includes("/services/")) return "service";
  if (lowerPath.includes("/utils/")) return "utils";
  if (lowerPath.includes("/middlewares/")) return "middleware";
  if (lowerPath.includes("/errors/")) return "error";
  if (lowerPath.includes("/config/")) return "config";
  if (lowerPath.includes("/db/")) return "database";

  if (lowerPath.endsWith("app.js") || lowerPath.endsWith("server.js")) {
    return "entry";
  }

  return "other";
}
