"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Building2, MapPin, Globe, Save, Trash2, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const [company, setCompany] = useState<any>({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    
    async function fetchCompany() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/api/v1/companies/${params.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompany(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [params.id, isNew]);

  const handleChange = (field: string, value: any) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const payload = { ...company };
      // cleanup empty strings to null
      Object.keys(payload).forEach(k => {
        if (payload[k] === "" || payload[k] === "none") payload[k] = null;
      });

      if (isNew) {
        const res = await fetch("http://localhost:8000/api/v1/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          router.push(`/companies/${data.id}`);
        } else {
          alert("Erro ao criar empresa.");
        }
      } else {
        const res = await fetch(`http://localhost:8000/api/v1/companies/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) alert("Empresa salva com sucesso!");
        else alert("Erro ao salvar empresa.");
      }
    } catch (err) {
      alert("Erro ao salvar empresa.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/api/v1/companies/${params.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      router.push("/companies");
    } catch (err) {
      alert("Erro ao excluir empresa.");
    }
  };

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
              {isNew ? "Adicionar Empresa" : company.name}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Preencha os dados base para mapear uma nova empresa." : "Perfil completo da empresa e anotações."}
            </p>
          </div>
        </div>
        {!isNew && (
          <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Excluir Empresa
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <form id="company-form" onSubmit={handleSave} className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 pb-24">
          
          {/* Lado Esquerdo - Info Principal */}
          <div className="flex-1 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 className="text-primary"/> Informações Principais</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa *</Label>
                  <Input value={company.name || ""} onChange={(e) => handleChange("name", e.target.value)} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Setor / Indústria</Label>
                    <Input value={company.industry || ""} onChange={(e) => handleChange("industry", e.target.value)} placeholder="Ex: Fintech" />
                  </div>
                  <div className="space-y-2">
                    <Label>Porte da Empresa</Label>
                    <Select value={company.size || "none"} onValueChange={(val) => handleChange("size", val)}>
                      <SelectTrigger><SelectValue placeholder="Selecione o porte" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não informado</SelectItem>
                        <SelectItem value="STARTUP">Startup / Pequena (1-50)</SelectItem>
                        <SelectItem value="SMB">Média (51-500)</SelectItem>
                        <SelectItem value="ENTERPRISE">Grande / Enterprise (500+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Localização Sede</Label>
                  <Input value={company.location || ""} onChange={(e) => handleChange("location", e.target.value)} placeholder="Ex: São Paulo, SP" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Globe className="text-primary"/> Presença Digital</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Website Oficial</Label>
                  <Input type="url" value={company.website || ""} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input type="url" value={company.linkedin_url || ""} onChange={(e) => handleChange("linkedin_url", e.target.value)} placeholder="https://linkedin.com/company/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Glassdoor</Label>
                    <Input type="url" value={company.glassdoor_url || ""} onChange={(e) => handleChange("glassdoor_url", e.target.value)} placeholder="https://glassdoor.com/..." />
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
                  value={company.description || ""} 
                  onChange={(e) => handleChange("description", e.target.value)} 
                  rows={4} 
                  placeholder="Sobre a empresa, visão, produtos, concorrentes..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <Label>Anotações Culturais & Networking</Label>
                <Textarea 
                  value={company.notes || ""} 
                  onChange={(e) => handleChange("notes", e.target.value)} 
                  placeholder="Anote aqui as dicas de cultura, contatos que você fez lá dentro, pessoas de RH, stack de tecnologia..."
                  className="resize-none flex-1 min-h-[200px]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 z-50">
        <Button form="company-form" type="submit" disabled={saving} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground h-12">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
          <span className="text-base font-medium">Salvar Empresa</span>
        </Button>
      </div>
    </div>
  );
}
