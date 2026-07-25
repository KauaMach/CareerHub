"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Sparkles, Loader2, Plus, Trash2, FileDown, FileCode, Globe, Upload } from "lucide-react";

const formatPeriod = (start: string, end: string, isCurrent: boolean, lang: string) => {
  if (!start) return "";
  const formatMonth = (ym: string) => {
    if (!ym) return "";
    const [y, m] = ym.split("-");
    const monthsPt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const months = lang === "en" ? monthsEn : monthsPt;
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  };
  const startStr = formatMonth(start);
  if (isCurrent) return `${startStr} - ${lang === "en" ? "Present" : "Atual"}`;
  const endStr = formatMonth(end);
  return endStr ? `${startStr} - ${endStr}` : startStr;
};

const PeriodInput = ({ item, updateItem, lang }: { item: any, updateItem: (updates: object) => void, lang: string }) => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const handleStart = (val: string) => {
    updateItem({ startDate: val, date: formatPeriod(val, item.endDate, item.isCurrent, lang) });
  };
  const handleEnd = (val: string) => {
    updateItem({ endDate: val, date: formatPeriod(item.startDate, val, item.isCurrent, lang) });
  };
  const handleCurrent = (val: boolean) => {
    updateItem({ isCurrent: val, date: formatPeriod(item.startDate, item.endDate, val, lang) });
  };

  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
      <Input type="month" value={item.startDate || ""} max={currentMonth} onChange={(e) => handleStart(e.target.value)} className="w-36 flex-1 min-w-[120px]" />
      <span className="text-muted-foreground text-sm">até</span>
      <Input type="month" value={item.endDate || ""} min={item.startDate} max={currentMonth} onChange={(e) => handleEnd(e.target.value)} disabled={item.isCurrent} className="w-36 flex-1 min-w-[120px]" />
      <div className="flex items-center gap-2 ml-2 min-w-[80px]">
        <input type="checkbox" id={`current-${item.id}`} checked={item.isCurrent || false} onChange={(e) => handleCurrent(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <Label htmlFor={`current-${item.id}`} className="cursor-pointer text-sm whitespace-nowrap">{lang === "en" ? "Present" : "Atual"}</Label>
      </div>
    </div>
  );
};

const SectionWrapper = ({ title, children, onAdd }: { title: string, children: React.ReactNode, onAdd?: () => void }) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAdd && <Button variant="outline" size="sm" onClick={onAdd} className="gap-2"><Plus size={16} /> Adicionar</Button>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export function ResumeEditor({ initialData = {}, onSave }: { initialData?: any, onSave: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState(initialData.title || "");
  const [targetRole, setTargetRole] = useState(initialData.target_role || "");
  const [lang, setLang] = useState(initialData.content?.lang || "pt");
  
  const [name, setName] = useState(initialData.content?.name || "");
  const [location, setLocation] = useState(initialData.content?.location || "");
  const [phone, setPhone] = useState(initialData.content?.phone || "");
  const [email, setEmail] = useState(initialData.content?.email || "");
  const [linkedin, setLinkedin] = useState(initialData.content?.linkedin || "");
  const [github, setGithub] = useState(initialData.content?.github || "");
  const [summary, setSummary] = useState(initialData.content?.summary || "");
  
  const [experiences, setExperiences] = useState<any[]>(initialData.content?.experience || []);
  const [education, setEducation] = useState<any[]>(initialData.content?.education || []);
  const [projects, setProjects] = useState<any[]>(initialData.content?.projects || []);
  const [skills, setSkills] = useState<any[]>(initialData.content?.skills || []);
  const [languages, setLanguages] = useState<any[]>(initialData.content?.languages || []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    alert("🚀 Funcionalidade da Fase 3: Importação de PDF via IA chegará em breve!");
    e.target.value = '';
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave({
      title,
      target_role: targetRole,
      content: {
        lang, name, location, phone, email, linkedin, github, summary,
        experience: experiences, education, projects, skills, languages
      }
    });
    setLoading(false);
  };

  const addItem = (setter: any, state: any[], defaultItem: any) => setter([...state, { id: Date.now().toString(), ...defaultItem }]);
  const updateItem = (setter: any, state: any[], id: string, field: string | object, value?: any) => {
    setter(state.map((e: any) => {
      if (e.id === id) {
        let updated = { ...e };
        if (typeof field === "object") {
          updated = { ...updated, ...field };
        } else {
          updated[field] = value;
        }
        if (updated.description) {
          updated.description_bullets = updated.description.split('\n').filter((b: string) => b.trim());
        }
        return updated;
      }
      return e;
    }));
  };
  const removeItem = (setter: any, state: any[], id: string) => setter(state.filter((e: any) => e.id !== id));

  const enhanceWithAI = async (id: string, text: string, role: string, company: string, setter: any, state: any[]) => {
    alert("🚀 Funcionalidade da Fase 3: Melhoria de texto com IA chegará em breve!");
  };

  const downloadFile = async (type: 'pdf' | 'latex') => {
    alert(`🚀 Funcionalidade da Fase 3: Exportação para ${type.toUpperCase()} chegará em breve!`);
  };

  return (
    <div className="flex gap-6 h-full w-full">
      {/* Editor Sidebar */}
      <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-24">
        
        <SectionWrapper title="Configurações">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome Interno (Para você)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Desenvolvedor Senior" />
            </div>
            <div>
              <Label>Cargo Alvo (Para IA)</Label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Ex: Tech Lead" />
            </div>
            <div>
              <Label>Idioma / Template</Label>
              <div className="flex gap-2 mt-1">
                <Button type="button" variant={lang === "pt" ? "default" : "outline"} onClick={() => setLang("pt")} className="flex-1 gap-2"><Globe size={16}/> PT-BR</Button>
                <Button type="button" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")} className="flex-1 gap-2"><Globe size={16}/> EN-US</Button>
              </div>
            </div>
            <div className="col-span-2 mt-2">
              <Label className="mb-1 block">Importar de PDF ou LaTeX (IA)</Label>
              <div className="flex gap-2">
                 <Input type="file" accept=".pdf,.tex" onChange={handleImport} disabled={loading} className="cursor-pointer flex-1" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Fase 3: Nossa IA extrairá suas informações de PDFs e arquivos .tex antigos magicamente.</p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper title={lang === 'pt' ? "Informações Pessoais" : "Personal Information"}>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Nome Completo</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Localização</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
            <div><Label>Telefone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            <div><Label>E-mail</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>LinkedIn URL</Label><Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} /></div>
            <div><Label>GitHub URL</Label><Input value={github} onChange={(e) => setGithub(e.target.value)} /></div>
          </div>
          <div className="mt-4">
            <Label>Resumo Profissional</Label>
            <Textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} className="resize-none" />
          </div>
        </SectionWrapper>

        <SectionWrapper title={lang === 'pt' ? "Experiência Profissional" : "Professional Experience"} onAdd={() => addItem(setExperiences, experiences, { company: "", role: "", date: "", description: "", description_bullets: [] })}>
          {experiences.map((exp) => (
            <div key={exp.id} className="p-4 border border-border rounded-lg relative bg-background/50">
              <button type="button" onClick={() => removeItem(setExperiences, experiences, exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={16} /></button>
              <div className="grid grid-cols-2 gap-4 pr-6 mb-4">
                <div><Label>Empresa</Label><Input value={exp.company} onChange={(e) => updateItem(setExperiences, experiences, exp.id, "company", e.target.value)} /></div>
                <div><Label>Cargo</Label><Input value={exp.role} onChange={(e) => updateItem(setExperiences, experiences, exp.id, "role", e.target.value)} /></div>
                <div className="col-span-2">
                  <Label className="mb-2 block">Período</Label>
                  <PeriodInput item={exp} updateItem={(updates) => updateItem(setExperiences, experiences, exp.id, updates)} lang={lang} />
                </div>
              </div>
              <Label className="flex justify-between items-center mb-1">
                Descrição (uma por linha)
                <button type="button" onClick={() => enhanceWithAI(exp.id, exp.description, exp.role, exp.company, setExperiences, experiences)} disabled={enhancingId === exp.id || !exp.description?.trim()} className="text-xs font-semibold text-blue-500 flex items-center gap-1 hover:text-blue-600 disabled:opacity-50 px-2 py-1 bg-blue-500/10 rounded-md">
                  {enhancingId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} IA
                </button>
              </Label>
              <Textarea rows={4} value={exp.description} onChange={(e) => updateItem(setExperiences, experiences, exp.id, "description", e.target.value)} />
            </div>
          ))}
        </SectionWrapper>

        <SectionWrapper title={lang === 'pt' ? "Educação" : "Education"} onAdd={() => addItem(setEducation, education, { institution: "", degree: "", date: "" })}>
          {education.map((edu) => (
            <div key={edu.id} className="p-4 border border-border rounded-lg relative bg-background/50">
              <button type="button" onClick={() => removeItem(setEducation, education, edu.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              <div className="grid grid-cols-2 gap-4 pr-6">
                <div><Label>Instituição</Label><Input value={edu.institution} onChange={(e) => updateItem(setEducation, education, edu.id, "institution", e.target.value)} /></div>
                <div><Label>Curso / Grau</Label><Input value={edu.degree} onChange={(e) => updateItem(setEducation, education, edu.id, "degree", e.target.value)} /></div>
                <div className="col-span-2">
                  <Label className="mb-2 block">Período</Label>
                  <PeriodInput item={edu} updateItem={(updates) => updateItem(setEducation, education, edu.id, updates)} lang={lang} />
                </div>
              </div>
            </div>
          ))}
        </SectionWrapper>

        <SectionWrapper title={lang === 'pt' ? "Projetos" : "Projects"} onAdd={() => addItem(setProjects, projects, { name: "", date: "", description: "", description_bullets: [] })}>
          {projects.map((proj) => (
            <div key={proj.id} className="p-4 border border-border rounded-lg relative bg-background/50">
              <button type="button" onClick={() => removeItem(setProjects, projects, proj.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
              <div className="grid grid-cols-2 gap-4 pr-6 mb-4">
                <div className="col-span-2"><Label>Nome do Projeto</Label><Input value={proj.name} onChange={(e) => updateItem(setProjects, projects, proj.id, "name", e.target.value)} /></div>
                <div className="col-span-2">
                  <Label className="mb-2 block">Período (Opcional)</Label>
                  <PeriodInput item={proj} updateItem={(updates) => updateItem(setProjects, projects, proj.id, updates)} lang={lang} />
                </div>
              </div>
              <Label>Descrição (uma por linha)</Label>
              <Textarea rows={3} value={proj.description} onChange={(e) => updateItem(setProjects, projects, proj.id, "description", e.target.value)} />
            </div>
          ))}
        </SectionWrapper>

        <div className="grid grid-cols-2 gap-6">
          <SectionWrapper title={lang === 'pt' ? "Competências" : "Skills"} onAdd={() => addItem(setSkills, skills, { category: "", items: "" })}>
            {skills.map((skill) => (
              <div key={skill.id} className="p-3 border border-border rounded-lg relative">
                <button type="button" onClick={() => removeItem(setSkills, skills, skill.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                <div className="pr-6 space-y-2">
                  <Input placeholder="Ex: Linguagens" value={skill.category} onChange={(e) => updateItem(setSkills, skills, skill.id, "category", e.target.value)} />
                  <Input placeholder="Ex: Python, Java" value={skill.items} onChange={(e) => updateItem(setSkills, skills, skill.id, "items", e.target.value)} />
                </div>
              </div>
            ))}
          </SectionWrapper>

          <SectionWrapper title={lang === 'pt' ? "Idiomas" : "Languages"} onAdd={() => addItem(setLanguages, languages, { language: "", level: "" })}>
            {languages.map((l) => (
              <div key={l.id} className="p-3 border border-border rounded-lg relative">
                <button type="button" onClick={() => removeItem(setLanguages, languages, l.id)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                <div className="pr-6 space-y-2">
                  <Input placeholder="Idioma" value={l.language} onChange={(e) => updateItem(setLanguages, languages, l.id, "language", e.target.value)} />
                  <Input placeholder="Nível" value={l.level} onChange={(e) => updateItem(setLanguages, languages, l.id, "level", e.target.value)} />
                </div>
              </div>
            ))}
          </SectionWrapper>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="w-1/2 bg-white rounded-xl shadow-lg border border-border/50 p-8 overflow-y-auto">
        <div id="resume-preview" className="max-w-[21cm] mx-auto text-black">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{name || (lang === 'pt' ? "SEU NOME" : "YOUR NAME")}</h1>
            <p className="text-sm font-medium">{location} {location && phone ? '|' : ''} {phone} {phone && email ? '|' : ''} {email}</p>
            <p className="text-sm mt-1">LinkedIn: {linkedin} | GitHub: {github}</p>
          </div>
          
          {summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Resumo Profissional" : "Professional Summary"}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
            </section>
          )}

          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Competências Técnicas" : "Technical Skills"}</h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {skills.map(skill => (
                  <li key={skill.id}><span className="font-bold">{skill.category}:</span> {skill.items}</li>
                ))}
              </ul>
            </section>
          )}

          {experiences.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Experiência Profissional" : "Professional Experience"}</h2>
              <div className="space-y-4">
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{exp.company || "Empresa"}</h3>
                      <span className="font-bold text-sm">{exp.date}</span>
                    </div>
                    <div className="italic text-sm mb-1">{exp.role || "Cargo"}</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {exp.description_bullets?.map((bullet: string, i: number) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Projetos" : "Projects"}</h2>
              <div className="space-y-4">
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{proj.name || "Projeto"}</h3>
                      <span className="font-bold text-sm">{proj.date}</span>
                    </div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {proj.description_bullets?.map((bullet: string, i: number) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Formação Acadêmica" : "Education"}</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{edu.degree || "Curso"}</h3>
                      <span className="font-bold text-sm">{edu.date}</span>
                    </div>
                    <div className="text-sm">{edu.institution || "Instituição"}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{lang === 'pt' ? "Idiomas" : "Languages"}</h2>
              <ul className="space-y-1 text-sm">
                {languages.map(l => (
                  <li key={l.id}><span className="font-bold">{l.language}:</span> {l.level}</li>
                ))}
              </ul>
            </section>
          )}

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border p-2 rounded-full shadow-2xl flex items-center gap-2 z-50">
        <Button type="button" onClick={() => downloadFile('latex')} variant="ghost" className="rounded-full px-6 gap-2" disabled={!initialData.id}>
          <FileCode className="w-4 h-4" /> LaTeX
        </Button>
        <Button type="button" onClick={() => downloadFile('pdf')} variant="ghost" className="rounded-full px-6 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" disabled={!initialData.id}>
          <FileDown className="w-4 h-4" /> PDF
        </Button>
        <div className="w-px h-6 bg-border mx-2"></div>
        <Button type="button" onClick={handleSave} disabled={loading} className="rounded-full px-8 gap-2 shadow-md bg-primary text-primary-foreground">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Currículo
        </Button>
      </div>
    </div>
  );
}
