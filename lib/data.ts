import { ResumeData, RequestConfig } from './types';
import resumeData from '@/context/resume.json';

/**
 * Load and parse resume data from context/resume.json
 * @returns ResumeData object
 */
export function getResumeData(): ResumeData {
  return resumeData as ResumeData;
}

/**
 * Request configuration array with all endpoint definitions
 */
export const requests: RequestConfig[] = [
  {
    id: 'user-profile',
    label: 'User',
    method: 'GET',
    url: 'https://api.moinuddin.dev/v1/user/profile',
    folder: 'v1 (Stable)',
    type: 'profile'
  },
  {
    id: 'github-repos',
    label: 'Projects',
    method: 'GET',
    url: 'https://api.moinuddin.dev/v1/projects',
    folder: 'v1 (Stable)',
    type: 'github'
  },
  {
    id: 'ai-query',
    label: 'AI Query',
    method: 'POST',
    url: 'https://api.moinuddin.dev/v1/ai/query',
    folder: 'v1 (Stable)',
    type: 'ai'
  },
  {
    id: 'network-handshake',
    label: 'Establish Connection',
    method: 'POST',
    url: 'https://api.moinuddin.dev/v1/network/handshake',
    folder: 'v1 (Stable)',
    type: 'social'
  },
  {
    id: 'uplink-transmit',
    label: 'Direct Uplink',
    method: 'POST',
    url: 'https://api.moinuddin.dev/v1/uplink/transmit',
    folder: 'v1 (Stable)',
    type: 'contact'
  }
];

/**
 * Get request configuration by ID
 * @param id - Request ID
 * @returns RequestConfig or undefined if not found
 */
export function getRequestById(id: string): RequestConfig | undefined {
  return requests.find(req => req.id === id);
}

/**
 * Get all requests grouped by folder
 * @returns Map of folder names to request arrays
 */
export function getRequestsByFolder(): Map<string, RequestConfig[]> {
  const folderMap = new Map<string, RequestConfig[]>();
  
  requests.forEach(request => {
    const existing = folderMap.get(request.folder) || [];
    folderMap.set(request.folder, [...existing, request]);
  });
  
  return folderMap;
}
