"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, DollarSign, Calendar, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company_id: string;
  status: string;
  location: string;
  salary_range: string;
  work_model: string;
  created_at: string;
}

const STATUSES = [
  { id: "BACKLOG", label: "Na Fila", color: "bg-slate-500", dot: "bg-slate-500", bg: "bg-slate-100 dark:bg-slate-900" },
  { id: "APPLIED", label: "Aplicado", color: "bg-blue-500", dot: "bg-blue-500", bg: "bg-blue-100 dark:bg-blue-900" },
  { id: "INTERVIEW", label: "Entrevista", color: "bg-purple-500", dot: "bg-purple-500", bg: "bg-purple-100 dark:bg-purple-900" },
  { id: "OFFER", label: "Proposta", color: "bg-green-500", dot: "bg-green-500", bg: "bg-green-100 dark:bg-green-900" },
  { id: "REJECTED", label: "Recusado", color: "bg-red-500", dot: "bg-red-500", bg: "bg-red-100 dark:bg-red-900" }
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8000/api/v1/jobs", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Agrupar vagas por status
  const jobsByStatus = STATUSES.reduce((acc, status) => {
    acc[status.id] = jobs.filter(job => job.status === status.id);
    return acc;
  }, {} as Record<string, Job[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vagas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas candidaturas através do funil.</p>
        </div>
        <Button className="shrink-0 rounded-full px-6 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Vaga
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-6 h-full min-w-max">
            {STATUSES.map(status => (
              <div key={status.id} className="w-[320px] flex flex-col flex-shrink-0">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
                    <h3 className="font-semibold text-sm text-foreground">{status.label}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {jobsByStatus[status.id].length}
                    </span>
                  </div>
                </div>
                
                <div className={`flex-1 rounded-xl p-3 ${status.bg} border border-border/50 shadow-inner flex flex-col gap-3 min-h-[150px]`}>
                  {jobsByStatus[status.id].map(job => (
                    <div 
                      key={job.id} 
                      className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground leading-tight line-clamp-2 pr-4">{job.title}</h4>
                        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                        <Building2 size={14} />
                        <span className="truncate">Empresa (Em breve)</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs mb-4">
                        {job.location && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <MapPin size={12} /> <span className="truncate max-w-[80px]">{job.location}</span>
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <DollarSign size={12} /> <span>{job.salary_range}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>Adicionado {formatDate(job.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {jobsByStatus[status.id].length === 0 && (
                    <div className="h-24 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-sm text-muted-foreground/60">
                      Vazio
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
