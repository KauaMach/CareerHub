"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, Globe, Loader2, MoreVertical, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Company {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  description: string | null;
  linkedin_url: string | null;
  glassdoor_url: string | null;
  notes: string | null;
  created_at: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Details Sheet
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/v1/companies", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) setCompanies(await res.json());
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const payload: Record<string, any> = {
      name: formData.get("name"),
      website: formData.get("website") || null,
      industry: formData.get("industry") || null,
      location: formData.get("location") || null,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao cadastrar empresa");

      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCompany) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    
    const payload: Record<string, any> = {
      name: formData.get("name"),
      website: formData.get("website") || null,
      industry: formData.get("industry") || null,
      size: formData.get("size") || null,
      location: formData.get("location") || null,
      description: formData.get("description") || null,
      linkedin_url: formData.get("linkedin_url") || null,
      glassdoor_url: formData.get("glassdoor_url") || null,
      notes: formData.get("notes") || null,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/v1/companies/${selectedCompany.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao atualizar empresa");

      setSelectedCompany(null);
      fetchCompanies();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Empresas</h1>
          <p className="text-muted-foreground mt-1">Mapeie suas empresas alvo e faça networking direcionado.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shrink-0 rounded-full px-6 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : companies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl bg-card/30 p-12 text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
            <Building2 size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhuma empresa mapeada</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Comece cadastrando as empresas onde você sonha em trabalhar. Você poderá vinculá-las às suas vagas depois.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Empresa
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <div 
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-inner">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{company.name}</h3>
              
              <div className="space-y-2 mt-auto">
                {company.industry && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Briefcase size={14} className="text-primary/70" />
                    <span className="truncate">{company.industry}</span>
                  </div>
                )}
                {company.location && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin size={14} className="text-primary/70" />
                    <span className="truncate">{company.location}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center text-sm text-blue-500 hover:underline gap-2 mt-2 pt-2 border-t border-border/50">
                    <Globe size={14} />
                    <span className="truncate">{company.website.replace(/^https?:\/\//, '')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova Empresa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Empresa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCompany}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input id="name" name="name" placeholder="Ex: Google, Nubank, Vtex" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Setor / Indústria</Label>
                <Input id="industry" name="industry" placeholder="Ex: Fintech, E-commerce, IA" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Sede / Localização</Label>
                <Input id="location" name="location" placeholder="Ex: São Paulo, SP ou Remoto (EUA)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" placeholder="https://..." type="url" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Empresa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet Detalhes da Empresa */}
      <Sheet open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Perfil da Empresa</SheetTitle>
            <SheetDescription>
              Mantenha os dados desta empresa atualizados para gerar inteligência de mercado.
            </SheetDescription>
          </SheetHeader>
          
          {selectedCompany && (
            <form onSubmit={handleUpdateCompany} className="space-y-6 pb-20">
              <div className="space-y-2">
                <Label htmlFor="detail-name">Nome</Label>
                <Input id="detail-name" name="name" defaultValue={selectedCompany.name} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-industry">Setor</Label>
                <Input id="detail-industry" name="industry" defaultValue={selectedCompany.industry || ""} placeholder="Ex: Fintech" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-size">Porte da Empresa</Label>
                <Select name="size" defaultValue={selectedCompany.size || "none"}>
                  <SelectTrigger><SelectValue placeholder="Selecione o porte" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não informado</SelectItem>
                    <SelectItem value="STARTUP">Startup / Pequena (1-50)</SelectItem>
                    <SelectItem value="SMB">Média (51-500)</SelectItem>
                    <SelectItem value="ENTERPRISE">Grande / Enterprise (500+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-location">Localização Sede</Label>
                <Input id="detail-location" name="location" defaultValue={selectedCompany.location || ""} placeholder="Ex: São Paulo, SP" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-description">Descrição Institucional</Label>
                <Textarea 
                  id="detail-description" 
                  name="description" 
                  rows={4} 
                  placeholder="Descrição pública da empresa (visão, produtos, etc)."
                  defaultValue={selectedCompany.description || ""}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detail-linkedin">LinkedIn (URL)</Label>
                  <Input id="detail-linkedin" name="linkedin_url" type="url" defaultValue={selectedCompany.linkedin_url || ""} placeholder="https://linkedin.com/company/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="detail-glassdoor">Glassdoor (URL)</Label>
                  <Input id="detail-glassdoor" name="glassdoor_url" type="url" defaultValue={selectedCompany.glassdoor_url || ""} placeholder="https://glassdoor.com/..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-website">Website Oficial</Label>
                <Input id="detail-website" name="website" type="url" defaultValue={selectedCompany.website || ""} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-notes">Anotações Culturais & Networking</Label>
                <Textarea 
                  id="detail-notes" 
                  name="notes" 
                  rows={6} 
                  placeholder="Anotações sobre a cultura da empresa, contatos que você fez lá dentro, tecnologias que usam, etc..."
                  defaultValue={selectedCompany.notes || ""}
                  className="resize-none"
                />
              </div>

              <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border mt-0">
                <Button type="button" variant="outline" onClick={() => setSelectedCompany(null)} className="w-full">
                  Fechar
                </Button>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Atualizar Dados
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
