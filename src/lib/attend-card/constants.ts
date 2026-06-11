export const ATTEND_CARD_PATH = "/attend-card";

export function buildLinkedInShareText() {
  return `Thrilled to be attending the Kubeflow Commons Hub Meetup in Pune!

Looking forward to connecting with practitioners who are building, deploying, and operating agentic AI and MLOps systems in production.
If you're attending too, let's connect!

#redhat #kubeflow #IBM #MLops #KubeflowCommons #AgenticAI #OpenSource #Kubernetes #CloudNative #Pune`;
}

export function buildLinkedInFeedUrl(text: string) {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
}
