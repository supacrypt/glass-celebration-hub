import { Page, Request, Response } from '@playwright/test';

export interface NetworkRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  timestamp: number;
  status?: number;
  responseHeaders?: Record<string, string>;
  responseTime?: number;
  size?: number;
  type: 'api' | 'static' | 'supabase' | 'other';
  hasSupabaseRequestId?: boolean;
  supabaseRequestId?: string;
}

export class NetworkMonitor {
  private page: Page;
  private requests: NetworkRequest[] = [];
  private isMonitoring: boolean = false;

  constructor(page: Page) {
    this.page = page;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.requests = [];

    this.page.on('request', this.handleRequest.bind(this));
    this.page.on('response', this.handleResponse.bind(this));
  }

  stopMonitoring() {
    this.isMonitoring = false;
    this.page.off('request', this.handleRequest.bind(this));
    this.page.off('response', this.handleResponse.bind(this));
  }

  private handleRequest(request: Request) {
    const url = request.url();
    const timestamp = Date.now();
    
    const networkRequest: NetworkRequest = {
      url,
      method: request.method(),
      headers: request.headers(),
      timestamp,
      type: this.categorizeRequest(url),
      hasSupabaseRequestId: false
    };

    this.requests.push(networkRequest);
  }

  private handleResponse(response: Response) {
    const url = response.url();
    const responseHeaders = response.headers();
    
    const requestIndex = this.requests.findIndex(req => req.url === url && !req.status);
    if (requestIndex !== -1) {
      const request = this.requests[requestIndex];
      request.status = response.status();
      request.responseHeaders = responseHeaders;
      request.responseTime = Date.now() - request.timestamp;
      
      // Check for Supabase X-Request-Id
      const supabaseRequestId = responseHeaders['x-request-id'];
      if (supabaseRequestId) {
        request.hasSupabaseRequestId = true;
        request.supabaseRequestId = supabaseRequestId;
      }

      // Get response size if available
      const contentLength = responseHeaders['content-length'];
      if (contentLength) {
        request.size = parseInt(contentLength, 10);
      }
    }
  }

  private categorizeRequest(url: string): 'api' | 'static' | 'supabase' | 'other' {
    if (url.includes('supabase') || url.includes('/rest/v1/') || url.includes('/auth/v1/') || url.includes('/storage/v1/')) {
      return 'supabase';
    }
    
    if (url.includes('/api/')) {
      return 'api';
    }
    
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
    if (staticExtensions.some(ext => url.includes(ext))) {
      return 'static';
    }
    
    return 'other';
  }

  getRequests(): NetworkRequest[] {
    return [...this.requests];
  }

  getSupabaseRequests(): NetworkRequest[] {
    return this.requests.filter(req => req.type === 'supabase');
  }

  getFailedRequests(): NetworkRequest[] {
    return this.requests.filter(req => req.status && req.status >= 400);
  }

  getSlowRequests(threshold: number = 3000): NetworkRequest[] {
    return this.requests.filter(req => req.responseTime && req.responseTime > threshold);
  }

  getRequestsByType(): Record<string, NetworkRequest[]> {
    return {
      api: this.requests.filter(req => req.type === 'api'),
      static: this.requests.filter(req => req.type === 'static'),
      supabase: this.requests.filter(req => req.type === 'supabase'),
      other: this.requests.filter(req => req.type === 'other')
    };
  }

  validateSupabaseIntegration(): {
    hasSupabaseRequests: boolean;
    requestsWithIds: number;
    totalSupabaseRequests: number;
    requestIdCoverage: number;
    requestIds: string[];
  } {
    const supabaseRequests = this.getSupabaseRequests();
    const requestsWithIds = supabaseRequests.filter(req => req.hasSupabaseRequestId);
    const requestIds = requestsWithIds.map(req => req.supabaseRequestId!);
    
    return {
      hasSupabaseRequests: supabaseRequests.length > 0,
      requestsWithIds: requestsWithIds.length,
      totalSupabaseRequests: supabaseRequests.length,
      requestIdCoverage: supabaseRequests.length > 0 ? (requestsWithIds.length / supabaseRequests.length) * 100 : 0,
      requestIds
    };
  }

  getPerformanceMetrics(): {
    totalRequests: number;
    averageResponseTime: number;
    totalDataTransferred: number;
    failureRate: number;
    slowRequestsCount: number;
    requestsByType: Record<string, number>;
  } {
    const completedRequests = this.requests.filter(req => req.responseTime);
    const totalResponseTime = completedRequests.reduce((sum, req) => sum + (req.responseTime || 0), 0);
    const totalSize = this.requests.reduce((sum, req) => sum + (req.size || 0), 0);
    const failedRequests = this.getFailedRequests();
    const slowRequests = this.getSlowRequests();
    const requestsByType = this.getRequestsByType();

    return {
      totalRequests: this.requests.length,
      averageResponseTime: completedRequests.length > 0 ? totalResponseTime / completedRequests.length : 0,
      totalDataTransferred: totalSize,
      failureRate: this.requests.length > 0 ? (failedRequests.length / this.requests.length) * 100 : 0,
      slowRequestsCount: slowRequests.length,
      requestsByType: {
        api: requestsByType.api.length,
        static: requestsByType.static.length,
        supabase: requestsByType.supabase.length,
        other: requestsByType.other.length
      }
    };
  }

  getNetworkErrors(): {
    error404s: NetworkRequest[];
    error500s: NetworkRequest[];
    timeouts: NetworkRequest[];
    otherErrors: NetworkRequest[];
  } {
    const failedRequests = this.getFailedRequests();
    
    return {
      error404s: failedRequests.filter(req => req.status === 404),
      error500s: failedRequests.filter(req => req.status && req.status >= 500),
      timeouts: this.requests.filter(req => !req.status), // Requests without response (likely timeouts)
      otherErrors: failedRequests.filter(req => req.status && req.status >= 400 && req.status < 500 && req.status !== 404)
    };
  }

  generateNetworkReport(): {
    summary: ReturnType<NetworkMonitor['getPerformanceMetrics']>;
    supabaseValidation: ReturnType<NetworkMonitor['validateSupabaseIntegration']>;
    errors: ReturnType<NetworkMonitor['getNetworkErrors']>;
    slowRequests: NetworkRequest[];
    allRequests: NetworkRequest[];
    timestamp: string;
  } {
    return {
      summary: this.getPerformanceMetrics(),
      supabaseValidation: this.validateSupabaseIntegration(),
      errors: this.getNetworkErrors(),
      slowRequests: this.getSlowRequests(),
      allRequests: this.getRequests(),
      timestamp: new Date().toISOString()
    };
  }

  async waitForNetworkIdle(timeout: number = 2000): Promise<void> {
    return this.page.waitForLoadState('networkidle', { timeout });
  }

  async waitForSpecificRequest(urlPattern: string | RegExp, timeout: number = 10000): Promise<NetworkRequest | null> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const matchingRequest = this.requests.find(req => {
        if (typeof urlPattern === 'string') {
          return req.url.includes(urlPattern);
        } else {
          return urlPattern.test(req.url);
        }
      });
      
      if (matchingRequest && matchingRequest.status) {
        return matchingRequest;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
  }

  async waitForSupabaseRequest(timeout: number = 10000): Promise<NetworkRequest[]> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const supabaseRequests = this.getSupabaseRequests();
      if (supabaseRequests.length > 0 && supabaseRequests.some(req => req.status)) {
        return supabaseRequests;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return [];
  }

  clear(): void {
    this.requests = [];
  }

  getRequestsInTimeRange(startTime: number, endTime: number): NetworkRequest[] {
    return this.requests.filter(req => req.timestamp >= startTime && req.timestamp <= endTime);
  }

  getRequestsForUrl(url: string): NetworkRequest[] {
    return this.requests.filter(req => req.url === url);
  }

  getUniqueRequestUrls(): string[] {
    return [...new Set(this.requests.map(req => req.url))];
  }

  getDuplicateRequests(): { url: string; count: number; requests: NetworkRequest[] }[] {
    const urlCounts = new Map<string, NetworkRequest[]>();
    
    this.requests.forEach(req => {
      if (!urlCounts.has(req.url)) {
        urlCounts.set(req.url, []);
      }
      urlCounts.get(req.url)!.push(req);
    });
    
    return Array.from(urlCounts.entries())
      .filter(([url, requests]) => requests.length > 1)
      .map(([url, requests]) => ({ url, count: requests.length, requests }));
  }
}