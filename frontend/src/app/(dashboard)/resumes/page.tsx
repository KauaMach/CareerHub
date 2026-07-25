"use client";

import { api } from "@/lib/api";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Plus, FileText, Star, Loader2, Edit3, Trash2, CheckCircle2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Resume {
  id: string;
  title: string;
  target_role: string | null;
  content: any | null;
  is_default: boolean;
  created_at: string;
}

export default function ResumesPage() {
  const queryClient = useQueryClient();

  const { data: resumes = [], isLoading: loading } = useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: async () => {
      const res = await api.get("/resumes");
      if (!res.ok) throw new Error("Failed to fetch resumes");
      return res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/resumes/${id}`);
      if (!res.ok) throw new Error("Failed to delete resume");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: () => {
      alert("Erro ao excluir currículo.");
    }
  });

  const defaultMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/resumes/${id}`, { is_default: true });
      if (!res.ok) throw new Error("Failed to update resume");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Tem certeza que deseja excluir este currículo?")) return;
    deleteMutation.mutate(id);
  };

  const setAsDefault = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    defaultMutation.mutate(id);
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
        <Link href="/resumes/new" className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Nova Versão
        </Link>
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
            Crie versões do seu currículo estruturado para vincular às vagas e permitir que a IA meça sua aderência.
          </p>
          <Link href="/resumes/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Currículo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resumes.map((resume) => (
            <div 
              key={resume.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col relative overflow-hidden"
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
              </div>
              
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors pr-6 truncate">{resume.title}</h3>
              
              <div className="space-y-2 mt-2 mb-6">
                {resume.target_role && (
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Target size={14} className="text-primary/70" />
                    <span className="truncate">{resume.target_role}</span>
                  </div>
                )}
                <div className="flex items-center text-xs text-muted-foreground gap-2 pt-2 border-t border-border/50">
                  <CheckCircle2 size={14} className={resume.content?.experience ? "text-green-500" : "text-muted-foreground/50"} />
                  <span>{resume.content?.experience ? "Conteúdo preenchido" : "Conteúdo vazio (Pendente)"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Link 
                  href={`/resumes/${resume.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Edit3 size={16} /> Editar
                </Link>
                <button 
                  onClick={(e) => handleDelete(e, resume.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {!resume.is_default && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-8"
                  onClick={(e) => setAsDefault(e, resume.id)}
                >
                  Definir como Principal
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
