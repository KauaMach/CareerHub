"use client"

import { useState, useEffect } from "react"
import { Building2, Briefcase, FileText, Award, AlertCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
  summary: {
    companies: number
    jobs: number
    resumes: number
    certificates: number
  }
  pipeline: Record<string, number>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const headers = {
          "Authorization": `Bearer ${token}`
        }

        const [summaryRes, pipelineRes] = await Promise.all([
          fetch("http://localhost:8000/api/v1/dashboard/summary", { headers }),
          fetch("http://localhost:8000/api/v1/dashboard/pipeline", { headers })
        ])

        if (!summaryRes.ok || !pipelineRes.ok) {
          throw new Error("Falha ao carregar dados do dashboard")
        }

        const summary = await summaryRes.json()
        const pipeline = await pipelineRes.json()

        setData({ summary, pipeline })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-zinc-200 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md flex items-center gap-3 text-red-600 dark:text-red-400">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Visão Geral</h1>
        <p className="text-zinc-500 mt-2">Acompanhe as métricas e o funil da sua carreira.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Salvas</CardTitle>
            <Building2 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data?.summary.companies || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
            <Briefcase className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data?.summary.jobs || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currículos</CardTitle>
            <FileText className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data?.summary.resumes || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <Award className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{data?.summary.certificates || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Snapshot */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-zinc-200 dark:border-zinc-800 col-span-2">
          <CardHeader>
            <CardTitle>Funil de Vagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {data?.pipeline && Object.entries(data.pipeline).length > 0 ? (
                Object.entries(data.pipeline).map(([status, count]) => (
                  <div key={status} className="flex-1 min-w-[120px] p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-medium text-zinc-500 capitalize">{status}</p>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">{count}</p>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-zinc-500">
                  Nenhuma vaga adicionada ao funil ainda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
