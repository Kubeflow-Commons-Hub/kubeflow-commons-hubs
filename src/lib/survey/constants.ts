export const STUDENT_OPTIONS = [
  { label: "1st Year Engineering", value: 1 },
  { label: "2nd Year Engineering", value: 2 },
  { label: "3rd Year Engineering", value: 3 },
  { label: "Final Year / Intern", value: 4 },
  { label: "Fresh Graduate", value: 5 },
] as const;

export function computeExperienceX(
  expType: string | null,
  studentYear: number | null,
  yearsOfExp: number
): number {
  if (expType === "student") return studentYear ?? 1;
  const clamped = Math.min(Math.max(yearsOfExp, 1), 15);
  return 6 + ((clamped - 1) / 14) * 3;
}

export const AWARENESS_QUESTIONS = [
  {
    id: "rag_llm",
    topic: "RAG, LLM & Agentic AI",
    description:
      "Retrieval-Augmented Generation, Large Language Models, Agentic AI frameworks",
  },
  {
    id: "k8s_openshift",
    topic: "Kubernetes & OpenShift",
    description: "Container orchestration, K8s clusters, OpenShift platform",
  },
  {
    id: "python_go",
    topic: "Python & Go",
    description:
      "Python and Go programming languages for backend / DevOps",
  },
  {
    id: "mlops_tools",
    topic: "Kubeflow, Feast & MLflow",
    description: "ML pipelines, feature stores, experiment tracking",
  },
  {
    id: "ml_frameworks",
    topic: "ML Frameworks (TensorFlow / PyTorch)",
    description:
      "Deep learning frameworks for model training and deployment",
  },
  {
    id: "cicd",
    topic: "CI/CD (Jenkins, GitHub Actions)",
    description:
      "Continuous Integration & Continuous Deployment pipelines",
  },
  {
    id: "cloud",
    topic: "Cloud (AWS / Azure)",
    description: "Cloud platforms, services, and infrastructure",
  },
  {
    id: "data_engineering",
    topic: "Data Engineering (Hadoop, Feast, Feature Engineering)",
    description: "Big data processing, feature stores, data pipelines",
  },
  {
    id: "any_prog_lang",
    topic: "Any Programming Language",
    description:
      "Proficiency in at least one general-purpose programming language",
  },
] as const;

export const QUADRANT_CENTER_X = 5;
export const QUADRANT_CENTER_Y = 4.5;
