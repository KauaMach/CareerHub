import { api } from "@/lib/api";
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Briefcase, DollarSign, Save, Trash2, Link as LinkIcon, Sparkles } from "lucide-react";
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

const jobSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  company_id: z.string().nullable().optional(),
  status: z.string(),
  url: z.string().nullable().optional(),
  work_model: z.string().nullable().optional(),
  seniority: z.string().nullable().optional(),
  employment_type: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  salary_min: z.coerce.number().nullable().optional(),
  salary_max: z.coerce.number().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  resume_id: z.string().nullable().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      status: "BACKLOG",
    }
  });

  const currentStatus = watch("status");

  const { data: companies = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await api.get("/companies");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    }
  });

  const { data: resumes = [], isLoading: loadingResumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await api.get("/resumes");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    }
  });

  const { data: job, isLoading: loadingJob } = useQuery({
    queryKey: ["jobs", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/jobs/${params.id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title || "",
        company_id: job.company_id || "none",
        status: job.status || "BACKLOG",
        url: job.url || "",
        work_model: job.work_model || "none",
        seniority: job.seniority || "none",
        employment_type: job.employment_type || "none",
        location: job.location || "",
        source: job.source || "",
        salary_min: job.salary_min || ("" as any),
        salary_max: job.salary_max || ("" as any),
        rejection_reason: job.rejection_reason || "none",
        description: job.description || "",
        resume_id: job.resume_id || "none",
      });
    }
  }, [job, reset]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = isNew 
        ? await api.fetch("/jobs", { method: "POST", body: JSON.stringify(payload) }) 
        : await api.fetch(`/jobs/${params.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      if (isNew) router.push(`/jobs/${data.id}`);
      else alert("Vaga salva com sucesso!");
    },
    onError: () => {
      alert("Erro ao salvar vaga.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await api.fetch(`/jobs/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
    },
    onError: () => alert("Erro ao excluir vaga.")
  });

  const onSubmit = (values: JobFormValues) => {
    const payload = { ...values };
    Object.keys(payload).forEach(k => {
      if ((payload as any)[k] === "none" || (payload as any)[k] === "") {
        (payload as any)[k] = null;
      }
    });
    saveMutation.mutate(payload);
  };

  const loading = (loadingJob && !isNew) || loadingCompanies || loadingResumes;

  if (loading) {
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
              {isNew ? "Adicionar Vaga" : job?.title}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da oportunidade." : "Aprofunde os detalhes para melhor análise pela IA."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => {
            if (confirm("Tem certeza que deseja excluir esta vaga?")) deleteMutation.mutate();
          }}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Vaga
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="job-form" onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Formulário Completo */}
          <div className="flex-[2] space-y-6">
            
            {/* Status e Empresa */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título da Vaga *</Label>
                  <Input {...register("title")} />
                  {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Controller
                    name="company_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione...">
                            {field.value && field.value !== "none" ? companies.find((c: any) => c.id === field.value)?.name : "Selecione..."}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma / Cadastrar depois</SelectItem>
                          {companies.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status no Funil</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="font-semibold"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">URL da Vaga <LinkIcon size={14}/></Label>
                  <Input type="url" {...register("url")} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Detalhes Operacionais */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="text-primary"/> Detalhes Operacionais</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Controller
                    name="work_model"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Não informado</SelectItem>
                          <SelectItem value="remoto">Remoto</SelectItem>
                          <SelectItem value="hibrido">Híbrido</SelectItem>
                          <SelectItem value="presencial">Presencial</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senioridade</Label>
                  <Controller
                    name="seniority"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Contrato</Label>
                  <Controller
                    name="employment_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Não informado</SelectItem>
                          <SelectItem value="CLT">CLT</SelectItem>
                          <SelectItem value="PJ">PJ</SelectItem>
                          <SelectItem value="Exterior">Exterior</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input {...register("location")} placeholder="Ex: São Paulo, SP" />
                </div>
                <div className="space-y-2">
                  <Label>Plataforma / Origem</Label>
                  <Input {...register("source")} placeholder="Ex: LinkedIn, Gupy" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Salário Mínimo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="number" step="100" {...register("salary_min")} className="pl-8" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Salário Máximo</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input type="number" step="100" {...register("salary_max")} className="pl-8" />
                  </div>
                </div>
              </div>
            </div>

            {currentStatus === "REJECTED" && (
              <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/50">
                <h2 className="text-lg font-bold text-red-600 mb-4">Motivo da Rejeição</h2>
                <Controller
                    name="rejection_reason"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
                        <SelectTrigger className="border-red-200"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Prefiro não informar</SelectItem>
                          <SelectItem value="Ghosting">Ghosting (Falta de resposta)</SelectItem>
                          <SelectItem value="Falta de Fit Técnico">Falta de Fit Técnico</SelectItem>
                          <SelectItem value="Senioridade Inadequada">Senioridade</SelectItem>
                          <SelectItem value="Pretensão Salarial">Pretensão Salarial incompatível</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                />
              </div>
            )}

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Descrição Completa da Vaga</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cole toda a descrição da vaga aqui. A Inteligência Artificial usará este texto para calcular seu Match Score e adaptar seu currículo.
              </p>
              <Textarea 
                {...register("description")}
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
                <Controller
                    name="resume_id"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value || "none"} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Vincular Currículo">
                            {field.value && field.value !== "none" ? resumes.find((r: any) => r.id === field.value)?.title : "Vincular Currículo"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem Currículo Vinculado</SelectItem>
                          {resumes.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                />
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
        <Button form="job-form" type="submit" disabled={saveMutation.isPending} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Vaga</span>
        </Button>
      </div>
    </div>
  );
}
