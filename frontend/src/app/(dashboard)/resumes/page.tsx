"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Star, Loader2, MoreVertical, CheckCircle2, Target } from "lucide-react";
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
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";

interface Resume {
  id: string;
  title: string;
  target_role: string | null;
  content: any | null;
  is_default: boolean;
  created_at: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Details Sheet
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:8000/api/v1/resumes", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) setResumes(await res.json());
    } catch (err) {
      console.error("Failed to fetch resumes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateResume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const payload: Record<string, any> = {
      title: formData.get("title"),
      target_role: formData.get("target_role") || null,
      is_default: resumes.length === 0 ? true : false, // First one is default
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao criar currículo");

      setIsModalOpen(false);
      fetchResumes();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResume = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedResume) return;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const textContent = formData.get("content");
    
    const payload: Record<string, any> = {
      title: formData.get("title"),
      target_role: formData.get("target_role") || null,
      content: textContent ? { text: textContent } : null, // Wrapping in JSON for now
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/v1/resumes/${selectedResume.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao atualizar currículo");

      setSelectedResume(null);
      fetchResumes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const setAsDefault = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      // Idealy the backend should unset others, but for now we just PATCH this one.
      await fetch(`http://localhost:8000/api/v1/resumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ is_default: true })
      });
      fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Currículos</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas versões de currículo para maximizar o Match Score.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shrink-0 rounded-full px-6 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Versão
        </Button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl bg-card/30 p-12 text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum currículo cadastrado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Crie versões do seu currículo (ex: Focado em Frontend, Focado em Gestão) para vincular às vagas e medir sua conversão.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Currículo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resumes.map((resume) => (
            <div 
              key={resume.id}
              onClick={() => setSelectedResume(resume)}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
            >
              {resume.is_default && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star size={10} className="fill-current" /> PRINCIPAL
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <FileText size={24} />
                </div>
                <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors pr-6">{resume.title}</h3>
              
              <div className="space-y-2 mt-2">
                {resume.target_role && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Target size={14} className="text-primary/70" />
                    <span className="truncate">{resume.target_role}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-muted-foreground gap-2 pt-2 border-t border-border/50">
                  <CheckCircle2 size={14} className={resume.content ? "text-green-500" : "text-muted-foreground/50"} />
                  <span>{resume.content ? "Conteúdo preenchido" : "Conteúdo vazio (Pendente)"}</span>
                </div>
              </div>

              {!resume.is_default && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-8"
                  onClick={(e) => setAsDefault(e, resume.id)}
                >
                  Definir como Principal
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo Currículo */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Versão de Currículo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateResume}>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Currículo *</Label>
                <Input id="title" name="title" placeholder="Ex: Desenvolvedor React (Em Inglês)" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_role">Cargo Alvo</Label>
                <Input id="target_role" name="target_role" placeholder="Ex: Senior Frontend Engineer" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Criar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sheet Detalhes do Currículo */}
      <Sheet open={!!selectedResume} onOpenChange={(open) => !open && setSelectedResume(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl">Editar Currículo</SheetTitle>
            <SheetDescription>
              Cole o texto completo do seu currículo aqui para permitir que a Inteligência Artificial calcule o Match Score nas vagas.
            </SheetDescription>
          </SheetHeader>
          
          {selectedResume && (
            <form onSubmit={handleUpdateResume} className="space-y-6 pb-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detail-title">Nome Interno</Label>
                  <Input id="detail-title" name="title" defaultValue={selectedResume.title} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detail-role">Cargo Alvo</Label>
                  <Input id="detail-role" name="target_role" defaultValue={selectedResume.target_role || ""} placeholder="Ex: Tech Lead" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail-content" className="flex items-center gap-2">
                  Texto Completo do Currículo 
                  <Star size={12} className="text-primary fill-primary" />
                </Label>
                <Textarea 
                  id="detail-content" 
                  name="content" 
                  rows={20} 
                  placeholder="Cole todo o texto do seu currículo aqui (Experiência, Educação, Skills). Isso será usado como base para a IA comparar com os requisitos das vagas..."
                  defaultValue={selectedResume.content?.text || ""}
                  className="font-mono text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Dica: Você pode copiar o texto de um PDF e colar diretamente aqui. A IA entenderá o formato bruto.
                </p>
              </div>

              <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border mt-0">
                <Button type="button" variant="outline" onClick={() => setSelectedResume(null)} className="w-full">
                  Fechar
                </Button>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Atualizar Currículo
                </Button>
              </SheetFooter>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
