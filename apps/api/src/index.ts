import { devices, workflows } from "@levelflow/mock-data";
import { previewBlastRadius } from "@levelflow/workflow-engine";
import { typeDefs } from "@levelflow/graphql-schema";

export const apiStatus = "mock-ready";

export const graphqlSchema = typeDefs;

export const resolvers = {
  Query: {
    devices: (_: unknown, args: { status?: string; tag?: string }) =>
      devices.filter((device) => {
        const statusMatch = args.status ? device.status === args.status : true;
        const tagMatch = args.tag ? device.tags.includes(args.tag) : true;
        return statusMatch && tagMatch;
      }),
    workflows: (_: unknown, args: { status?: string }) =>
      workflows.filter((workflow) => (args.status ? workflow.status === args.status : true)),
    simulationPreview: (_: unknown, args: { workflowId: string }) => {
      const workflow = workflows.find((item) => item.id === args.workflowId) ?? workflows[0];
      return previewBlastRadius(workflow, devices);
    }
  }
};
