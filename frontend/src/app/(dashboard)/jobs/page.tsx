"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, DollarSign, Calendar, Clock, MoreVertical, Loader2, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";

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
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Details Sheet
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error((await res.json()).detail?.[0]?.message || "Erro ao criar vaga");

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    
    const payload: Record<string, any> = {
      title: formData.get("title"),
      status: formData.get("status"),
      description: formData.get("description") || null,
      url: formData.get("url") || null,
      salary_min: formData.get("salary_min") ? parseFloat(formData.get("salary_min") as string) : null,
      salary_max: formData.get("salary_max") ? parseFloat(formData.get("salary_max") as string) : null,
      rejection_reason: formData.get("rejection_reason") || null,
    };

    const company_id = formData.get("company_id");
    payload.company_id = company_id !== "none" ? company_id : null;
    
    const resume_id = formData.get("resume_id");
    payload.resume_id = resume_id !== "none" ? resume_id : null;

    const work_model = formData.get("work_model");
    payload.work_model = work_model !== "none" ? work_model : null;

    const employment_type = formData.get("employment_type");
    payload.employment_type = employment_type !== "none" ? employment_type : null;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/v1/jobs/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao atualizar vaga");

      setSelectedJob(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

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
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJob(job)}
                      className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group cursor-pointer"
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

      {/* Modal Nova Vaga (Simples) */}
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
                  <SelectTrigger><SelectValue placeholder="Selecione uma empresa" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma (Adicionar depois)</SelectItem>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status Inicial</Label>
                <Select name="status" defaultValue="BACKLOG">
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
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
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                  <Input id="source" name="source" placeholder="Ex: LinkedIn, Gupy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seniority">Senioridade</Label>
                  <Select name="seniority">
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet Detalhes da Vaga (Complexo) */}
      <Sheet open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Detalhes da Vaga</SheetTitle>
            <SheetDescription>
              Aprofunde os dados desta oportunidade para gerar métricas ricas.
            </SheetDescription>
          </SheetHeader>
          
          {selectedJob && (
            <form onSubmit={handleUpdateJob} className="space-y-6 pb-20">
              <div className="space-y-2">
                <Label htmlFor="detail-title">Título da Vaga</Label>
                <Input id="detail-title" name="title" defaultValue={selectedJob.title} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="detail-company">Empresa</Label>
                <Select name="company_id" defaultValue={selectedJob.company_id || "none"}>
                  <SelectTrigger><SelectValue placeholder="Empresa" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detail-status">Status no Funil</Label>
                  <Select name="status" defaultValue={selectedJob.status}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="detail-resume" className="text-primary font-medium">Currículo Usado (Match)</Label>
                  <Select name="resume_id" defaultValue={selectedJob.resume_id || "none"}>
                    <SelectTrigger className="border-primary/50 bg-primary/5"><SelectValue placeholder="Vincular Currículo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {resumes.map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-url" className="flex items-center gap-2">URL da Vaga <LinkIcon size={14}/></Label>
                <Input id="detail-url" name="url" placeholder="https://..." defaultValue={selectedJob.url || ""} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detail-model">Modelo</Label>
                  <Select name="work_model" defaultValue={selectedJob.work_model || "none"}>
                    <SelectTrigger><SelectValue placeholder="Modelo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detail-type">Tipo Contrato</Label>
                  <Select name="employment_type" defaultValue={selectedJob.employment_type || "none"}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Exterior">Exterior (USD/EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Salário Mínimo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input id="salary_min" name="salary_min" type="number" step="100" className="pl-8" defaultValue={selectedJob.salary_min || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Salário Máximo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input id="salary_max" name="salary_max" type="number" step="100" className="pl-8" defaultValue={selectedJob.salary_max || ""} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-desc">Descrição Completa da Vaga (Para Leitura da IA)</Label>
                <Textarea 
                  id="detail-desc" 
                  name="description" 
                  rows={8} 
                  placeholder="Cole aqui todos os requisitos, atribuições e detalhes da vaga..."
                  defaultValue={selectedJob.description || ""}
                  className="resize-none"
                />
              </div>
              
              {selectedJob.status === "REJECTED" && (
                <div className="space-y-2 bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
                  <Label htmlFor="rejection_reason" className="text-red-600 dark:text-red-400">Motivo da Rejeição (Para Analytics)</Label>
                  <Select name="rejection_reason" defaultValue={selectedJob.rejection_reason || "none"}>
                    <SelectTrigger className="border-red-200 dark:border-red-800"><SelectValue placeholder="Por que não deu certo?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Prefiro não informar</SelectItem>
                      <SelectItem value="Ghosting">Ghosting (Falta de resposta)</SelectItem>
                      <SelectItem value="Falta de Fit Técnico">Falta de Fit Técnico</SelectItem>
                      <SelectItem value="Senioridade Inadequada">Senioridade</SelectItem>
                      <SelectItem value="Pretensão Salarial">Pretensão Salarial incompatível</SelectItem>
                      <SelectItem value="Idioma">Idioma</SelectItem>
                      <SelectItem value="Vaga Congelada">Vaga Congelada / Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border mt-0">
                <Button type="button" variant="outline" onClick={() => setSelectedJob(null)} className="w-full">
                  Fechar
                </Button>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Atualizar Informações
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
