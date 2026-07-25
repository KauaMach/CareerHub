"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, DollarSign, Calendar, Clock, MoreVertical, Loader2, FileText, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  company_id: string | null;
  resume_id: string | null;
  status: string;
  location: string | null;
  work_model: string | null;
  source: string | null;
  seniority: string | null;
  url: string | null;
  description: string | null;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  rejection_reason: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
}

interface Resume {
  id: string;
  title: string;
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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const headers = { "Authorization": `Bearer ${token}` };

      const [jobsRes, companiesRes, resumesRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/jobs", { headers }),
        fetch("http://localhost:8000/api/v1/companies", { headers }),
        fetch("http://localhost:8000/api/v1/resumes", { headers })
      ]);

      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (companiesRes.ok) setCompanies(await companiesRes.json());
      if (resumesRes.ok) setResumes(await resumesRes.json());
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const jobsByStatus = STATUSES.reduce((acc, status) => {
    acc[status.id] = jobs.filter(job => job.status === status.id);
    return acc;
  }, {} as Record<string, Job[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return "Sem empresa associada";
    const comp = companies.find(c => c.id === companyId);
    return comp ? comp.name : "Empresa Desconhecida";
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vagas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas candidaturas através do funil.</p>
        </div>
        <Link href="/jobs/new" className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Nova Vaga
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
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
                    <Link 
                      key={job.id} 
                      href={`/jobs/${job.id}`}
                      className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group cursor-pointer block"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground leading-tight line-clamp-2 pr-4 group-hover:text-primary transition-colors">{job.title}</h4>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                        <Building2 size={14} />
                        <span className="truncate">{getCompanyName(job.company_id)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs mb-4">
                        {job.work_model && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <MapPin size={12} /> <span className="truncate capitalize">{job.work_model}</span>
                          </div>
                        )}
                        {job.seniority && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <Clock size={12} /> <span className="truncate capitalize">{job.seniority}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>Adicionado {formatDate(job.created_at)}</span>
                        </div>
                        {job.resume_id && (
                          <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            <FileText size={12} /> CV Vinculado
                          </div>
                        )}
                      </div>
                    </Link>
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
