import { devices, workflows } from "@levelflow/mock-data";
import { previewBlastRadius } from "@levelflow/workflow-engine";

export async function GET() {
  const workflow = workflows[0];

  return Response.json({
    generatedAt: new Date().toISOString(),
    preview: previewBlastRadius(workflow, devices)
  });
}
