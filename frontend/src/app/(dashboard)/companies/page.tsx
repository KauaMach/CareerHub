"use client";

import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, Globe, Loader2, MoreVertical, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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



  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Empresas</h1>
          <p className="text-muted-foreground mt-1">Mapeie suas empresas alvo e faça networking direcionado.</p>
        </div>
        <Link href="/companies/new" className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Plus className="h-4 w-4" />
          Nova Empresa
        </Link>
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
          <Link href="/companies/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-all">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Empresa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <Link 
              key={company.id}
              href={`/companies/${company.id}`}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
