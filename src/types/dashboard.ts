export type StepType = 'repos' | 'template' | 'cv' | 'generate' | 'completed'

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string | null
  updated_at: string | null
  topics: string[]
  homepage: string | null
}

export interface PortfolioTemplate {
  id: number
  name: string
  description: string
  previewHtml: string
  features: string[]
}

export interface DashboardState {
  selectedRepos: number[]
  selectedTemplate: number
  cvFile: File | null
  step: StepType
  previewModal: { isOpen: boolean; templateId: number | null }
} 