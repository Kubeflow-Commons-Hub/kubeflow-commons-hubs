import { getAdminSurveyConfig, getSurveyGraphData, getSurveyStats, listSurveyResponses } from "@/lib/admin/survey";
import { SurveyConfigForm } from "./survey-config-form";
import { SurveyResponsesTable } from "./survey-responses-table";
import { AdminSurveyGraph } from "./admin-survey-graph";

export const metadata = {
  title: "Survey Management | Admin",
};

export default async function AdminSurveyPage() {
  const [config, stats, { rows, totalCount }, graphData] = await Promise.all([
    getAdminSurveyConfig(),
    getSurveyStats(),
    listSurveyResponses(),
    getSurveyGraphData(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Survey Management
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Configure the community survey and view responses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <p className="text-sm font-medium text-text-muted">Status</p>
          <div className="mt-1 flex items-center gap-2">
            <div
              className={`size-2.5 rounded-full ${config?.isEnabled ? "bg-emerald-500" : "bg-text-muted/40"}`}
            />
            <span className="text-lg font-bold text-text-primary">
              {config?.isEnabled ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <p className="text-sm font-medium text-text-muted">Total Responses</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {stats.totalResponses}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <p className="text-sm font-medium text-text-muted">Public Graph</p>
          <div className="mt-1 flex items-center gap-2">
            <div
              className={`size-2.5 rounded-full ${config?.showGraph ? "bg-emerald-500" : "bg-text-muted/40"}`}
            />
            <span className="text-lg font-bold text-text-primary">
              {config?.showGraph ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      {/* Config form */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Configuration
        </h2>
        <SurveyConfigForm
          initialValues={
            config
              ? {
                  isEnabled: config.isEnabled,
                  customLinkUrl: config.customLinkUrl ?? "",
                  customLinkLabel: config.customLinkLabel ?? "",
                  showQrCode: config.showQrCode,
                  showGraph: config.showGraph,
                }
              : undefined
          }
        />
      </div>

      {/* Graph */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <AdminSurveyGraph initialData={graphData} />
      </div>

      {/* Responses */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Responses ({totalCount})
        </h2>
        <SurveyResponsesTable rows={rows} />
      </div>
    </div>
  );
}
