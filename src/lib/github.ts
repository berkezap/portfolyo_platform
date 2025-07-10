import { Octokit } from '@octokit/rest'
import { GitHubRepo } from '@/types/github';
import { RestEndpointMethodTypes } from '@octokit/rest';
type OctokitRepo = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"][number];

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    console.log('🔑 GitHub Service initialized with token:', accessToken?.slice(0, 8) + '...')
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    try {
      console.log('📡 Calling GitHub API to fetch user repositories...')
      
      const { data } = await this.octokit.repos.listForAuthenticatedUser({
        visibility: 'public',
        sort: 'updated',
        per_page: 100
      })

      console.log('✅ GitHub API raw response:', {
        totalRepos: data.length,
        firstRepoName: data[0]?.name || 'none',
        sampleRepos: data.slice(0, 3).map((repo: OctokitRepo) => ({
          name: repo.name,
          visibility: (repo as any).private ? 'private' : 'public',
          language: repo.language
        }))
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

      console.log('🔄 Formatted repos:', {
        count: formattedRepos.length,
        sample: formattedRepos.slice(0, 2)
      })

      return formattedRepos
      
    } catch (error) {
      console.error('💥 Error fetching repositories from GitHub:', error)
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3)
        })
      }
      
      // Check if it's an Octokit error
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as any
        console.error('Octokit error details:', {
          status: octokitError.status,
          message: octokitError.message,
          response: octokitError.response?.data
        })
        
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
      console.log('👤 Fetching GitHub user data...')
      
      const { data } = await this.octokit.users.getAuthenticated()
      
      console.log('✅ GitHub user data fetched:', {
        login: data.login,
        name: data.name,
        publicRepos: data.public_repos
      })
      
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
      console.error('💥 Error fetching user data from GitHub:', error)
      
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