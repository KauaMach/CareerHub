"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, DollarSign, Calendar, Clock, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  company_id: string | null;
  status: string;
  location: string;
  salary_range: string;
  work_model: string;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
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
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchJobsAndCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { "Authorization": `Bearer ${token}` };

      const [jobsRes, companiesRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/jobs", { headers }),
        fetch("http://localhost:8000/api/v1/companies", { headers })
      ]);

      if (jobsRes.ok) {
        setJobs(await jobsRes.json());
      }
      if (companiesRes.ok) {
        setCompanies(await companiesRes.json());
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCompanies();
  }, []);

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Construct payload matching JobCreate schema
    const payload: Record<string, any> = {
      title: formData.get("title"),
      status: formData.get("status") || "BACKLOG",
    };
    
    const company_id = formData.get("company_id");
    if (company_id && company_id !== "none") payload.company_id = company_id;
    
    const location = formData.get("location");
    if (location) payload.location = location;
    
    const work_model = formData.get("work_model");
    if (work_model && work_model !== "none") payload.work_model = work_model;
    
    const source = formData.get("source");
    if (source) payload.source = source;
    
    const seniority = formData.get("seniority");
    if (seniority && seniority !== "none") payload.seniority = seniority;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/jobs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail?.[0]?.message || "Erro ao criar vaga");
      }

      setIsModalOpen(false);
      fetchJobsAndCompanies(); // Refresh lists
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agrupar vagas por status
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
        <Button onClick={() => setIsModalOpen(true)} className="shrink-0 rounded-full px-6 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Vaga
        </Button>
      </div>

      {/* Kanban Board */}
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
                        <span className="truncate">{getCompanyName(job.company_id)}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs mb-4">
                        {job.location && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <MapPin size={12} /> <span className="truncate max-w-[80px]">{job.location}</span>
                          </div>
                        )}
                        {job.work_model && (
                          <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                            <Clock size={12} /> <span className="truncate capitalize">{job.work_model}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
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

      {/* Modal Nova Vaga */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Vaga</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateJob}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Título da Vaga *</Label>
                <Input id="title" name="title" placeholder="Ex: Desenvolvedor Frontend Sênior" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Empresa</Label>
                <Select name="company_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma (Adicionar depois)</SelectItem>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Inicial</Label>
                <Select name="status" defaultValue="BACKLOG">
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" name="location" placeholder="Ex: São Paulo, SP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work_model">Modelo</Label>
                  <Select name="work_model">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Origem (Opcional)</Label>
                  <Input id="source" name="source" placeholder="Ex: LinkedIn, Gupy, Indicação" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seniority">Senioridade</Label>
                  <Select name="seniority">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="Estágio">Estágio</SelectItem>
                      <SelectItem value="Júnior">Júnior</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Sênior">Sênior</SelectItem>
                      <SelectItem value="Especialista">Especialista / Tech Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Vaga
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
