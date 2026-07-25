"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Building2, MapPin, DollarSign, Briefcase, Clock, Calendar, Save, Trash2, FileText, Link as LinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = [
  { id: "BACKLOG", label: "Na Fila" },
  { id: "APPLIED", label: "Aplicado" },
  { id: "INTERVIEW", label: "Entrevista" },
  { id: "OFFER", label: "Proposta" },
  { id: "REJECTED", label: "Recusado" }
];

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const [job, setJob] = useState<any>({ status: "BACKLOG" });
  const [companies, setCompanies] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(!isNew);
  const [loadingDeps, setLoadingDeps] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadDependencies() {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };
        
        const [compRes, resuRes] = await Promise.all([
          fetch("http://localhost:8000/api/v1/companies", { headers }),
          fetch("http://localhost:8000/api/v1/resumes", { headers })
        ]);
        
        if (compRes.ok) setCompanies(await compRes.json());
        if (resuRes.ok) setResumes(await resuRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDeps(false);
      }
    }
    loadDependencies();
  }, []);

  useEffect(() => {
    if (isNew) return;
    
    async function fetchJob() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/v1/jobs/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [params.id, isNew]);

  const handleChange = (field: string, value: any) => {
    setJob(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = { ...job };
      Object.keys(payload).forEach(k => {
        if (payload[k] === "" || payload[k] === "none") payload[k] = null;
      });
      if (payload.salary_min) payload.salary_min = parseFloat(payload.salary_min);
      if (payload.salary_max) payload.salary_max = parseFloat(payload.salary_max);

      if (isNew) {
        const res = await fetch("http://localhost:8000/api/v1/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          router.push(`/jobs/${data.id}`);
        } else {
          alert("Erro ao criar vaga.");
        }
      } else {
        const res = await fetch(`http://localhost:8000/api/v1/jobs/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) alert("Vaga salva com sucesso!");
        else alert("Erro ao salvar vaga.");
      }
    } catch (err) {
      alert("Erro ao salvar vaga.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/v1/jobs/${params.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      router.push("/jobs");
    } catch (err) {
      alert("Erro ao excluir vaga.");
    }
  };

  if (loading || loadingDeps) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {isNew ? "Adicionar Vaga" : job.title}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da oportunidade." : "Aprofunde os detalhes para melhor análise pela IA."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Vaga
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="job-form" onSubmit={handleSave} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Formulário Completo */}
          <div className="flex-[2] space-y-6">
            
            {/* Status e Empresa */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título da Vaga *</Label>
                  <Input value={job.title || ""} onChange={(e) => handleChange("title", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Select value={job.company_id || "none"} onValueChange={(val) => handleChange("company_id", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione...">
                        {job.company_id && job.company_id !== "none" ? companies.find(c => c.id === job.company_id)?.name : "Selecione..."}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma / Cadastrar depois</SelectItem>
                      {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status no Funil</Label>
                  <Select value={job.status || "BACKLOG"} onValueChange={(val) => handleChange("status", val)}>
                    <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">URL da Vaga <LinkIcon size={14}/></Label>
                  <Input type="url" value={job.url || ""} onChange={(e) => handleChange("url", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Detalhes Operacionais */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="text-primary"/> Detalhes Operacionais</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Select value={job.work_model || "none"} onValueChange={(val) => handleChange("work_model", val)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Senioridade</Label>
                  <Select value={job.seniority || "none"} onValueChange={(val) => handleChange("seniority", val)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="Estágio">Estágio</SelectItem>
                      <SelectItem value="Júnior">Júnior</SelectItem>
                      <SelectItem value="Pleno">Pleno</SelectItem>
                      <SelectItem value="Sênior">Sênior</SelectItem>
                      <SelectItem value="Especialista">Especialista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Contrato</Label>
                  <Select value={job.employment_type || "none"} onValueChange={(val) => handleChange("employment_type", val)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não informado</SelectItem>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                      <SelectItem value="Exterior">Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input value={job.location || ""} onChange={(e) => handleChange("location", e.target.value)} placeholder="Ex: São Paulo, SP" />
                </div>
                <div className="space-y-2">
                  <Label>Plataforma / Origem</Label>
                  <Input value={job.source || ""} onChange={(e) => handleChange("source", e.target.value)} placeholder="Ex: LinkedIn, Gupy" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário Mínimo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="number" step="100" value={job.salary_min || ""} onChange={(e) => handleChange("salary_min", e.target.value)} className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Salário Máximo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="number" step="100" value={job.salary_max || ""} onChange={(e) => handleChange("salary_max", e.target.value)} className="pl-8" />
                  </div>
                </div>
              </div>
            </div>

            {job.status === "REJECTED" && (
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/50">
                <h2 className="text-lg font-bold text-red-600 mb-4">Motivo da Rejeição</h2>
                <Select value={job.rejection_reason || "none"} onValueChange={(val) => handleChange("rejection_reason", val)}>
                  <SelectTrigger className="border-red-200"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Prefiro não informar</SelectItem>
                    <SelectItem value="Ghosting">Ghosting (Falta de resposta)</SelectItem>
                    <SelectItem value="Falta de Fit Técnico">Falta de Fit Técnico</SelectItem>
                    <SelectItem value="Senioridade Inadequada">Senioridade</SelectItem>
                    <SelectItem value="Pretensão Salarial">Pretensão Salarial incompatível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Descrição Completa da Vaga</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cole toda a descrição da vaga aqui. A Inteligência Artificial usará este texto para calcular seu Match Score e adaptar seu currículo.
              </p>
              <Textarea 
                value={job.description || ""} 
                onChange={(e) => handleChange("description", e.target.value)} 
                rows={12} 
                className="resize-none font-mono text-sm"
                placeholder="Requisitos, Benefícios, Dia a dia..."
              />
            </div>
          </div>

          {/* Lado Direito - Inteligência Artificial e Currículo */}
          <div className="flex-1 space-y-6">
            <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 p-6 rounded-2xl shadow-sm h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary"><Sparkles size={20} /> Inteligência de Carreira</h2>
              
              <div className="bg-white dark:bg-black/40 rounded-xl p-4 mb-6 border border-border/50 shadow-inner">
                <Label className="mb-2 block text-sm font-semibold">Currículo Estratégico (Match)</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Selecione qual das suas versões de currículo melhor se encaixa nesta oportunidade.
                </p>
                <Select value={job.resume_id || "none"} onValueChange={(val) => handleChange("resume_id", val)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Vincular Currículo">
                      {job.resume_id && job.resume_id !== "none" ? resumes.find(r => r.id === job.resume_id)?.title : "Vincular Currículo"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem Currículo Vinculado</SelectItem>
                    {resumes.map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-primary/5">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Match Score Automático</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Na Fase 3, nossa IA analisará a <strong>Descrição da Vaga</strong> em conjunto com o seu <strong>Currículo Estratégico</strong> e te dará uma pontuação de aderência e dicas de entrevista.
                </p>
                <Button type="button" disabled variant="outline" className="border-primary/50 text-primary w-full opacity-60">
                  Em Breve
                </Button>
              </div>

            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 z-50">
        <Button form="job-form" type="submit" disabled={saving} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Vaga</span>
        </Button>
      </div>
    </div>
  );
}
