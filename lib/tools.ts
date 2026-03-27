export type ToolColor = 'teal' | 'amber' | 'blue' | 'purple';
export type IndustryTag = 'food' | 'edu' | 'mfg' | 'legal';
export type ToolCategory = 'deadline' | 'cost' | 'operations' | 'food-safety';

export interface Tool {
  slug: string;
  name: string;
  industry: IndustryTag;
  industryLabel: string;
  color: ToolColor;
  problemTag: string;
  description: string;
  category: ToolCategory;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  content: {
    howToUse: string[];
    whoFor: string;
    context: string;
    contextHeading: string;
    faq: { question: string; answer: string }[];
    ctaPitch?: string;
  };
}

export const SITE_NAME = 'automationbyJT';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.auto-jt.com';
export const CONTACT_EMAIL = 'hello@auto-jt.com';

export const CATEGORIES: Record<ToolCategory, string> = {
  deadline: 'Deadline & Compliance problems',
  cost: 'Cost Estimation problems',
  operations: 'Operations & Supplier problems',
  'food-safety': 'Food Safety Documentation problems',
};

export const tools: Tool[] = [
  {
    slug: 'iep-deadline-calculator',
    name: 'IEP Deadline Calculator',
    industry: 'edu',
    industryLabel: 'Education',
    color: 'blue',
    problemTag: 'Problem: One missed deadline triggers state monitoring and due process complaints',
    description:
      'Enter a consent date and your state. Instantly see every IDEA-required deadline — initial evaluation, IEP meeting, annual review, triennial re-eval — color-coded by urgency so nothing slips.',
    category: 'deadline',
    seo: {
      title: 'Free IEP Deadline Calculator — Florida Special Education Timelines',
      description:
        'Calculate IEP meeting deadlines, evaluation timelines, and compliance dates for Florida school districts. Free, no signup, instant PDF export.',
      keywords: [
        'IEP deadline calculator',
        'Florida IEP timelines',
        'special education deadlines',
        'IDEA compliance',
        'FL IEP',
      ],
    },
    content: {
      howToUse: [
        'Enter the parental consent date for initial evaluation.',
        'Select your state (Florida timelines are pre-loaded).',
        'View all IDEA-required deadlines with color-coded urgency.',
        'Export or print your timeline for compliance documentation.',
      ],
      whoFor:
        'Special education coordinators, ESE directors, school psychologists, and parent advocates in Florida school districts who need to track federally mandated IEP timelines without risking compliance violations.',
      contextHeading: 'Florida IEP Timeline Requirements',
      context:
        'Under the Individuals with Disabilities Education Act (IDEA), school districts must complete initial evaluations within 60 days of receiving parental consent — though Florida allows up to 60 school days. Annual IEP reviews must occur within 365 days of the previous meeting, and reevaluations are required at least every three years. Missing any of these deadlines can trigger state monitoring, corrective action plans, and due process complaints. This calculator automatically computes every critical date so your team never has to count calendar days manually again.',
      faq: [
        {
          question: 'Is the IEP Deadline Calculator really free?',
          answer:
            'Yes. No account, no credit card, no email required. Use it directly in your browser and export results instantly.',
        },
        {
          question: 'Does this calculator follow Florida IEP timelines?',
          answer:
            'Yes. Timelines are based on Florida Department of Education requirements for initial evaluations, annual reviews, and reevaluations under IDEA.',
        },
        {
          question: 'Can I use this for states other than Florida?',
          answer:
            'Yes. The calculator supports all 50 states with their specific timeline variations. Florida rules are pre-loaded as the default.',
        },
      ],
      ctaPitch:
        'This calculator shows deadlines. The automated version sends alerts to your entire team 30, 14, and 7 days before each one — connected to your school calendar.',
    },
  },
  {
    slug: 'food-truck-permit-tracker',
    name: 'Food Truck Permit Tracker',
    industry: 'food',
    industryLabel: 'Food Service',
    color: 'amber',
    problemTag: 'Problem: A lapsed permit during a health inspection means you are shut down on the spot',
    description:
      'Select your city. See every permit you need to operate — state DBPR, county health, city BTR, fire safety. Track expiration dates with color-coded urgency so you never get caught with a lapsed license.',
    category: 'deadline',
    seo: {
      title: 'Free Food Truck Permit Tracker — South Florida Mobile Vendor Permits',
      description:
        'Track food truck permits, renewal dates, and health inspections for Broward, Palm Beach, and St. Lucie counties. Free browser-based tool.',
      keywords: [
        'food truck permit tracker',
        'South Florida food truck permit',
        'mobile vendor license',
        'Broward County food truck',
        'Florida food truck permits',
      ],
    },
    content: {
      howToUse: [
        'Add each permit or license with its expiration date.',
        'Select your operating city for location-specific requirements.',
        'View color-coded urgency badges showing what needs renewal.',
        'Print your permit overview for vehicle posting or inspections.',
      ],
      whoFor:
        'Mobile food vendors, food truck operators, and commissary kitchen owners operating in South Florida — from Fort Pierce and Port St. Lucie down through Palm Beach, Broward, and Miami-Dade counties.',
      contextHeading: 'South Florida Food Truck Permit Requirements',
      context:
        'Operating a food truck in South Florida requires juggling permits from multiple agencies simultaneously. At minimum, you need a state Division of Hotels and Restaurants license, a county health department permit, a local business tax receipt, and a mobile food dispensing vehicle permit. Cities like Fort Lauderdale and Miami have additional zoning restrictions and fire safety inspections. A single lapsed permit can result in an immediate shutdown during a health inspection — and in peak season, that means lost revenue you cannot recover. This tracker keeps every expiration date visible in one place so nothing slips through the cracks.',
      faq: [
        {
          question: 'Which South Florida cities are covered?',
          answer:
            'The tracker includes city-specific permit notes for Fort Pierce, Port St. Lucie, Fort Lauderdale, Miami, and surrounding areas in Broward, Palm Beach, Martin, St. Lucie, and Indian River counties.',
        },
        {
          question: 'Does this replace my actual permits?',
          answer:
            'No. This is a tracking and reminder tool. You still need to obtain and renew permits through the appropriate county and state agencies.',
        },
      ],
      ctaPitch:
        'This tracks permits you enter manually. The automated version pulls renewal dates from county systems and texts you 60 days before each one expires.',
    },
  },
  {
    slug: 'chain-of-custody-generator',
    name: 'Chain-of-Custody Generator',
    industry: 'legal',
    industryLabel: 'Legal / PI',
    color: 'purple',
    problemTag: 'Problem: One gap in the custody chain and opposing counsel moves to exclude your evidence',
    description:
      'Build a timestamped, print-ready chain-of-custody record in 2 minutes. Evidence details, every transfer event, handler signatures — formatted for Florida civil proceedings.',
    category: 'deadline',
    seo: {
      title: 'Free Chain-of-Custody Document Generator — Florida Legal',
      description:
        'Generate chain-of-custody forms for Florida personal injury and legal cases. Browser-based, no account needed, instant export.',
      keywords: [
        'chain of custody form',
        'Florida chain of custody',
        'evidence tracking',
        'PI attorney tools',
        'legal evidence form',
      ],
    },
    content: {
      howToUse: [
        'Enter evidence details — type, description, source, and collection date.',
        'Add each transfer event with handler name, timestamp, and purpose.',
        'Review the complete chain-of-custody record.',
        'Print or export the signed, timestamped document for case files.',
      ],
      whoFor:
        'Personal injury attorneys, paralegals, private investigators, and litigation support staff handling civil cases in Florida courts who need properly documented evidence chains for depositions and trial.',
      contextHeading: 'Why Chain-of-Custody Matters in Florida PI Cases',
      context:
        'In Florida personal injury litigation, evidence admissibility often hinges on demonstrating an unbroken chain of custody. Surveillance footage, accident scene photos, medical imaging, and physical evidence all require documentation showing who handled the evidence, when, and why. A single gap in the custody chain gives opposing counsel grounds to challenge admissibility at deposition or trial. This generator creates properly formatted, timestamped records that satisfy Florida Rules of Evidence requirements for civil proceedings.',
      faq: [
        {
          question: 'Is this valid for Florida court proceedings?',
          answer:
            'This tool generates properly formatted chain-of-custody documents following standard legal documentation practices. However, consult your attorney regarding specific evidentiary requirements for your jurisdiction and case.',
        },
        {
          question: 'What types of evidence can I track?',
          answer:
            'The generator supports surveillance footage, accident photos, medical records, physical evidence, digital files, and any other evidence type used in civil litigation.',
        },
      ],
      ctaPitch:
        'This generates one custody record. The automated version tracks every piece of evidence across your entire caseload with automatic timestamping and team notifications.',
    },
  },
  {
    slug: 'deposition-cost-estimator',
    name: 'Deposition Cost Estimator',
    industry: 'legal',
    industryLabel: 'Legal / PI',
    color: 'purple',
    problemTag: 'Problem: Discovery costs eat into contingency fees — and you do not see the total until it is too late',
    description:
      'Toggle court reporter, transcript, videographer, room rental, and expedited delivery. Get an itemized cost range based on actual South Florida market rates for the 15th, 17th, and 19th Circuits.',
    category: 'cost',
    seo: {
      title: 'Free Deposition Cost Estimator — Florida PI Litigation',
      description:
        'Estimate deposition costs for Florida personal injury cases. Court reporter fees, videography, transcript costs. Free calculator, instant results.',
      keywords: [
        'deposition cost estimator',
        'Florida deposition cost',
        'court reporter fees Florida',
        'PI litigation costs',
        'South Florida deposition',
      ],
    },
    content: {
      howToUse: [
        'Select the deposition services you need — court reporter, videographer, transcript.',
        'Choose expedited or standard delivery timelines.',
        'Toggle optional services like room rental and realtime feeds.',
        'View itemized cost estimates based on South Florida market rates.',
      ],
      whoFor:
        'Personal injury attorneys, litigation paralegals, and case managers at contingency-fee firms in South Florida who need accurate deposition cost projections for case budgeting and client communication.',
      contextHeading: 'South Florida Deposition Cost Benchmarks',
      context:
        "Deposition costs in South Florida's 15th, 17th, and 19th Judicial Circuits can vary significantly based on service provider, turnaround time, and deposition length. A typical half-day deposition with court reporter, standard transcript, and basic video runs between $800 and $1,500. Add expedited delivery, realtime feeds, or multiple copy orders and costs can double. For PI firms operating on contingency, unexpected discovery costs directly impact case economics. This estimator uses current South Florida market rate ranges so you can budget accurately before committing to discovery.",
      faq: [
        {
          question: 'Are these actual vendor quotes?',
          answer:
            'No. These are market-rate estimates based on typical South Florida pricing. Actual costs vary by provider. Use this tool for budgeting and comparison, then request formal quotes from your preferred vendors.',
        },
        {
          question: 'What judicial circuits are covered?',
          answer:
            'Rate ranges reflect pricing in Florida\'s 15th (Palm Beach), 17th (Broward), and 19th (St. Lucie, Martin, Indian River, Okeechobee) Judicial Circuits.',
        },
      ],
      ctaPitch:
        'This estimates one deposition. The automated version tracks discovery costs across your entire caseload and flags cases where spend is exceeding the projected recovery.',
    },
  },
  {
    slug: 'vendor-lead-time-tracker',
    name: 'Vendor Lead Time Tracker',
    industry: 'mfg',
    industryLabel: 'Manufacturing',
    color: 'teal',
    problemTag: 'Problem: You know which suppliers are late — you just cannot prove it in a vendor review',
    description:
      'Log promised vs. actual delivery days. Get instant vendor scorecards with on-time rate, average delay, and a letter grade you can put in front of your supplier at the next review meeting.',
    category: 'operations',
    seo: {
      title: 'Free Vendor Lead Time Tracker — Manufacturing & Supply Chain',
      description:
        'Track supplier lead times, delivery performance, and reorder points for South Florida manufacturers. Free spreadsheet alternative.',
      keywords: [
        'vendor lead time tracker',
        'supplier delivery tracking',
        'manufacturing supply chain',
        'vendor scorecard',
        'South Florida manufacturer',
      ],
    },
    content: {
      howToUse: [
        'Add your suppliers with their standard quoted lead times.',
        'Log each delivery with the actual number of days from order to receipt.',
        'View auto-generated scorecards showing on-time rate and variance.',
        'Identify underperforming vendors and use data in supplier negotiations.',
      ],
      whoFor:
        'Production managers, procurement leads, and operations directors at South Florida manufacturing and distribution companies who need data-driven vendor performance tracking without enterprise software costs.',
      contextHeading: 'Why Supplier Lead Time Tracking Matters',
      context:
        'In manufacturing, a supplier who consistently delivers late does not just delay one order — they cascade delays across your entire production schedule. Without tracking promised vs. actual lead times, you cannot identify which vendors are reliable and which are costing you overtime, expedited shipping, and missed customer deadlines. Most small to mid-size manufacturers in South Florida still track this in spreadsheets or not at all. This tool gives you instant vendor scorecards with letter grades, on-time percentages, and average variance — the data you need to hold suppliers accountable or find better alternatives.',
      faq: [
        {
          question: 'Can I export the vendor scorecards?',
          answer:
            'Yes. Scorecards can be printed or exported directly from your browser for use in vendor review meetings or procurement reports.',
        },
        {
          question: 'How many vendors can I track?',
          answer:
            'There is no limit. Add as many suppliers as you need. All data stays in your browser — nothing is sent to a server.',
        },
      ],
      ctaPitch:
        'This builds a scorecard manually. The automated version connects to your PO system and updates vendor grades automatically — with alerts when a supplier drops below your threshold.',
    },
  },
  {
    slug: 'allergen-matrix-builder',
    name: 'Allergen Matrix Builder',
    industry: 'food',
    industryLabel: 'Food Service',
    color: 'amber',
    problemTag: 'Problem: A customer asks about allergens — can your staff answer in 5 seconds?',
    description:
      'Build a printable allergen matrix for your entire menu. All 9 FDA-required allergens, every dish, one grid. Post it in the kitchen. Hand it to front-of-house. 10 minutes to build, protects you from the lawsuit that takes 10 months.',
    category: 'food-safety',
    seo: {
      title: 'Free Allergen Matrix Builder — Restaurant Food Safety',
      description:
        'Build FDA-compliant allergen matrices for your restaurant menu. Track Big 9 allergens across every dish. Free, export to PDF.',
      keywords: [
        'allergen matrix builder',
        'restaurant allergen chart',
        'FDA allergen matrix template',
        'food allergen tracking',
        'Florida restaurant food safety',
      ],
    },
    content: {
      howToUse: [
        'Add your menu items — appetizers, entrees, desserts, beverages.',
        'Click to mark which of the 9 FDA major allergens each item contains.',
        'Review the auto-generated allergen summary for each dish.',
        'Print the matrix to post in your kitchen or share with front-of-house staff.',
      ],
      whoFor:
        'Restaurant owners, kitchen managers, and food safety officers at South Florida dining establishments who need FDA-compliant allergen documentation for staff training, menu labeling, and liability protection.',
      contextHeading: 'FDA Big 9 Allergen Requirements',
      context:
        "The FDA's Food Allergy Safety, Treatment, Education, and Research (FASTER) Act requires labeling for nine major food allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soybeans, and sesame. In Florida, restaurants are not required to label menus, but they are required to have an allergen-aware person on staff and to be able to provide allergen information upon request. A printed allergen matrix is the fastest way to meet this requirement and protect your business from allergen-related liability claims. This builder lets you create a professional, printable matrix in minutes instead of hours.",
      faq: [
        {
          question: 'Which allergens are included?',
          answer:
            'All 9 FDA major allergens under the FASTER Act: milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soybeans, and sesame.',
        },
        {
          question: 'Is an allergen matrix legally required in Florida?',
          answer:
            'Florida does not mandate printed allergen matrices on menus, but restaurants must have allergen-aware staff and provide information on request. A posted matrix is the simplest way to comply and reduces liability risk.',
        },
      ],
      ctaPitch:
        'This builds a static matrix. The automated version syncs with your POS — when you change the menu, the allergen chart updates itself and notifies your staff.',
    },
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tools
    .filter((t) => t.slug !== slug)
    .filter((t) => t.category === tool.category || t.industry === tool.industry)
    .slice(0, 3);
}
