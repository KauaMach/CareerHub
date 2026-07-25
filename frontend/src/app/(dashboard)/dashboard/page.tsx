"use client";

import { api } from "@/lib/api";

import Link from "next/link";
import { Briefcase, FileText, ArrowRight, BarChart3, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Metrics {
  summary: {
    companies: number;
    jobs: number;
    resumes: number;
    certificates: number;
  };
  pipeline: Record<string, number>;
}

export default function DashboardPage() {
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    }
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const res = await api.get("/dashboard/summary");
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    }
  });

  const { data: pipeline, isLoading: loadingPipeline } = useQuery({
    queryKey: ["dashboard", "pipeline"],
    queryFn: async () => {
      const res = await api.get("/dashboard/pipeline");
      if (!res.ok) throw new Error("Failed to fetch pipeline");
      return res.json();
    }
  });

  const loading = loadingUser || loadingSummary || loadingPipeline;
  const userName = user?.name ? user.name.split(" ")[0] : "Carregando...";
  const metrics = summary && pipeline ? { summary, pipeline } : null;

  // Cores do funil baseadas no status
  const statusConfig: Record<string, { label: string, color: string, w: string }> = {
    "BACKLOG": { label: "Na Fila", color: "bg-slate-500", w: "bg-slate-100 dark:bg-slate-900" },
    "APPLIED": { label: "Aplicado", color: "bg-blue-500", w: "bg-blue-100 dark:bg-blue-900" },
    "INTERVIEW": { label: "Entrevista", color: "bg-purple-500", w: "bg-purple-100 dark:bg-purple-900" },
    "OFFER": { label: "Proposta", color: "bg-green-500", w: "bg-green-100 dark:bg-green-900" },
    "REJECTED": { label: "Recusado", color: "bg-red-500", w: "bg-red-100 dark:bg-red-900" },
  };

  const statusOrder = ["BACKLOG", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
  const maxStatusCount = metrics && Object.keys(metrics.pipeline).length > 0
    ? Math.max(...Object.values(metrics.pipeline).concat(1))
    : 1;

  const totalInterviews = metrics?.pipeline["INTERVIEW"] || 0;
  const totalJobs = metrics?.summary.jobs || 0;
  const interviewRate = totalJobs > 0 ? Math.round(((totalInterviews + (metrics?.pipeline["OFFER"] || 0)) / totalJobs) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Olá, {userName}</h1>
        <p className="text-muted-foreground text-lg">
          Aqui está o resumo da sua evolução profissional.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Métricas Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-2">
              <div className="flex items-center text-muted-foreground gap-2">
                <Briefcase size={18} />
                <span className="font-medium text-sm">Total de Vagas</span>
              </div>
              <span className="text-3xl font-bold">{metrics?.summary.jobs || 0}</span>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-2">
              <div className="flex items-center text-muted-foreground gap-2">
                <TrendingUp size={18} />
                <span className="font-medium text-sm">Taxa de Conversão</span>
              </div>
              <span className="text-3xl font-bold">{interviewRate}%</span>
              <span className="text-xs text-muted-foreground">Chegaram a entrevista/oferta</span>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-2">
              <div className="flex items-center text-muted-foreground gap-2">
                <CheckCircle2 size={18} />
                <span className="font-medium text-sm">Entrevistas</span>
              </div>
              <span className="text-3xl font-bold">{totalInterviews}</span>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col gap-2">
              <div className="flex items-center text-muted-foreground gap-2">
                <Activity size={18} />
                <span className="font-medium text-sm">Empresas</span>
              </div>
              <span className="text-3xl font-bold">{metrics?.summary.companies || 0}</span>
              <span className="text-xs text-muted-foreground">Empresas mapeadas</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Funil de Vagas */}
            <div className="lg:col-span-2 bg-card border border-border p-8 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" /> Funil de Candidaturas
                </h2>
              </div>

              <div className="space-y-6">
                {statusOrder.map((status) => {
                  const count = metrics?.pipeline[status] || 0;
                  const percent = Math.round((count / maxStatusCount) * 100);
                  const config = statusConfig[status];

                  return (
                    <div key={status} className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span>{config?.label || status}</span>
                        <span className="text-muted-foreground">{count} vaga(s)</span>
                      </div>
                      <div className={`h-3 w-full rounded-full ${config?.w || 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${config?.color || 'bg-slate-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {metrics?.summary.jobs === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Você ainda não cadastrou nenhuma vaga. <br />
                    Comece a usar o Kanban para ver seu funil.
                  </div>
                )}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-col gap-4">
              <Link href="/jobs" className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quadro Kanban</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Gerencie suas aplicações arrastando vagas pelo funil.
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                  Acessar Vagas <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link href="/resumes" className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-2">IA Currículos</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Gere currículos otimizados por Inteligência Artificial.
                </p>
                <div className="flex items-center text-blue-500 font-medium text-sm group-hover:underline">
                  Acessar Currículos <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
