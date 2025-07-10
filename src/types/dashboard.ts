import { GitHubRepo } from './github'

export type StepType = 'repos' | 'template' | 'cv' | 'generate' | 'completed'

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