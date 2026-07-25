"use client";

import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { Plus, Building2, MapPin, Calendar, Clock, Loader2, FileText, GripVertical } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company_id: string | null;
  resume_id: string | null;
  status: string;
  location: string | null;
  work_model: string | null;
  source: string | null;
  seniority: string | null;
  url: string | null;
  description: string | null;
  employment_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  rejection_reason: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
}

const STATUSES = [
  { id: "BACKLOG", label: "Na Fila", color: "bg-slate-500", dot: "bg-slate-500", bg: "bg-slate-100 dark:bg-slate-900" },
  { id: "APPLIED", label: "Aplicado", color: "bg-blue-500", dot: "bg-blue-500", bg: "bg-blue-100 dark:bg-blue-900" },
  { id: "INTERVIEW", label: "Entrevista", color: "bg-purple-500", dot: "bg-purple-500", bg: "bg-purple-100 dark:bg-purple-900" },
  { id: "OFFER", label: "Proposta", color: "bg-green-500", dot: "bg-green-500", bg: "bg-green-100 dark:bg-green-900" },
  { id: "REJECTED", label: "Recusado", color: "bg-red-500", dot: "bg-red-500", bg: "bg-red-100 dark:bg-red-900" }
];

export default function JobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Local state for optimistic drag and drop updates
  const [localJobs, setLocalJobs] = useState<Job[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await api.get("/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await api.get("/companies");
      if (!res.ok) throw new Error("Failed to fetch companies");
      return res.json();
    },
  });

  // Sync local jobs when server data changes
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ jobId, status }: { jobId: string, status: string }) => {
      const res = await api.patch(`/jobs/${jobId}/status`, { status });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSettled: () => {
      // Re-fetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const loading = isLoadingJobs || isLoadingCompanies;

  const filteredJobs = localJobs.filter((job) => {
    const term = searchQuery.toLowerCase();
    const titleMatch = job.title.toLowerCase().includes(term);
    const company = companies.find((c) => c.id === job.company_id);
    const companyMatch = company ? company.name.toLowerCase().includes(term) : false;
    return titleMatch || companyMatch;
  });

  const jobsByStatus = STATUSES.reduce((acc, status) => {
    acc[status.id] = filteredJobs.filter(job => job.status === status.id);
    return acc;
  }, {} as Record<string, Job[]>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date);
  };

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return "Sem empresa associada";
    const comp = companies.find(c => c.id === companyId);
    return comp ? comp.name : "Empresa Desconhecida";
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedJobs = localJobs.map(job => 
      job.id === draggableId ? { ...job, status: newStatus } : job
    );
    setLocalJobs(updatedJobs);

    // Call API
    updateStatusMutation.mutate({ jobId: draggableId, status: newStatus });
  };

  if (!isMounted) return null;

  return (
    <div className="h-full flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vagas</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas candidaturas através do funil arrastando os cards.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="search" 
            placeholder="Buscar por vaga ou empresa..." 
            className="flex h-10 w-full sm:w-64 rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href="/jobs/new" className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-sm">
            <Plus className="h-4 w-4" />
            Nova Vaga
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max">
              {STATUSES.map(status => (
                <div key={status.id} className="w-[320px] flex flex-col flex-shrink-0">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
                      <h3 className="font-semibold text-sm text-foreground">{status.label}</h3>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {jobsByStatus[status.id].length}
                      </span>
                    </div>
                  </div>
                  
                  <Droppable droppableId={status.id}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 rounded-xl p-3 ${status.bg} border border-border/50 shadow-inner flex flex-col gap-3 min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 dark:bg-primary/10 border-primary/20' : ''}`}
                      >
                        {jobsByStatus[status.id].map((job, index) => (
                          <Draggable key={job.id} draggableId={job.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => router.push(`/jobs/${job.id}`)}
                                className={`bg-card border border-border rounded-lg p-4 shadow-sm hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20 opacity-90' : ''}`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-semibold text-foreground leading-tight line-clamp-2 pr-4">{job.title}</h4>
                                  <GripVertical size={16} className="text-muted-foreground/50 shrink-0" />
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                                  <Building2 size={14} />
                                  <span className="truncate">{getCompanyName(job.company_id)}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs mb-4">
                                  {job.work_model && (
                                    <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                      <MapPin size={12} /> <span className="truncate capitalize">{job.work_model}</span>
                                    </div>
                                  )}
                                  {job.seniority && (
                                    <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                      <Clock size={12} /> <span className="truncate capitalize">{job.seniority}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    <span>{formatDate(job.created_at)}</span>
                                  </div>
                                  {job.resume_id && (
                                    <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                      <FileText size={12} /> CV Vinculado
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {jobsByStatus[status.id].length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-24 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-sm text-muted-foreground/60 pointer-events-none">
                            Arraste vagas para cá
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
