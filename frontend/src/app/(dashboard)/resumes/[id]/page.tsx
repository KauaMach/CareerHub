import { api } from "@/lib/api";
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditResumePage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  
  const queryClient = useQueryClient();

  const { data: resume, isLoading: loading } = useQuery({
    queryKey: ["resumes", params.id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/resumes/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch resume");
      return res.json();
    },
    enabled: !isNew
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isNew) {
        const res = await api.post("/resumes", { ...data, is_default: true });
        if (!res.ok) throw new Error("Failed to create");
        return res.json();
      } else {
        const res = await api.patch(`/resumes/${params.id}`, data);
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      if (isNew) {
        router.push(`/resumes/${data.id}`);
      } else {
        alert("Currículo salvo com sucesso!");
      }
    },
    onError: () => {
      alert("Erro ao salvar currículo.");
    }
  });

  const handleSave = (data: any) => {
    saveMutation.mutate(data);
  };

  return (
    <div className="p-8 h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8 shrink-0">
        <Link href="/resumes" className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {isNew ? "Criar Novo Currículo" : "Editar Currículo"}
          </h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados estruturados para começar." : "Edite as seções. O formato estruturado permite análise profunda pela IA."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0 bg-background/50 rounded-xl">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResumeEditor initialData={resume || {}} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
