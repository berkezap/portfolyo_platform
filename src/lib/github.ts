import { Octokit } from '@octokit/rest'

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

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    try {
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        visibility: 'public',
        sort: 'updated',
        per_page: 100
      })

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        homepage: repo.homepage
      }))
    } catch (error) {
      console.error('Error fetching repositories:', error)
      throw new Error('Failed to fetch repositories')
    }
  }

  async getUserData() {
    try {
      const { data } = await this.octokit.users.getAuthenticated()
      return {
        login: data.login,
        name: data.name,
        bio: data.bio,
        avatar_url: data.avatar_url,
        html_url: data.html_url,
        location: data.location,
        company: data.company,
        blog: data.blog,
        public_repos: data.public_repos,
        followers: data.followers,
        following: data.following
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      throw new Error('Failed to fetch user data')
    }
  }
} 