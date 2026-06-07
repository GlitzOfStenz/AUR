import json
import random

subjects_pool = [
    'Computer Science & Information Systems', 'Engineering - Electrical & Electronic',
    'Engineering - Mechanical', 'Medicine', 'Business & Management Studies',
    'Accounting & Finance', 'Law & Legal Studies', 'Economics & Econometrics',
    'Chemistry', 'Materials Science', 'Mathematics', 'Physics & Astronomy',
    'Social Policy & Administration', 'Linguistics', 'Modern Languages'
]

locations = {
    'China': ['Tsinghua University', 'Peking University', 'Zhejiang University', 'Fudan University', 'Shanghai Jiao Tong University', 'University of Science and Technology of China', 'Nanjing University'],
    'Singapore': ['National University of Singapore (NUS)', 'Nanyang Technological University (NTU)', 'Singapore Management University'],
    'Hong Kong': ['The University of Hong Kong (HKU)', 'The Chinese University of Hong Kong (CUHK)', 'The Hong Kong University of Science and Technology (HKUST)', 'City University of Hong Kong', 'The Hong Kong Polytechnic University'],
    'Japan': ['The University of Tokyo', 'Kyoto University', 'Tokyo Institute of Technology', 'Osaka University', 'Tohoku University'],
    'South Korea': ['Seoul National University', 'KAIST - Korea Advanced Institute of Science & Technology', 'Yonsei University', 'Korea University', 'Pohang University of Science and Technology (POSTECH)'],
    'Taiwan': ['National Taiwan University (NTU)', 'National Tsing Hua University', 'National Cheng Kung University', 'National Yang Ming Chiao Tung University'],
    'Malaysia': ['Universiti Malaya (UM)', 'Universiti Sains Malaysia (USM)', 'Universiti Putra Malaysia (UPM)', 'Universiti Kebangsaan Malaysia (UKM)', 'Universiti Teknologi Malaysia'],
    'India': ['Indian Institute of Technology Bombay (IITB)', 'Indian Institute of Technology Delhi (IITD)', 'Indian Institute of Science (IISc)', 'Indian Institute of Technology Kharagpur (IIT-KGP)', 'Indian Institute of Technology Kanpur (IITK)'],
    'Thailand': ['Chulalongkorn University', 'Mahidol University'],
    'Indonesia': ['Universitas Indonesia', 'Gadjah Mada University', 'Bandung Institute of Technology (ITB)'],
    'Uzbekistan': ['Tashkent State Technical University', 'National University of Uzbekistan', 'Samarkand State Medical University', 'Tashkent Medical Academy']
}

universities = []
id_counter = 1

for loc, unis in locations.items():
    for name in unis:
        overall = random.uniform(70.0, 99.5) if loc in ['Singapore', 'China', 'Hong Kong', 'Japan', 'South Korea'] else random.uniform(50.0, 85.0)
        
        has_med = 'Medical' in name or random.random() > 0.4
        
        num_subjects = random.randint(3, 8)
        uni_subjects = random.sample(subjects_pool, num_subjects)
        if has_med and 'Medicine' not in uni_subjects:
            uni_subjects.append('Medicine')
            
        qs_rankings = []
        for sub in uni_subjects:
            world_rank = random.randint(1, 50) if overall > 90 else (random.randint(51, 150) if overall > 80 else random.randint(151, 500))
            rank_str = str(world_rank) if world_rank <= 50 else f"{world_rank - (world_rank%50)}-{world_rank - (world_rank%50) + 50}"
            qs_rankings.append({
                'subject': sub,
                'worldRank': rank_str,
                'score': round(random.uniform(overall - 10, min(100, overall + 5)), 1)
            })
            
        simple_subs = []
        for sub in uni_subjects:
            if 'Engineering' in sub or 'Computer' in sub: simple_subs.append('Engineering')
            elif 'Medicine' in sub: simple_subs.append('Medicine')
            elif 'Business' in sub or 'Accounting' in sub or 'Economics' in sub: simple_subs.append('Business')
            elif 'Law' in sub or 'Social' in sub: simple_subs.append('Social Sciences')
            elif 'Chemistry' in sub or 'Physics' in sub or 'Math' in sub or 'Materials' in sub: simple_subs.append('Sciences')
            else: simple_subs.append('Humanities')
            
        domain_name = name.lower().replace(' ', '').replace('university', 'edu').replace('institute', 'ac').replace('(', '').replace(')', '').replace('-', '')
        website = f"https://www.{domain_name}.edu"
        
        # A curated list of high-quality academic/campus photos from Unsplash
        photo_pool = [
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?auto=format&fit=crop&w=800&q=80'
        ]

        universities.append({
            'id': f'uni_{id_counter}',
            'name': name,
            'location': loc,
            'overall': round(overall, 1),
            'citations': round(random.uniform(overall-15, 100), 1),
            'employability': round(random.uniform(overall-10, 100), 1),
            'intlStudents': round(random.uniform(30, 100), 1),
            'teaching': round(random.uniform(overall-15, 100), 1),
            'research': round(random.uniform(overall-15, 100), 1),
            'academicReputation': round(random.uniform(overall-5, 100), 1),
            'employerReputation': round(random.uniform(overall-5, 100), 1),
            'facultyStudentRatio': round(random.uniform(50, 100), 1),
            'subjects': list(set(simple_subs)),
            'languages': ['English', 'Local Language'] if loc not in ['Singapore', 'India', 'Malaysia'] else ['English'],
            'tuition': f'${random.randint(3, 35)},000/year',
            'description': f'{name} is a premier institution located in {loc}. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.',
            'history': [round(random.uniform(1, 100)) for _ in range(5)],
            'programs': ['BSc Computer Science', 'MSc Artificial Intelligence', 'Global MBA', 'PhD Engineering'] if not has_med else ['MBBS / MD Medicine', 'BSc Biomedical Sciences', 'MSc Global Health'],
            'campusPhoto': random.choice(photo_pool),
            'website': website,
            'hasMedicine': has_med,
            'qsSubjectRankings': qs_rankings
        })
        id_counter += 1

with open('d:/yci/AUR/src/app/data.ts', 'w', encoding='utf-8') as f:
    f.write('export interface University {\n')
    f.write('  id: string;\n')
    f.write('  name: string;\n')
    f.write('  location: string;\n')
    f.write('  overall: number;\n')
    f.write('  citations: number;\n')
    f.write('  employability: number;\n')
    f.write('  intlStudents: number;\n')
    f.write('  teaching: number;\n')
    f.write('  research: number;\n')
    f.write('  academicReputation?: number;\n')
    f.write('  employerReputation?: number;\n')
    f.write('  facultyStudentRatio?: number;\n')
    f.write('  subjects: string[];\n')
    f.write('  languages: string[];\n')
    f.write('  tuition: string;\n')
    f.write('  description: string;\n')
    f.write('  history: number[];\n')
    f.write('  programs: string[];\n')
    f.write('  campusPhoto: string;\n')
    f.write('  website: string;\n')
    f.write('  hasMedicine: boolean;\n')
    f.write('  qsSubjectRankings?: {\n')
    f.write('    subject: string;\n')
    f.write('    worldRank: string;\n')
    f.write('    score: number;\n')
    f.write('  }[];\n')
    f.write('}\n\n')
    f.write('export const MOCK_UNIVERSITIES: University[] = ' + json.dumps(universities, indent=2) + ';\n\n')
    f.write('export interface Article { id: string; title: string; subtitle: string; contentSummary: string; image: string; source: string; date: string; }\n')
    f.write('export const FEATURED_ARTICLES: Article[] = [\n')
    f.write('  {\n')
    f.write('    id: "art_1",\n')
    f.write('    title: "QS World University Rankings by Subject 2026: The Asian Surge",\n')
    f.write('    subtitle: "STEM subjects reach historic highs in East and Central Asian universities.",\n')
    f.write('    contentSummary: "Asian universities are breaking historical records in STEM rankings, driving massive growth in local research and citations.",\n')
    f.write('    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",\n')
    f.write('    source: "QS Intelligence Unit",\n')
    f.write('    date: "June 2026"\n')
    f.write('  },\n')
    f.write('  {\n')
    f.write('    id: "art_2",\n')
    f.write('    title: "Employer Reputation Index: What Top Tech Firms Want",\n')
    f.write('    subtitle: "Analyzing graduate employability metrics across the C9 League and NUS.",\n')
    f.write('    contentSummary: "Employability metrics are shifting towards project-based research and international internships. Leading institutions respond.",\n')
    f.write('    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",\n')
    f.write('    source: "Global Careers Report",\n')
    f.write('    date: "May 2026"\n')
    f.write('  },\n')
    f.write('  {\n')
    f.write('    id: "art_3",\n')
    f.write('    title: "Central Asian Healthcare Standards & Medical Licensing",\n')
    f.write('    subtitle: "Auditing Samarkand and Tashkent medical curriculums for global eligibility.",\n')
    f.write('    contentSummary: "Central Asian medical universities are adopting standardized English curriculums to boost international licensing pass rates.",\n')
    f.write('    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",\n')
    f.write('    source: "Medical Education Hub",\n')
    f.write('    date: "April 2026"\n')
    f.write('  }\n')
    f.write('];\n')
