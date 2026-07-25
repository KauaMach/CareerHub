import { api } from "@/lib/api";
"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, Award, Link as LinkIcon, Save, Trash2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const certificateSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  institution: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  issue_date: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
  credential_id: z.string().nullable().optional(),
  credential_url: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
});

type CertificateFormValues = z.infer<typeof certificateSchema>;

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === "new";
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
    }
  });

  const { data: cert, isLoading: loadingCert } = useQuery({
    queryKey: ["certificates", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/certificates/${params.id}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (data.issue_date) data.issue_date = data.issue_date.split("T")[0];
      if (data.expiry_date) data.expiry_date = data.expiry_date.split("T")[0];
      return data;
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (cert) {
      reset({
        title: cert.title || "",
        institution: cert.institution || "",
        category: cert.category || "none",
        issue_date: cert.issue_date || "",
        expiry_date: cert.expiry_date || "",
        credential_id: cert.credential_id || "",
        credential_url: cert.credential_url || "",
      });
    }
  }, [cert, reset]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = isNew 
        ? await api.fetch("/certificates", { method: "POST", body: JSON.stringify(payload) }) 
        : await api.fetch(`/certificates/${params.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      if (isNew) router.push(`/certificates/${data.id}`);
      else alert("Certificado salvo com sucesso!");
    },
    onError: () => {
      alert("Erro ao salvar certificado.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await api.fetch(`/certificates/${params.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      router.push("/certificates");
    },
    onError: () => alert("Erro ao excluir certificado.")
  });

  const onSubmit = (values: CertificateFormValues) => {
    const payload = { ...values } as any;
    Object.keys(payload).forEach(k => {
      if (payload[k] === "none" || payload[k] === "") {
        payload[k] = null;
      }
    });
    if (payload.issue_date) payload.issue_date = new Date(payload.issue_date).toISOString();
    if (payload.expiry_date) payload.expiry_date = new Date(payload.expiry_date).toISOString();
    saveMutation.mutate(payload);
  };

  const loading = loadingCert && !isNew;

  if (loading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-8 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/certificates" className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {isNew ? "Adicionar Certificado" : cert?.title}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da sua conquista acadêmica ou curso." : "Mantenha os dados e credenciais atualizados."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => {
            if (confirm("Tem certeza que deseja excluir este certificado?")) deleteMutation.mutate();
          }}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Certificado
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="cert-form" onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Info Principal */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-primary"/> Dados Básicos</h2>
              
              <div className="space-y-2">
                <Label>Nome do Curso / Certificação *</Label>
                <Input {...register("title")} placeholder="Ex: AWS Certified Solutions Architect" />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
              </div>
              
              <div className="space-y-2">
                <Label>Instituição Emissora</Label>
                <Input {...register("institution")} placeholder="Ex: Amazon Web Services" />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || "none"} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não informado</SelectItem>
                        <SelectItem value="Graduação">Graduação / Pós</SelectItem>
                        <SelectItem value="Curso Livre">Curso Livre / Bootcamp</SelectItem>
                        <SelectItem value="Certificação Técnica">Certificação Técnica Oficial</SelectItem>
                        <SelectItem value="Idioma">Idioma</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input type="date" {...register("issue_date")} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Validade (Opcional)</Label>
                  <Input type="date" {...register("expiry_date")} />
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito - Credenciais e Arquivos */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary"><LinkIcon size={20} /> Validação & Credenciais</h2>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label>ID da Credencial (Opcional)</Label>
                  <Input {...register("credential_id")} placeholder="Ex: 9ABCD12345" />
                </div>

                <div className="space-y-2">
                  <Label>URL da Credencial (Ex: LinkedIn, Credly)</Label>
                  <Input type="url" {...register("credential_url")} placeholder="https://..." />
                  {errors.credential_url && <span className="text-red-500 text-xs">{errors.credential_url.message}</span>}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <FileText className="text-primary/50 w-10 h-10 mb-2" />
                  <h3 className="font-semibold text-sm">Upload de PDF (Fase 3)</h3>
                  <p className="text-xs text-muted-foreground">Em breve, nossa Inteligência Artificial vai analisar o seu PDF e extrair os dados e competências automaticamente para o seu perfil.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 z-50">
        <Button form="cert-form" type="submit" disabled={saveMutation.isPending} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saveMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Certificado</span>
        </Button>
      </div>
    </div>
  );
}
