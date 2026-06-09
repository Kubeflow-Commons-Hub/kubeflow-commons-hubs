const EVENT_NAME = "Kubeflow Commons Hub Meetup";

const LINKEDIN_HASHTAGS = "#redhat #kubeflow #IBM #MLops";

export function buildLinkedInShareText() {
  return `Excited to share that I am attending the ${EVENT_NAME} in Pune.

Looking forward to learning how practitioners are building, deploying, and operating agentic AI and MLOps in production, and to meet everyone.

See you all there!

<---add attendee card image here--->

${LINKEDIN_HASHTAGS}`;
}

export function buildLinkedInFeedUrl(text: string) {
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
}
