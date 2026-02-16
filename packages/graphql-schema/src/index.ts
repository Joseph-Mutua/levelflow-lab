export const typeDefs = /* GraphQL */ `
  type Device {
    id: ID!
    name: String!
    organization: String!
    os: String!
    status: String!
    tags: [String!]!
    securityScore: Int!
    maintenanceMode: Boolean!
    connectionQuality: Int!
  }

  type Workflow {
    id: ID!
    name: String!
    version: String!
    owner: String!
    status: String!
  }

  type ExcludedDevice {
    id: ID!
    reason: String!
  }

  type SimulationPreview {
    workflowId: ID!
    matchedDevices: [ID!]!
    excludedDevices: [ExcludedDevice!]!
    riskLevel: String!
    estimatedDurationSeconds: Int!
  }

  type Query {
    devices(status: String, tag: String): [Device!]!
    workflows(status: String): [Workflow!]!
    simulationPreview(workflowId: ID!): SimulationPreview!
  }
`;

export const schemaVersion = "0.1.0";
