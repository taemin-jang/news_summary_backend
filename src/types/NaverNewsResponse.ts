export interface NaverNewsResponse {
  description: string;
  link: string;
  originallink: string;
  pubDate: string;
  title: string;
  content?: string | null;
  images?: Array<string> | null;
  keywords?: Array<string>;
  summary?: string | Error;
}

export interface PortfolioJoinArticle {
  article: NaverNewsResponse[];
  id: number;
  kakao_id: number;
  stock_id: string;
}

export interface ClovaSummary {
  summary: string;
  error?: Error;
}
