import { Octokit } from '@octokit/rest'
import { GitHubRepo } from '@/types/github';
import { RestEndpointMethodTypes } from '@octokit/rest';
type OctokitRepo = RestEndpointMethodTypes["repos"]["listForAuthenticatedUser"]["response"]["data"][number];

// Rate limiting için basit bir cache
const requestCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 dakika

// Retry mekanizması
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Rate limit hatası ise daha uzun bekle
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as { status: number; message: string }
        if (octokitError.status === 403 && octokitError.message.includes('rate limit')) {
          const delay = Math.min(baseDelay * Math.pow(2, attempt), 30000) // Max 30 saniye
          console.log(`Rate limit hit, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries + 1}`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
      }
      
      // Son deneme değilse kısa bir süre bekle
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError!
}

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken,
      // Rate limiting için daha düşük istek hızı
      request: {
        timeout: 10000, // 10 saniye timeout
      }
    })
  }

  async getUserRepos(): Promise<GitHubRepo[]> {
    const cacheKey = 'user-repos'
    const cached = requestCache.get(cacheKey)
    
    // Cache kontrolü
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached repos data')
      return cached.data as GitHubRepo[]
    }

    try {
      const repos = await retryWithBackoff(async () => {
        // Sadece son 20 repo'yu çek - rate limit için daha da azalt
        const { data } = await this.octokit.repos.listForAuthenticatedUser({
          visibility: 'public',
          sort: 'updated',
          per_page: 20 // 30'dan 20'ye düşürdük
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
      })

      // Cache'e kaydet
      requestCache.set(cacheKey, {
        data: repos,
        timestamp: Date.now()
      })

      return repos
      
    } catch (error) {
      // Check if it's an Octokit error
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as { status: number; message: string }
        
        switch (octokitError.status) {
          case 401:
            throw new Error('GitHub authentication failed. Please sign out and sign in again.')
          case 403:
            if (octokitError.message.includes('rate limit')) {
              throw new Error('GitHub API rate limit exceeded. Please wait a few minutes and try again.')
            }
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
    const cacheKey = 'user-data'
    const cached = requestCache.get(cacheKey)
    
    // Cache kontrolü
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Returning cached user data')
      return cached.data
    }

    try {
      const userData = await retryWithBackoff(async () => {
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
      })

      // Cache'e kaydet
      requestCache.set(cacheKey, {
        data: userData,
        timestamp: Date.now()
      })

      return userData
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        const octokitError = error as { status: number; message: string }
        switch (octokitError.status) {
          case 401:
            throw new Error('GitHub authentication failed. Please sign out and sign in again.')
          case 403:
            if (octokitError.message.includes('rate limit')) {
              throw new Error('GitHub API rate limit exceeded. Please wait a few minutes and try again.')
            }
            throw new Error('GitHub API rate limit exceeded.')
          default:
            throw new Error(`GitHub API error (${octokitError.status}): ${octokitError.message}`)
        }
      }
      
      throw new Error('Failed to fetch user data from GitHub')
    }
  }

  // Cache'i temizle
  clearCache() {
    requestCache.clear()
  }
}