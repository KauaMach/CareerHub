"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Award, Building2, Calendar, Link as LinkIcon, Save, Trash2, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const [cert, setCert] = useState<any>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    
    async function fetchCert() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/v1/certificates/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Convert ISO dates to YYYY-MM-DD for standard inputs
          if (data.issue_date) data.issue_date = data.issue_date.split("T")[0];
          if (data.expiry_date) data.expiry_date = data.expiry_date.split("T")[0];
          setCert(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCert();
  }, [params.id, isNew]);

  const handleChange = (field: string, value: any) => {
    setCert(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = { ...cert };
      // cleanup empty strings to null
      Object.keys(payload).forEach(k => {
        if (payload[k] === "" || payload[k] === "none") payload[k] = null;
      });
      // Convert dates to ISO strings if present
      if (payload.issue_date) payload.issue_date = new Date(payload.issue_date).toISOString();
      if (payload.expiry_date) payload.expiry_date = new Date(payload.expiry_date).toISOString();

      if (isNew) {
        const res = await fetch("http://localhost:8000/api/v1/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          router.push(`/certificates/${data.id}`);
        } else {
          alert("Erro ao criar certificado.");
        }
      } else {
        const res = await fetch(`http://localhost:8000/api/v1/certificates/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) alert("Certificado salvo com sucesso!");
        else alert("Erro ao salvar certificado.");
      }
    } catch (err) {
      alert("Erro ao salvar certificado.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este certificado?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/v1/certificates/${params.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      router.push("/certificates");
    } catch (err) {
      alert("Erro ao excluir certificado.");
    }
  };

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
              {isNew ? "Adicionar Certificado" : cert.title}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados da sua conquista acadêmica ou curso." : "Mantenha os dados e credenciais atualizados."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Certificado
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="cert-form" onSubmit={handleSave} className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Info Principal */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="text-primary"/> Dados Básicos</h2>
              
              <div className="space-y-2">
                <Label>Nome do Curso / Certificação *</Label>
                <Input value={cert.title || ""} onChange={(e) => handleChange("title", e.target.value)} required placeholder="Ex: AWS Certified Solutions Architect" />
              </div>
              
              <div className="space-y-2">
                <Label>Instituição Emissora</Label>
                <Input value={cert.institution || ""} onChange={(e) => handleChange("institution", e.target.value)} placeholder="Ex: Amazon Web Services" />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={cert.category || "none"} onValueChange={(val) => handleChange("category", val)}>
                  <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não informado</SelectItem>
                    <SelectItem value="Graduação">Graduação / Pós</SelectItem>
                    <SelectItem value="Curso Livre">Curso Livre / Bootcamp</SelectItem>
                    <SelectItem value="Certificação Técnica">Certificação Técnica Oficial</SelectItem>
                    <SelectItem value="Idioma">Idioma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão</Label>
                  <Input type="date" value={cert.issue_date || ""} onChange={(e) => handleChange("issue_date", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Validade (Opcional)</Label>
                  <Input type="date" value={cert.expiry_date || ""} onChange={(e) => handleChange("expiry_date", e.target.value)} />
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
                  <Input value={cert.credential_id || ""} onChange={(e) => handleChange("credential_id", e.target.value)} placeholder="Ex: 9ABCD12345" />
                </div>

                <div className="space-y-2">
                  <Label>URL da Credencial (Ex: LinkedIn, Credly)</Label>
                  <Input type="url" value={cert.credential_url || ""} onChange={(e) => handleChange("credential_url", e.target.value)} placeholder="https://..." />
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
        <Button form="cert-form" type="submit" disabled={saving} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Certificado</span>
        </Button>
      </div>
    </div>
  );
}
