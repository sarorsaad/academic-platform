import axios, { AxiosError, AxiosInstance } from "axios"

class APIClient {
  private client: AxiosInstance
  private retryCount: number = 3
  private retryDelay: number = 1000 // 1 second

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add any auth tokens or headers here
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest: any = error.config

        // If we've already retried, reject the promise
        if (originalRequest._retry) {
          return Promise.reject(error)
        }

        if (this.shouldRetry(error)) {
          originalRequest._retry = true
          return this.retryRequest(originalRequest)
        }

        return Promise.reject(error)
      }
    )
  }

  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status <= 599)
    )
  }

  private async retryRequest(config: any): Promise<any> {
    for (let retry = 0; retry < this.retryCount; retry++) {
      try {
        await this.delay(this.retryDelay * Math.pow(2, retry)) // Exponential backoff
        return await this.client(config)
      } catch (error) {
        if (retry === this.retryCount - 1) {
          throw error
        }
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error as AxiosError)
      throw error
    }
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error as AxiosError)
      throw error
    }
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config)
      return response.data
    } catch (error) {
      this.handleError(error as AxiosError)
      throw error
    }
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error as AxiosError)
      throw error
    }
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      // Server responded with error status
      console.error("Server Error:", {
        status: error.response.status,
        data: error.response.data,
      })
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.message)
    } else {
      // Error in request configuration
      console.error("Request Error:", error.message)
    }
  }
}

export const apiClient = new APIClient()
