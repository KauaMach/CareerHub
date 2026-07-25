import { api } from "@/lib/api";
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Building2, Globe, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const companySchema = z.object({
  name: z.string().min(1, "O nome da empresa é obrigatório"),
  industry: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  linkedin_url: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  glassdoor_url: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  description: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
    }
  });

  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ["companies", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/companies/${params.id}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        industry: company.industry || "",
        size: company.size || "none",
        location: company.location || "",
        website: company.website || "",
        linkedin_url: company.linkedin_url || "",
        glassdoor_url: company.glassdoor_url || "",
        description: company.description || "",
        notes: company.notes || "",
      });
    }
  }, [company, reset]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = isNew 
        ? await api.fetch("/companies", { method: "POST", body: JSON.stringify(payload) }) 
        : await api.fetch(`/companies/${params.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      if (isNew) router.push(`/companies/${data.id}`);
      else alert("Empresa salva com sucesso!");
    },
    onError: () => {
      alert("Erro ao salvar empresa.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await api.fetch(`/companies/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      router.push("/companies");
    },
    onError: () => alert("Erro ao excluir empresa.")
  });

  const onSubmit = (values: CompanyFormValues) => {
    const payload = { ...values };
    Object.keys(payload).forEach(k => {
      if ((payload as any)[k] === "none" || (payload as any)[k] === "") {
        (payload as any)[k] = null;
      }
    });
    saveMutation.mutate(payload);
  };

  const loading = loadingCompany && !isNew;

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/companies" className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {isNew ? "Adicionar Empresa" : company?.name}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados base para mapear uma nova empresa." : "Perfil completo da empresa e anotações."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => {
            if (confirm("Tem certeza que deseja excluir esta empresa?")) deleteMutation.mutate();
          }}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Empresa
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="company-form" onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Info Principal */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 className="text-primary"/> Informações Principais</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa *</Label>
                  <Input {...register("name")} />
                  {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Setor / Indústria</Label>
                    <Input {...register("industry")} placeholder="Ex: Fintech" />
                  </div>
                  <div className="space-y-2">
                    <Label>Porte da Empresa</Label>
                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value || "none"} onValueChange={field.onChange}>
                          <SelectTrigger><SelectValue placeholder="Selecione o porte" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Não informado</SelectItem>
                            <SelectItem value="STARTUP">Startup / Pequena (1-50)</SelectItem>
                            <SelectItem value="SMB">Média (51-500)</SelectItem>
                            <SelectItem value="ENTERPRISE">Grande / Enterprise (500+)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Localização Sede</Label>
                  <Input {...register("location")} placeholder="Ex: São Paulo, SP" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe className="text-primary"/> Presença Digital</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Website Oficial</Label>
                  <Input type="url" {...register("website")} placeholder="https://..." />
                  {errors.website && <span className="text-red-500 text-xs">{errors.website.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input type="url" {...register("linkedin_url")} placeholder="https://linkedin.com/company/..." />
                    {errors.linkedin_url && <span className="text-red-500 text-xs">{errors.linkedin_url.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <Label>Glassdoor</Label>
                    <Input type="url" {...register("glassdoor_url")} placeholder="https://glassdoor.com/..." />
                    {errors.glassdoor_url && <span className="text-red-500 text-xs">{errors.glassdoor_url.message}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Descrição e Notas */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Inteligência Estratégica</h2>
              
              <div className="space-y-2 mb-6">
                <Label>Descrição Institucional</Label>
                <Textarea 
                  {...register("description")}
                  rows={4} 
                  placeholder="Sobre a empresa, visão, produtos, concorrentes..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <Label>Anotações Culturais & Networking</Label>
                <Textarea 
                  {...register("notes")}
                  placeholder="Anote aqui as dicas de cultura, contatos que você fez lá dentro, pessoas de RH, stack de tecnologia..."
                  className="resize-none flex-1 min-h-[200px]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 z-50">
        <Button form="company-form" type="submit" disabled={saveMutation.isPending} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Empresa</span>
        </Button>
      </div>
    </div>
  );
}
