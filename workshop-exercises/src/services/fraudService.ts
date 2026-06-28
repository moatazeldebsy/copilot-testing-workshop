import { type FraudCheckRequest, type FraudCheckResult, type FraudRiskLevel } from '../models/fraud';

const HIGH_RISK_COUNTRIES = ['XX', 'ZZ'];
const HIGH_AMOUNT_THRESHOLD = 1000;
const HIGH_ITEM_COUNT_THRESHOLD = 20;

export class FraudService {
  check(request: FraudCheckRequest): FraudCheckResult {
    const reasons: string[] = [];
    let riskScore = 0;

    if (request.orderAmount > HIGH_AMOUNT_THRESHOLD) {
      riskScore += 40;
      reasons.push('Order amount exceeds high-value threshold');
    }

    if (request.itemCount > HIGH_ITEM_COUNT_THRESHOLD) {
      riskScore += 30;
      reasons.push('Unusually large number of items');
    }

    if (request.ipCountry && HIGH_RISK_COUNTRIES.includes(request.ipCountry.toUpperCase())) {
      riskScore += 50;
      reasons.push('Order originates from a high-risk region');
    }

    let riskLevel: FraudRiskLevel;
    if (riskScore >= 50) {
      riskLevel = 'high';
    } else if (riskScore >= 25) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    return {
      approved: riskLevel !== 'high',
      riskLevel,
      riskScore,
      reasons,
    };
  }
}
