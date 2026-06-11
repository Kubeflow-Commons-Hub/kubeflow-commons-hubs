import { getSurveyConfig } from "@/lib/survey/actions";
import { redirect } from "next/navigation";
import { SurveyForm } from "./survey-form";

export const metadata = {
  title: "Survey | Kubeflow Commons Hub",
  description: "Share your background and interests with the Kubeflow community.",
};

export default async function SurveyPage() {
  const config = await getSurveyConfig();

  if (!config?.isEnabled) {
    redirect("/");
  }

  return (
    <SurveyForm
      customLinkUrl={config.customLinkUrl}
      customLinkLabel={config.customLinkLabel}
      showQrCode={config.showQrCode}
    />
  );
}
