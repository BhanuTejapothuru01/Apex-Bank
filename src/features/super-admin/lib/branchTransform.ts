import type { Branch } from '../types/dashboard';

export interface IndianBranch {
  id: string;
  code: string;
  name: string;
  state: string;
  city: string;
  category: 'Headquarters' | 'Regional Office' | 'Branch';
  status: 'Operational' | 'Attention Required';
  manager: {
    name: string;
    avatarSeed: string;
    phone: string;
    email: string;
    rating: number;
    performance: number;
    accountsCount: number;
  };
  employeeCount: number;
  customerCount: number;
  deposits: number;
  loans: number;
  fixedDeposits: number;
  investmentPortfolio: number;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  performanceRating: number;
  openDate: string;
  lastAuditDate: string;
  revenue: number;
  profit: number;
  loss: number;
  coordinates: { x: number; y: number };
  notes: Array<{
    date: string;
    time: string;
    sentBy: string;
    message: string;
    type: 'Urgent Mandate' | 'Compliance Note' | 'Performance Warning' | 'Operational Instruction';
  }>;
}

const COORDINATES: Record<string, { x: number; y: number }> = {
  'BR-HYD-01': { x: 320, y: 280 },
  'BR-MUM-02': { x: 280, y: 320 },
  'BR-NYC-01': { x: 120, y: 180 },
  'BR-LDN-02': { x: 480, y: 140 },
  'BR-DXB-04': { x: 400, y: 220 },
};

function hashCoord(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * (i + 1)) % 500;
  return { x: 80 + (h % 400), y: 100 + ((h * 7) % 300) };
}

function parseLocation(location: string): { city: string; state: string } {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { city: parts[0], state: parts[parts.length - 1] };
  if (parts.length === 1) return { city: parts[0], state: parts[0] };
  return { city: 'Hyderabad', state: 'Telangana' };
}

export function mapBranchToIndianBranch(branch: Branch, index: number): IndianBranch {
  const deposits = branch.totalDeposits || 100000000;
  const { city, state } = parseLocation(branch.location);
  const managerName = branch.manager || 'Branch Manager';
  const initials = managerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'BM';
  const rating = branch.rating || 4.2;
  const isHq = index === 0 || branch.name.toLowerCase().includes('hq') || branch.name.toLowerCase().includes('head');

  return {
    id: branch.id,
    code: branch.id.replace('BR-', 'AX-'),
    name: branch.name,
    state,
    city,
    category: isHq ? 'Headquarters' : index % 3 === 0 ? 'Regional Office' : 'Branch',
    status: branch.status === 'Operational' ? 'Operational' : 'Attention Required',
    manager: {
      name: managerName,
      avatarSeed: initials,
      phone: '+91 40 1234 5678',
      email: `${managerName.split(' ')[0]?.toLowerCase() || 'manager'}.manager@apexbank.com`,
      rating,
      performance: Math.round(rating * 20),
      accountsCount: branch.activeAccounts || Math.round(deposits / 50000),
    },
    employeeCount: Math.max(20, Math.round((branch.activeAccounts || 100) / 150)),
    customerCount: branch.activeAccounts || Math.round(deposits / 25000),
    deposits,
    loans: Math.round(deposits * 0.45),
    fixedDeposits: Math.round(deposits * 0.18),
    investmentPortfolio: Math.round(deposits * 0.08),
    riskRating: rating >= 4.5 ? 'Low' : rating >= 4 ? 'Medium' : 'High',
    performanceRating: rating,
    openDate: '2021-03-15',
    lastAuditDate: '2026-05-20',
    revenue: Math.round(deposits * 0.12),
    profit: Math.round(deposits * 0.04),
    loss: Math.round(deposits * 0.008),
    coordinates: COORDINATES[branch.id] || hashCoord(branch.id),
    notes: [],
  };
}

export function mergeDbBranchesWithDefaults(
  dbBranches: Branch[],
  defaults: IndianBranch[]
): IndianBranch[] {
  if (dbBranches.length === 0) return defaults;
  return dbBranches.map((b, i) => {
    const enriched = mapBranchToIndianBranch(b, i);
    const existing = defaults.find((d) => d.id === b.id);
    if (!existing) return enriched;
    return { ...enriched, notes: existing.notes, coordinates: existing.coordinates };
  });
}
