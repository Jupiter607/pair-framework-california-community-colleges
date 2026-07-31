import { ExampleCase } from '../types';

export const GUIDEBOOK_EXAMPLES: ExampleCase[] = [
  {
    id: 'ai-adoption',
    strategicArea: 'AI Adoption in Higher Ed',
    poleLName: 'Rapid Innovation',
    poleRName: 'Responsible Governance',
    rawChallenge: 'How do we stop faculty from using unsafe AI tools?',
    neutralChallenge: 'How do we enable useful AI experimentation while protecting data, privacy, and institutional trust?',
    classification: 'problem_in_polarity',
    immediateProblem: 'Draft and approve an institutional AI usage policy & vetting sandbox.',
    largerPolarity: 'Balancing rapid innovation and technology experimentation with responsible governance, compliance, and privacy.',
    polarityMap: {
      poleL: {
        name: 'Rapid Innovation',
        upsides: [
          'Faculty and students experiment with emerging tools',
          'Colleges respond quickly to workforce changes',
          'New teaching and service models emerge',
          'Institutions remain relevant to employers and communities'
        ],
        downsides: [
          'Unreviewed tools expose sensitive data & privacy risks',
          'Equity gaps widen among students with uneven access',
          'Procurement becomes fragmented and uncoordinated',
          'Academic integrity expectations become unclear'
        ]
      },
      poleR: {
        name: 'Responsible Governance',
        upsides: [
          'Student and institutional data are protected',
          'Expectations are transparent and consistent',
          'Accessibility, procurement, and security standards are followed',
          'Public trust and accountability are strengthened'
        ],
        downsides: [
          'Approval processes become too slow and bureaucratic',
          'Faculty innovate outside official systems (shadow IT)',
          'Policies become outdated before implementation',
          'Innovation is treated only as a compliance issue'
        ]
      },
      sharedBestHope: 'A trusted, equitable, and adaptable California community college system that uses AI to improve learning, operations, and economic mobility.',
      sharedGreatestFear: 'A fragmented system where some colleges adopt unsafe tools while others become immobilized by risk avoidance.'
    },
    actions: [
      {
        id: 'act-1',
        action: 'Create approved AI sandboxes and fund small faculty innovation cohorts',
        poleSupported: 'L',
        owner: 'Academic Senate & IT Innovation Team',
        timing: '30 Days',
        successEvidence: 'Active pilot cohorts across 3 departments with 150+ student participants',
        earlyWarningIndicator: 'Protected student data entered into unapproved external AI tools'
      },
      {
        id: 'act-2',
        action: 'Establish a streamlined privacy, accessibility, and security review exception workflow',
        poleSupported: 'R',
        owner: 'CIO & Risk Management Committee',
        timing: '60 Days',
        successEvidence: 'Security review turnaround under 10 business days',
        earlyWarningIndicator: 'Policy approval timelines exceeding technology update cycles'
      }
    ]
  },
  {
    id: 'instruction-autonomy',
    strategicArea: 'Instructional Policy',
    poleLName: 'Faculty Autonomy',
    poleRName: 'Institutional Consistency',
    rawChallenge: 'How do we make every college follow the exact same syllabus and grading process?',
    neutralChallenge: 'How do we create statewide coherence while preserving local faculty flexibility and academic freedom?',
    classification: 'polarity',
    immediateProblem: 'Create a shared rubric guidelines template for course articulation.',
    largerPolarity: 'Managing ongoing tension between faculty instructional autonomy and institutional consistency.',
    polarityMap: {
      poleL: {
        name: 'Faculty Autonomy',
        upsides: [
          'Disciplines adapt quickly to novel research and student needs',
          'High instructor passion, creativity, and pedagogical ownership',
          'Diverse teaching methodologies suited to diverse learners'
        ],
        downsides: [
          'Inconsistent student experiences across sections',
          'Transfer articulation barriers and credit loss risks',
          'Unequal standards of rigor and syllabus expectations'
        ]
      },
      poleR: {
        name: 'Institutional Consistency',
        upsides: [
          'Clear, reliable transfer pathways for all students',
          'Statewide compliance and predictable quality standards',
          'Simplified student orientation and cross-campus navigation'
        ],
        downsides: [
          'Rigid instructional guidelines that suppress innovation',
          'Faculty disengagement and feeling micromanaged',
          'Inability to quickly adapt to local community context'
        ]
      },
      sharedBestHope: 'A high-quality educational environment where student learning is consistently supported while teaching remains inspiring and responsive.',
      sharedGreatestFear: 'A chaotic system of unpredictable section quality or a sterile environment devoid of teaching passion.'
    },
    actions: [
      {
        id: 'act-3',
        action: 'Develop discipline peer learning circles to share syllabus standards',
        poleSupported: 'L',
        owner: 'Curriculum Committee Chair',
        timing: '45 Days',
        successEvidence: '85% faculty participation in voluntary alignment workshops',
        earlyWarningIndicator: 'Student grievances regarding syllabus discrepancies across sections'
      }
    ]
  },
  {
    id: 'operations-automation',
    strategicArea: 'Student Operations & Services',
    poleLName: 'Automation & Efficiency',
    poleRName: 'Human Judgment & Accountability',
    rawChallenge: 'How do we automate all student enrollment services to save money?',
    neutralChallenge: 'How do we improve operational efficiency while preserving human judgment, empathy, and student agency?',
    classification: 'problem_in_polarity',
    immediateProblem: 'Deploy an automated chatbot for initial student FAQ resolution.',
    largerPolarity: 'Balancing automated efficiency with empathetic human support.',
    polarityMap: {
      poleL: {
        name: 'Automation & Efficiency',
        upsides: [
          '24/7 instant response times for common student inquiries',
          'Reduced administrative workload for staff',
          'Lower cost per interaction and scalable support'
        ],
        downsides: [
          'Frustrating dead-ends for complex student edge cases',
          'Loss of personal connection and empathy during crisis',
          'Exclusion of students with low digital literacy'
        ]
      },
      poleR: {
        name: 'Human Judgment & Accountability',
        upsides: [
          'Empathetic resolution of complex, highly sensitive situations',
          'Building strong student-mentor relationships',
          'Nuanced decision making and policy exception handling'
        ],
        downsides: [
          'Long wait times and long phone queues during peak registration',
          'Staff burnout and repetitive administrative burden',
          'Inconsistent advice depending on staff member availability'
        ]
      },
      sharedBestHope: 'A seamless student support system that delivers instant answers for routine tasks and dedicated warm human care when needed most.',
      sharedGreatestFear: 'An unfeeling automated wall that pushes struggling students away or an overwhelmed staff system that crashes.'
    },
    actions: [
      {
        id: 'act-4',
        action: 'Implement warm hand-off escalation from AI chatbot to human counselors',
        poleSupported: 'Both',
        owner: 'VP of Student Services',
        timing: '30 Days',
        successEvidence: '< 1 minute transition time for escalated counselor chat',
        earlyWarningIndicator: 'Increased student drop-off rate during online registration'
      }
    ]
  }
];
