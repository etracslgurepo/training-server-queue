import path from "path";
import fs from "fs";

console.log("osiris-web-client: process.cwd()", process.cwd());

const connFilePath = path.join(process.cwd(), "connections.json");
const connJson = fs.readFileSync(connFilePath, "utf-8");
const connections = JSON.parse(connJson);

for (let key in connections) {
  const conn = connections[key];
  const appHost: string = conn["app.host"];
  const hostIpEnvRe = appHost.match(/\$\{(.*)\}/);
  if (hostIpEnvRe) {
    const hostIpAddr: string = hostIpEnvRe[1] || "";
    conn["app.host"] = appHost.replace(/\$\{.*\}/, process.env[hostIpAddr]!);
  }
}

console.log("\n\nCONNECTIONS==================");
console.log(connections);
console.log("\n\nCONNECTIONS==================");

export default connections;
