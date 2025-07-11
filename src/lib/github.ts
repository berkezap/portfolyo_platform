import { Octokit } from '@octokit/rest'
import { GitHubRepo } from '@/types/github';
import { RestEndpointMethodTypes } from '@octokit/rest';
type OctokitRepo = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"][number];

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    try {
      // Sadece son 30 repo'yu çek - performans için
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        visibility: 'public',
        sort: 'updated',
        per_page: 30 // 100'den 30'a düşürdük
      })

      const formattedRepos = data.map((repo: OctokitRepo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description ?? null,
        html_url: repo.html_url,
        language: repo.language ?? null,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        created_at: repo.created_at ?? null,
        updated_at: repo.updated_at ?? null,
        topics: repo.topics ?? [],
        homepage: repo.homepage ?? null
      }))

      return formattedRepos
      
    } catch (error) {
      // Check if it's an Octokit error
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as any
        
        switch (octokitError.status) {
          case 401:
            throw new Error('GitHub authentication failed. Please sign out and sign in again.')
          case 403:
            throw new Error('GitHub API rate limit exceeded or insufficient permissions.')
          case 404:
            throw new Error('GitHub user not found or no access to repositories.')
          default:
            throw new Error(`GitHub API error (${octokitError.status}): ${octokitError.message}`)
        }
      }
      
      throw new Error('Failed to fetch repositories from GitHub')
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
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as any
        switch (octokitError.status) {
          case 401:
            throw new Error('GitHub authentication failed. Please sign out and sign in again.')
          case 403:
            throw new Error('GitHub API rate limit exceeded.')
          default:
            throw new Error(`GitHub API error (${octokitError.status}): ${octokitError.message}`)
        }
      }
      
      throw new Error('Failed to fetch user data from GitHub')
    }
  }
} 