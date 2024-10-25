/// <reference types="vite/client" />

interface Nodes {
  manage: string[];
  center: string[];
  user: string[];
}

interface Data {
  nodes: Nodes;
  links: string[];
}

interface TopologyData {
  manage: string[];
  center: string[];
  user: string[];
  links: string[];
}

