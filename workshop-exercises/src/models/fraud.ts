export type FraudRiskLevel = 'low' | 'medium' | 'high';

export interface FraudCheckRequest {
  userId: string;
  orderAmount: number;
  itemCount: number;
  ipCountry?: string;
}

export interface FraudCheckResult {
  approved: boolean;
  riskLevel: FraudRiskLevel;
  riskScore: number;
  reasons: string[];
}
