import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { isSurveyEnabled } from "@/lib/survey/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const surveyEnabled = await isSurveyEnabled();

  return (
    <>
      <Header surveyEnabled={surveyEnabled} />
      <main id="main-content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
