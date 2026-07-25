"use client";

import { useState, useEffect } from "react";
import { Plus, Award, Calendar, Link as LinkIcon, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Certificate {
  id: string;
  title: string;
  institution: string | null;
  category: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/v1/certificates", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setCertificates(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Award className="text-primary h-8 w-8" />
            Certificados
          </h1>
          <p className="text-muted-foreground mt-1">Centralize suas conquistas, diplomas e cursos extracurriculares.</p>
        </div>
        <Link href="/certificates/new" className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Novo Certificado
        </Link>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl bg-card/50">
          <Award className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">Nenhum certificado cadastrado</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Adicione seus cursos, graduações e especializações para vinculá-los futuramente nos seus currículos.
          </p>
          <Link href="/certificates/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Primeiro Certificado
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {certificates.map((cert) => (
            <Link 
              key={cert.id}
              href={`/certificates/${cert.id}`}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <ArrowRight className="text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
              
              <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{cert.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="font-medium">{cert.institution || "Sem instituição"}</span>
              </div>
              
              <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={14} />
                  <span>Emissão: {formatDate(cert.issue_date)}</span>
                </div>
                {cert.category && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                    {cert.category}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
