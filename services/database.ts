
import { Violation, ViolationType } from '../types';

const DB_KEY = 'ananse_db_v3';

// Simple hash generator for simulation
const generateHash = (data: string) => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
};

const INITIAL_CITATIONS: Violation[] = [
  {
    id: 'V-83921',
    timestamp: '2024-05-20 14:22:05',
    location: 'Accra-Tema Motorway, Gate A',
    type: ViolationType.SPEEDING,
    confidence: 0.98,
    paymentStatus: 'UNPAID',
    fineAmount: 850.00,
    dueDate: '2024-06-20',
    ledgerHash: 'a1b2c3d4e5f6g7h8',
    prevHash: '0000000000000000',
    integrityStatus: 'VERIFIED',
    vehicle: { plate: 'GR-2849-24', make: 'Honda', model: 'Civic', color: 'Silver', behavioralProfile: 'AGGRESSIVE' },
    evidence: { 
      imageUrl: 'https://picsum.photos/seed/v1/1280/720', 
      metadata: { 
        speed: 124, 
        limit: 100, 
        ai_reasoning: 'Aggressive speed profile detected. 24% over limit.',
        security_signature: 'QS-ANANSE-9912'
      } 
    },
    status: 'PENDING'
  },
  {
    id: 'V-83922',
    timestamp: '2024-05-20 14:18:12',
    location: 'N1 Highway - Lapaz',
    type: ViolationType.MOBILE_PHONE,
    confidence: 0.92,
    paymentStatus: 'PAID',
    fineAmount: 500.00,
    dueDate: '2024-05-30',
    ledgerHash: 'f9e8d7c6b5a43210',
    prevHash: 'a1b2c3d4e5f6g7h8',
    integrityStatus: 'VERIFIED',
    vehicle: { plate: 'GW-503-23', make: 'Toyota', model: 'Hiace', color: 'White', behavioralProfile: 'STABLE' },
    evidence: { 
      imageUrl: 'https://picsum.photos/seed/v2/1280/720', 
      metadata: { 
        action: 'HAND_TO_EAR', 
        ai_reasoning: 'Driver distracted. Mobile usage confirmed.',
        security_signature: 'QS-ANANSE-9913'
      } 
    },
    status: 'PENDING'
  }
];

export class AnanseDatabase {
  private static instance: AnanseDatabase;
  private memoryCache: Violation[] | null = null;

  private constructor() {
    this.init();
  }

  static getInstance() {
    if (!AnanseDatabase.instance) {
      AnanseDatabase.instance = new AnanseDatabase();
    }
    return AnanseDatabase.instance;
  }

  private init() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
      this.memoryCache = INITIAL_CITATIONS;
      this.persist();
    } else {
      this.memoryCache = JSON.parse(existing);
    }
  }

  getViolations(): Violation[] {
    return this.memoryCache || [];
  }

  addViolation(violation: Partial<Violation>) {
    if (!this.memoryCache) return;
    
    const last = this.memoryCache[this.memoryCache.length - 1];
    const prevHash = last ? last.ledgerHash : '0000000000000000';
    const newId = `V-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newViolation: Violation = {
      ...violation as Violation,
      id: newId,
      prevHash,
      ledgerHash: generateHash(newId + prevHash + Date.now()),
      integrityStatus: 'VERIFIED',
      status: 'PENDING'
    };

    this.memoryCache.push(newViolation);
    this.persist();
  }

  deleteViolation(id: string) {
    if (!this.memoryCache) return;
    this.memoryCache = this.memoryCache.filter(v => v.id !== id);
    this.persist();
  }

  private persist() {
    localStorage.setItem(DB_KEY, JSON.stringify(this.memoryCache));
  }
}

export const db = AnanseDatabase.getInstance();
