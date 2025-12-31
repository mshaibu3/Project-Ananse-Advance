
export enum ViolationType {
  SPEEDING = 'SPEEDING',
  MOBILE_PHONE = 'MOBILE_PHONE',
  SEAT_BELT = 'SEAT_BELT',
  CLONED_PLATE = 'CLONED_PLATE',
  WRONG_WAY = 'WRONG_WAY',
  DISTRACTED_DRIVING = 'DISTRACTED_DRIVING',
  MULTI_INFRACTION = 'MULTI_INFRACTION'
}

export type PaymentStatus = 'PAID' | 'UNPAID' | 'OVERDUE' | 'PROCESSING';

export interface DriverIdentity {
  idConfirmed: boolean;
  matchConfidence: number;
  identifiedName?: string;
  occlusionDetected: boolean;
  occlusionType?: 'SUNGLASSES' | 'MASK' | 'HAND' | 'POSTURE' | 'NONE';
  occlusionResilienceScore: number; // Quality of reconstruction
  reasoning: string;
}

export interface Violation {
  id: string;
  timestamp: string;
  location: string;
  type: ViolationType;
  confidence: number;
  paymentStatus: PaymentStatus;
  fineAmount: number;
  dueDate: string;
  ledgerHash: string;
  prevHash: string;
  integrityStatus: 'VERIFIED' | 'TAMPERED' | 'UNVERIFIED';
  vehicle: {
    plate: string;
    make: string;
    model: string;
    color: string;
    behavioralProfile?: 'STABLE' | 'ERRATIC' | 'AGGRESSIVE';
  };
  driver?: DriverIdentity;
  evidence: {
    imageUrl: string;
    processedUrl?: string;
    metadata: {
      speed?: number;
      limit?: number;
      action?: string;
      hand?: string;
      gaze?: string;
      gaze_confidence?: number;
      skeleton_mapped?: boolean;
      mismatch_detected?: boolean;
      registered_make?: string;
      registered_model?: string;
      registered_color?: string;
      restoration_level?: string;
      ai_reasoning?: string;
      lighting_condition?: string;
      chromatic_integrity?: number;
      security_signature?: string;
      biometric_match_id?: string;
    };
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PhoneUseAnalysis {
  violationDetected: boolean;
  phoneDetected: boolean;
  holdingPose: string;
  gazeDirection: 'ROAD' | 'LAP' | 'DEVICE' | 'PASSENGER' | 'OTHER';
  gazeConfidence: number;
  confidenceScore: number;
  reasoning: string;
  poseEstimation: {
    description: string;
    armGeometry?: string;
    distractionLevel: number;
  };
}

export interface SecurityStatus {
  threatLevel: 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'SEVERE';
  intrusionAttempts: number;
  encryptionStatus: 'QUANTUM_READY' | 'AES_256' | 'DEGRADED';
  lastSecurityAudit: string;
}

export interface SystemStatus {
  cameraId: string;
  location: string;
  temp: number;
  cpuLoad: number;
  network: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  lastSync: string;
  integrity: number;
}
