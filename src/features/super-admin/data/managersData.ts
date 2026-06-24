export interface BranchManager {
  id: string;
  name: string;
  avatarSeed: string;
  gender: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  rating: number;
  department: string;
  designation: string;
  grade: string;
  clearance: string;
  reportingAuthority: string;
  
  // Branch Info
  branchName: string;
  branchCode: string;
  branchLocation: string;
  branchType: string;
  regionalOffice: string;
  branchOpeningDate: string;
  
  // Statistics
  stats: {
    totalStaff: number;
    activeStaff: number;
    inactiveStaff: number;
    contractStaff: number;
  };
  
  // Team Structure
  team: Array<{
    name: string;
    id: string;
    designation: string;
    department: string;
    status: 'Active' | 'Inactive' | 'On Leave';
  }>;
  
  // Transfer History
  transfers: Array<{
    prevBranch: string;
    newBranch: string;
    date: string;
    reason: string;
    approvedBy: string;
  }>;
  
  // Appointment/Promotion Info
  appointments: {
    appointmentDate: string;
    promotionDate: string;
    lastDesignation: string;
    currentDesignation: string;
    history: Array<{
      year: string;
      designation: string;
    }>;
  };
  
  // Service calculations
  joiningYear: number;
  joiningMonth: number; // 1-indexed
  
  // Performance
  performance: {
    totalCustomers: number;
    totalAccounts: number;
    totalDeposits: string;
    totalLoans: string;
    revenue: string;
    branchRanking: string;
  };
  
  // Approval Info
  approval: {
    appointedBy: string;
    approvedByRegional: string;
    approvedByHR: string;
    approvalDate: string;
  };
  
  // Audit Trail
  auditTrail: Array<{
    date: string;
    time: string;
    event: string;
    approvedBy: string;
    remarks: string;
  }>;
}

export const INITIAL_BRANCH_MANAGERS: BranchManager[] = [
  {
    id: "EMP-0007",
    name: "Mohammed Rahman",
    avatarSeed: "MR",
    gender: "Male",
    phone: "+91 90001 02345",
    email: "m.rahman@apexbank.com",
    joinDate: "2014-06-11",
    status: "Active",
    rating: 4.9,
    department: "Branch Command & Ops",
    designation: "Branch Manager & VP",
    grade: "Grade-A",
    clearance: "Level 4 - Branch Controller",
    reportingAuthority: "Rajesh Kumar (Regional Operations Head)",
    branchName: "Hyderabad Regional HQ",
    branchCode: "BR-101",
    branchLocation: "Hyderabad, India",
    branchType: "Flagship Vault & Wealth Office",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2012-04-15",
    stats: {
      totalStaff: 42,
      activeStaff: 38,
      inactiveStaff: 2,
      contractStaff: 2
    },
    team: [
      { name: "Ayesha Khan", id: "EMP-1021", designation: "Senior Banking Officer", department: "Retail & VIP Accounts", status: "Active" },
      { name: "Rahul Sharma", id: "EMP-1022", designation: "Cash Operations Executive", department: "Treasury Management", status: "Active" },
      { name: "Farhan Ahmed", id: "EMP-1023", designation: "Customer Service Officer", department: "Onboarding Division", status: "Active" },
      { name: "Priya Patel", id: "EMP-1024", designation: "Senior Loan Analyst", department: "Private Lending", status: "Active" },
      { name: "Suresh Reddy", id: "EMP-1025", designation: "IT Security Associate", department: "Information Technology", status: "Inactive" }
    ],
    transfers: [
      { prevBranch: "Vijayawada Branch", newBranch: "Hyderabad Regional HQ", date: "2023-03-15", reason: "Operations Restructuring & Executive Mandate", approvedBy: "Regional Operations Head" },
      { prevBranch: "Visakhapatnam Hub", newBranch: "Vijayawada Branch", date: "2019-10-10", reason: "Promotional Assignment & Performance Grid Upgrades", approvedBy: "APAC HR Director" }
    ],
    appointments: {
      appointmentDate: "2014-06-11",
      promotionDate: "2023-01-10",
      lastDesignation: "Operations Manager",
      currentDesignation: "Branch Manager & VP",
      history: [
        { year: "2014", designation: "Assistant Manager (Retail Banking)" },
        { year: "2018", designation: "Operations Manager (Treasury Control)" },
        { year: "2023", designation: "Branch Manager & Vice President" }
      ]
    },
    joiningYear: 2014,
    joiningMonth: 6,
    performance: {
      totalCustomers: 12450,
      totalAccounts: 24800,
      totalDeposits: "$45,890,000",
      totalLoans: "$12,450,000",
      revenue: "$2,450,000",
      branchRanking: "#1 in Region"
    },
    approval: {
      appointedBy: "Board of Directors Command Panel",
      approvedByRegional: "Rajesh Kumar (Regional Operations Head)",
      approvedByHR: "Siddharth Shanmugam (HR Executive Lead)",
      approvalDate: "2014-06-05"
    },
    auditTrail: [
      { date: "2014-06-11", time: "09:00 AM", event: "Employee Joined", approvedBy: "Siddharth Shanmugam", remarks: "Successfully completed compliance checks" },
      { date: "2018-05-15", time: "11:30 AM", event: "First Promotion", approvedBy: "Board of Directors", remarks: "Excellent rating on financial audits" },
      { date: "2023-03-15", time: "10:00 AM", event: "Transfer History", approvedBy: "Rajesh Kumar", remarks: "Transferred to Hyderabad Regional HQ to optimize cashflow command" },
      { date: "2023-03-16", time: "08:30 AM", event: "Branch Assignment", approvedBy: "Regional Controller", remarks: "Assumed command of Hyderabad Regional HQ" },
      { date: "2023-03-20", time: "09:00 AM", event: "Current Appointment", approvedBy: "Global Executive Committee", remarks: "Assigned Grade-A Level 4 security credentials" }
    ]
  },
  {
    id: "EMP-014",
    name: "Maximilian Kael",
    avatarSeed: "MK",
    gender: "Male",
    phone: "+41 44 200 1192",
    email: "m.kael@apexbank.com",
    joinDate: "2015-08-10",
    status: "Active",
    rating: 4.9,
    department: "High Net Wealth Command",
    designation: "Zurich Branch Manager & Director",
    grade: "Senior Director",
    clearance: "Level 4 - Swiss Domain Lead",
    reportingAuthority: "Christian Lindner (EMEA Regional Director)",
    branchName: "Zurich Elite Vault",
    branchCode: "BR-ZH-01",
    branchLocation: "Zurich, Switzerland",
    branchType: "Private Sovereign Vault & Wealth",
    regionalOffice: "EMEA Sovereign Command Centre",
    branchOpeningDate: "2010-09-01",
    stats: {
      totalStaff: 28,
      activeStaff: 26,
      inactiveStaff: 1,
      contractStaff: 1
    },
    team: [
      { name: "Hassan Al-Saeed", id: "EMP-155", designation: "Senior Investment Specialist", department: "Wealth Advisory", status: "Active" },
      { name: "Beatrice Weber", id: "EMP-1032", designation: "Gold Custody Agent", department: "Vault Operations", status: "Active" },
      { name: "Dieter Muller", id: "EMP-1033", designation: "Compliance Officer", department: "Sovereign Audits", status: "Active" },
      { name: "Ines Gygax", id: "EMP-1034", designation: "Concierge Account Lead", department: "VIP Client Desk", status: "Active" }
    ],
    transfers: [
      { prevBranch: "Geneva Flagship Hub", newBranch: "Zurich Elite Vault", date: "2017-01-15", reason: "Strategic Relocation to High Net Value Command", approvedBy: "EMEA Regional Director" }
    ],
    appointments: {
      appointmentDate: "2015-08-10",
      promotionDate: "2020-03-12",
      lastDesignation: "Sovereign Wealth Manager",
      currentDesignation: "Zurich Branch Manager & Director",
      history: [
        { year: "2015", designation: "Sovereign Wealth Manager" },
        { year: "2020", designation: "Zurich Branch Manager & Director" }
      ]
    },
    joiningYear: 2015,
    joiningMonth: 8,
    performance: {
      totalCustomers: 1250,
      totalAccounts: 2100,
      totalDeposits: "$1,250,320,000",
      totalLoans: "$80,000,000",
      revenue: "$11,250,000",
      branchRanking: "#1 in Global Deposits"
    },
    approval: {
      appointedBy: "EMEA Executive Advisory Council",
      approvedByRegional: "Christian Lindner (EMEA Regional Director)",
      approvedByHR: "Astrid Keller (EMEA HR Lead)",
      approvalDate: "2015-08-01"
    },
    auditTrail: [
      { date: "2015-08-10", time: "09:00 AM", event: "Employee Joined", approvedBy: "EMEA Operations", remarks: "Biometric and asset clearance validated" },
      { date: "2017-01-15", time: "10:30 AM", event: "Transfer History", approvedBy: "EMEA Regional Director", remarks: "Redeployed to control key bullion transit node" },
      { date: "2020-03-12", time: "11:00 AM", event: "Current Appointment", approvedBy: "Board of Directors", remarks: "Promoted on achieving record VIP retention metrics" }
    ]
  },
  {
    id: "EMP-0088",
    name: "Charles Windsor",
    avatarSeed: "CW",
    gender: "Male",
    phone: "+44 7700 900222",
    email: "c.windsor@apexbank.com",
    joinDate: "2017-09-01",
    status: "On Leave",
    rating: 4.7,
    department: "United Kingdom Accounts",
    designation: "London Premium Branch Manager",
    grade: "Grade-A",
    clearance: "Level 4 - Westminster Lead",
    reportingAuthority: "Christian Lindner (EMEA Regional Director)",
    branchName: "London Square Premium",
    branchCode: "BR-LDN-02",
    branchLocation: "London, UK",
    branchType: "Premium Commercial Hub",
    regionalOffice: "EMEA Sovereign Command Centre",
    branchOpeningDate: "2015-03-24",
    stats: {
      totalStaff: 35,
      activeStaff: 30,
      inactiveStaff: 3,
      contractStaff: 2
    },
    team: [
      { name: "Chloe Dupont", id: "EMP-092", designation: "Senior Underwriter", department: "Lending Ops", status: "Active" },
      { name: "William Vance", id: "EMP-1042", designation: "Corporate Trust Executive", department: "Lending Ops", status: "Active" },
      { name: "Elizabeth Mountbatten", id: "EMP-1043", designation: "Premium Desk Teller", department: "Cash Control", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2017-09-01",
      promotionDate: "2021-06-15",
      lastDesignation: "Lead Corporate Advisor",
      currentDesignation: "London Premium Branch Manager",
      history: [
        { year: "2017", designation: "Lead Corporate Advisor" },
        { year: "2021", designation: "London Premium Branch Manager" }
      ]
    },
    joiningYear: 2017,
    joiningMonth: 9,
    performance: {
      totalCustomers: 4920,
      totalAccounts: 9800,
      totalDeposits: "$624,500,000",
      totalLoans: "$180,000,000",
      revenue: "$5,800,000",
      branchRanking: "#2 in EMEA Deposits"
    },
    approval: {
      appointedBy: "UK Core Trust Committee",
      approvedByRegional: "Christian Lindner (EMEA Regional Director)",
      approvedByHR: "Victoria Spencer (UK HR Lead)",
      approvalDate: "2017-08-20"
    },
    auditTrail: [
      { date: "2017-09-01", time: "08:30 AM", event: "Employee Joined", approvedBy: "UK HR Director", remarks: "Wired into local executive HSM grid" },
      { date: "2021-06-15", time: "09:30 AM", event: "First Promotion", approvedBy: "Christian Lindner", remarks: "Promoted to Westminster Terminal Overseer" }
    ]
  },
  {
    id: "EMP-0079",
    name: "Masami Tanaka",
    avatarSeed: "MT",
    gender: "Female",
    phone: "+81 90 9988 7766",
    email: "m.tanaka@apexbank.com",
    joinDate: "2016-11-20",
    status: "Active",
    rating: 4.8,
    department: "APAC Corporate Hub",
    designation: "Tokyo Area Lead & BM",
    grade: "Grade-A",
    clearance: "Level 4 - Tokyo Area Lead",
    reportingAuthority: "Siddharth Shanmugam (APAC Regional Command Head)",
    branchName: "Tokyo Neo Skyline",
    branchCode: "BR-TKY-03",
    branchLocation: "Tokyo, Japan",
    branchType: "Corporate Capital Node",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2013-11-01",
    stats: {
      totalStaff: 38,
      activeStaff: 35,
      inactiveStaff: 2,
      contractStaff: 1
    },
    team: [
      { name: "Yuki Sato", id: "EMP-108", designation: "Aesthetic UX Lead / IT Admin", department: "Information Technology", status: "Active" },
      { name: "Kenzo Ito", id: "EMP-1052", designation: "FX Trader", department: "Capital Markets", status: "Active" },
      { name: "Aimi Sato", id: "EMP-1053", designation: "VIP Wealth Associate", department: "Wealth Advisory", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2016-11-20",
      promotionDate: "2019-10-10",
      lastDesignation: "Senior Corporate Strategist",
      currentDesignation: "Tokyo Area Lead & BM",
      history: [
        { year: "2016", designation: "Sovereign Portfolio Specialist" },
        { year: "2018", designation: "Senior Corporate Strategist" },
        { year: "2019", designation: "Tokyo Area Lead & Branch Manager" }
      ]
    },
    joiningYear: 2016,
    joiningMonth: 11,
    performance: {
      totalCustomers: 3150,
      totalAccounts: 6100,
      totalDeposits: "$512,400,000",
      totalLoans: "$95,000,000",
      revenue: "$4,900,000",
      branchRanking: "#3 in APAC"
    },
    approval: {
      appointedBy: "APAC Corporate Strategy Board",
      approvedByRegional: "Siddharth Shanmugam",
      approvedByHR: "Yuka Okada (Tokyo HR Admin)",
      approvalDate: "2016-11-10"
    },
    auditTrail: [
      { date: "2016-11-20", time: "09:00 AM", event: "Employee Joined", approvedBy: "Tokyo Operations", remarks: "Assigned high clearance sovereign tokens" },
      { date: "2019-10-10", time: "10:30 AM", event: "First Promotion", approvedBy: "Board of Trustees", remarks: "Upgraded on expansion of regional IT node" }
    ]
  },
  {
    id: "EMP-0082",
    name: "Lawrence Wong",
    avatarSeed: "LW",
    gender: "Male",
    phone: "+65 6777 5544",
    email: "l.wong@apexbank.com",
    joinDate: "2018-05-15",
    status: "Active",
    rating: 4.6,
    department: "Wealth Management & Trust",
    designation: "Singapore Branch Manager",
    grade: "Grade-A",
    clearance: "Level 4 - Singapore Sovereign Control",
    reportingAuthority: "Siddharth Shanmugam (APAC Regional Command Head)",
    branchName: "Singapore Wharf Hub",
    branchCode: "BR-SGP-04",
    branchLocation: "Singapore",
    branchType: "Offshore Wealth Cluster",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2014-06-30",
    stats: {
      totalStaff: 40,
      activeStaff: 36,
      inactiveStaff: 2,
      contractStaff: 2
    },
    team: [
      { name: "Cheryl Lim", id: "EMP-1061", designation: "Private Wealth Advisor", department: "Wealth Desk", status: "Active" },
      { name: "Wei Ming", id: "EMP-1062", designation: "Risk Specialist", department: "Compliance", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2018-05-15",
      promotionDate: "2022-01-05",
      lastDesignation: "Offshore Trust Officer",
      currentDesignation: "Singapore Branch Manager",
      history: [
        { year: "2018", designation: "Offshore Trust Officer" },
        { year: "2022", designation: "Singapore Branch Manager & Director" }
      ]
    },
    joiningYear: 2018,
    joiningMonth: 5,
    performance: {
      totalCustomers: 5820,
      totalAccounts: 11200,
      totalDeposits: "$842,100,000",
      totalLoans: "$110,000,000",
      revenue: "$7,150,000",
      branchRanking: "#2 in Global Deposits"
    },
    approval: {
      appointedBy: "Singapore Capital Allocation Senate",
      approvedByRegional: "Siddharth Shanmugam",
      approvedByHR: "May Tan (Singapore HR Control)",
      approvalDate: "2018-05-10"
    },
    auditTrail: [
      { date: "2018-05-15", time: "09:00 AM", event: "Employee Joined", approvedBy: "APAC HR Director", remarks: "Successfully passed background validations" }
    ]
  },
  {
    id: "EMP-0001",
    name: "Donald Vance",
    avatarSeed: "DV",
    gender: "Male",
    phone: "+1 (555) 019-0001",
    email: "d.vance@apexbank.com",
    joinDate: "2012-01-10",
    status: "Active",
    rating: 4.8,
    department: "Manhattan Elite Division",
    designation: "Managing Director & BM",
    grade: "Managing Director",
    clearance: "Level 5 - North American Lead",
    reportingAuthority: "Robert Sterling (North America Operations Head)",
    branchName: "New York Wall St. Flagship",
    branchCode: "BR-NYC-01",
    branchLocation: "New York, USA",
    branchType: "Global Flagship Hub & Cash Centre",
    regionalOffice: "North American Sovereign Headquarters",
    branchOpeningDate: "2008-05-20",
    stats: {
      totalStaff: 68,
      activeStaff: 62,
      inactiveStaff: 4,
      contractStaff: 2
    },
    team: [
      { name: "Sarah Jenkins", id: "EMP-001", designation: "Senior Compliance Officer", department: "Risk & Compliance", status: "Active" },
      { name: "Vikram Naidu", id: "EMP-045", designation: "Lead Security Architect", department: "Cybersecurity", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2012-01-10",
      promotionDate: "2018-09-12",
      lastDesignation: "Senior Investment Director",
      currentDesignation: "Managing Director & BM",
      history: [
        { year: "2012", designation: "Senior Investment Director" },
        { year: "2018", designation: "Managing Director & Branch Manager" }
      ]
    },
    joiningYear: 2012,
    joiningMonth: 1,
    performance: {
      totalCustomers: 8490,
      totalAccounts: 16800,
      totalDeposits: "$458,900,000",
      totalLoans: "$240,000,000",
      revenue: "$9,450,000",
      branchRanking: "#1 in AMER"
    },
    approval: {
      appointedBy: "Wall Street Core Trust Board",
      approvedByRegional: "Robert Sterling",
      approvedByHR: "Jennifer Lopez (AMER HR)",
      approvalDate: "2012-01-05"
    },
    auditTrail: [
      { date: "2012-01-10", time: "08:30 AM", event: "Employee Joined", approvedBy: "AMER Admin", remarks: "Credentials bound to core hardware keys" }
    ]
  },
  {
    id: "EMP-0212",
    name: "Siddharth Shanmugam",
    avatarSeed: "SS",
    gender: "Male",
    phone: "+65 6222 3344",
    email: "s.shanmugam@apexbank.com",
    joinDate: "2013-09-01",
    status: "Active",
    rating: 4.9,
    department: "APAC Regional Command",
    designation: "APAC Command Lead & Director",
    grade: "Grade-A & VP",
    clearance: "Level 5 - APAC Command Lead",
    reportingAuthority: "Executive Board of Trustees",
    branchName: "Chennai Sovereign Center",
    branchCode: "BR-CHE-05",
    branchLocation: "Chennai, India",
    branchType: "Regional Performance Center",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2011-08-15",
    stats: {
      totalStaff: 55,
      activeStaff: 50,
      inactiveStaff: 3,
      contractStaff: 2
    },
    team: [
      { name: "Ananya Iyer", id: "EMP-1071", designation: "Regional Audit Officer", department: "Regional Audits", status: "Active" },
      { name: "Karthik Raja", id: "EMP-1072", designation: "Security Specialist", department: "Sovereign Command", status: "Active" }
    ],
    transfers: [
      { prevBranch: "Singapore SENTOSA Gate", newBranch: "Chennai Sovereign Center", date: "2018-05-10", reason: "Strategic leadership rotation & clearing setup", approvedBy: "Global Executive Committee" }
    ],
    appointments: {
      appointmentDate: "2013-09-01",
      promotionDate: "2019-11-15",
      lastDesignation: "Regional Operations Officer",
      currentDesignation: "APAC Command Lead & Director",
      history: [
        { year: "2013", designation: "Regional Operations Officer" },
        { year: "2019", designation: "APAC Command Lead & Director" }
      ]
    },
    joiningYear: 2013,
    joiningMonth: 9,
    performance: {
      totalCustomers: 9400,
      totalAccounts: 18400,
      totalDeposits: "$310,000,000",
      totalLoans: "$75,000,000",
      revenue: "$3,800,000",
      branchRanking: "#4 in Region"
    },
    approval: {
      appointedBy: "Board of Trustees of Sovereignty",
      approvedByRegional: "Board Executive Board",
      approvedByHR: "Global HR Director",
      approvalDate: "2013-08-25"
    },
    auditTrail: [
      { date: "2013-09-01", time: "09:00 AM", event: "Employee Joined", approvedBy: "Board", remarks: "Successfully validated with premium clearance level" }
    ]
  },
  {
    id: "EMP-0111",
    name: "Alistair Sterling",
    avatarSeed: "AS",
    gender: "Male",
    phone: "+44 7700 900213",
    email: "a.sterling@apexbank.com",
    joinDate: "2015-03-12",
    status: "Active",
    rating: 4.7,
    department: "Lending & Corporate Finance",
    designation: "Senior Loan Underwriter & BM",
    grade: "Senior Director",
    clearance: "Level 4 - Credit Approval",
    reportingAuthority: "Robert Sterling (North America Operations Head)",
    branchName: "London Square Premium",
    branchCode: "BR-LDN-02",
    branchLocation: "London, UK",
    branchType: "Premium Commercial Hub",
    regionalOffice: "EMEA Sovereign Command Centre",
    branchOpeningDate: "2015-03-24",
    stats: {
      totalStaff: 41,
      activeStaff: 36,
      inactiveStaff: 3,
      contractStaff: 2
    },
    team: [
      { name: "Thomas Sterling", id: "EMP-1081", designation: "Lending Analyst", department: "Private Banking", status: "Active" },
      { name: "George Bailey", id: "EMP-1082", designation: "Underwriting Agent", department: "Retail Mortgages", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2015-03-12",
      promotionDate: "2021-04-05",
      lastDesignation: "Underwriting Advisor",
      currentDesignation: "Senior Loan Underwriter & BM",
      history: [
        { year: "2015", designation: "Underwriting Advisor" },
        { year: "2021", designation: "Senior Loan Underwriter & BM" }
      ]
    },
    joiningYear: 2015,
    joiningMonth: 3,
    performance: {
      totalCustomers: 5100,
      totalAccounts: 10400,
      totalDeposits: "$490,000,000",
      totalLoans: "$150,000,000",
      revenue: "$4,500,000",
      branchRanking: "#2 in UK"
    },
    approval: {
      appointedBy: "Corporate Operations Directorate",
      approvedByRegional: "EMEA Regional Director",
      approvedByHR: "EMEA HR Executive",
      approvalDate: "2015-03-05"
    },
    auditTrail: [
      { date: "2015-03-12", time: "09:00 AM", event: "Employee Joined", approvedBy: "UK Admin Team", remarks: "Successfully completed compliance onboarding protocols" }
    ]
  },
  {
    id: "EMP-0055",
    name: "Rajesh Kumar",
    avatarSeed: "RK",
    gender: "Male",
    phone: "+91 98765 43210",
    email: "r.kumar@apexbank.com",
    joinDate: "2010-01-05",
    status: "Active",
    rating: 5.0,
    department: "Sovereign Core Administration",
    designation: "VP & Mumbai Branch Director",
    grade: "Executive VP",
    clearance: "Level 5 - Regional Executive Authority",
    reportingAuthority: "Global Board of Directors",
    branchName: "Mumbai Apex Terminal",
    branchCode: "BR-MUM-06",
    branchLocation: "Mumbai, India",
    branchType: "Sovereign Data Center & High Wealth",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2005-12-10",
    stats: {
      totalStaff: 75,
      activeStaff: 70,
      inactiveStaff: 3,
      contractStaff: 2
    },
    team: [
      { name: "Sneha Nair", id: "EMP-1091", designation: "Lead Clearing Officer", department: "Treasury Hub", status: "Active" },
      { name: "Dev Patel", id: "EMP-1092", designation: "Gold Vault Auditor", department: "Bullion Reserve", status: "Active" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2010-01-05",
      promotionDate: "2018-05-15",
      lastDesignation: "Managing Director - Operations",
      currentDesignation: "VP & Mumbai Branch Director",
      history: [
        { year: "2010", designation: "Deputy General Manager" },
        { year: "2015", designation: "Managing Director - Operations" },
        { year: "2018", designation: "Senior Vice President and Mumbai Branch Director" }
      ]
    },
    joiningYear: 2010,
    joiningMonth: 1,
    performance: {
      totalCustomers: 18500,
      totalAccounts: 35000,
      totalDeposits: "$980,000,000",
      totalLoans: "$340,000,000",
      revenue: "$12,450,000",
      branchRanking: "#1 in Sovereignty Region"
    },
    approval: {
      appointedBy: "Reserve Authority of Sovereignty",
      approvedByRegional: "Global Treasury Head",
      approvedByHR: "Super Admin HR",
      approvalDate: "2009-12-25"
    },
    auditTrail: [
      { date: "2010-01-05", time: "09:00 AM", event: "Employee Joined", approvedBy: "Head HR", remarks: "Credentials successfully locked inside central HSM module" }
    ]
  },
  {
    id: "EMP-0077",
    name: "Ayesha Khan",
    avatarSeed: "AK",
    gender: "Female",
    phone: "+91 11 4321 0987",
    email: "a.khan@apexbank.com",
    joinDate: "2019-02-18",
    status: "Inactive",
    rating: 4.5,
    department: "VIP Wealth Advisory",
    designation: "Delhi Senior Branch Manager",
    grade: "Grade-A",
    clearance: "Level 4 - High Net Wealth Lead",
    reportingAuthority: "Rajesh Kumar (Regional Operations Head)",
    branchName: "Delhi Lutyens Elite",
    branchCode: "BR-DEL-07",
    branchLocation: "New Delhi, India",
    branchType: "Elite Wealth Advisory Node",
    regionalOffice: "Asia-Pacific Regional Command Centre",
    branchOpeningDate: "2016-10-15",
    stats: {
      totalStaff: 15,
      activeStaff: 11,
      inactiveStaff: 2,
      contractStaff: 2
    },
    team: [
      { name: "Rahul Sharma", id: "EMP-1022", designation: "Senior Wealth Host", department: "Private Desk", status: "Active" },
      { name: "Sanya Gupta", id: "EMP-1102", designation: "Private Banker", department: "VIP Accounts", status: "Inactive" }
    ],
    transfers: [],
    appointments: {
      appointmentDate: "2019-02-18",
      promotionDate: "2023-08-10",
      lastDesignation: "Junior Relationship Manager",
      currentDesignation: "Delhi Senior Branch Manager",
      history: [
        { year: "2019", designation: "Relationship Manager" },
        { year: "2023", designation: "Delhi Senior Branch Manager" }
      ]
    },
    joiningYear: 2019,
    joiningMonth: 2,
    performance: {
      totalCustomers: 1800,
      totalAccounts: 3200,
      totalDeposits: "$110,500,000",
      totalLoans: "$20,000,000",
      revenue: "$1,850,000",
      branchRanking: "#5 in APAC"
    },
    approval: {
      appointedBy: "VIP Wealth Command Board",
      approvedByRegional: "Rajesh Kumar",
      approvedByHR: "Delhi HR Representative",
      approvalDate: "2019-02-10"
    },
    auditTrail: [
      { date: "2019-02-18", time: "09:00 AM", event: "Employee Joined", approvedBy: "Delhi HR", remarks: "Credentials created under supervision" }
    ]
  }
];
