export interface NaverNewsResponse {
  description: string;
  link: string;
  originallink: string;
  pubDate: string;
  title: string;
  content?: string | null;
  images?: Array<string> | null;
  keywords?: Array<string>;
  summary?: string;
}
