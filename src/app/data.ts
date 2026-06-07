export interface University {
  id: string;
  name: string;
  location: string;
  overall: number;
  citations: number;
  employability: number;
  intlStudents: number;
  teaching: number;
  research: number;
  academicReputation?: number;
  employerReputation?: number;
  facultyStudentRatio?: number;
  subjects: string[];
  languages: string[];
  tuition: string;
  description: string;
  history: number[];
  programs: string[];
  campusPhoto: string;
  website: string;
  hasMedicine: boolean;
  qsSubjectRankings?: {
    subject: string;
    worldRank: string;
    score: number;
  }[];
}

export const MOCK_UNIVERSITIES: University[] = [
  {
    "id": "uni_1",
    "name": "Tsinghua University",
    "location": "China",
    "overall": 70.5,
    "citations": 69.7,
    "employability": 71.5,
    "intlStudents": 36.4,
    "teaching": 64.8,
    "research": 93.4,
    "academicReputation": 94.7,
    "employerReputation": 76.5,
    "facultyStudentRatio": 60.4,
    "subjects": [
      "Business",
      "Medicine",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$20,000/year",
    "description": "Tsinghua University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      86,
      55,
      71,
      6,
      25
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.tsinghuaedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Chemistry",
        "worldRank": "150-200",
        "score": 61.6
      },
      {
        "subject": "Materials Science",
        "worldRank": "200-250",
        "score": 72.9
      },
      {
        "subject": "Medicine",
        "worldRank": "150-200",
        "score": 60.7
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "400-450",
        "score": 74.8
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "350-400",
        "score": 74.3
      }
    ]
  },
  {
    "id": "uni_2",
    "name": "Peking University",
    "location": "China",
    "overall": 92.8,
    "citations": 98.1,
    "employability": 97.4,
    "intlStudents": 59.3,
    "teaching": 93.4,
    "research": 98.3,
    "academicReputation": 99.2,
    "employerReputation": 93.7,
    "facultyStudentRatio": 70.7,
    "subjects": [
      "Business",
      "Medicine",
      "Humanities",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$23,000/year",
    "description": "Peking University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      33,
      49,
      41,
      8,
      15
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.pekingedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Modern Languages",
        "worldRank": "4",
        "score": 93.5
      },
      {
        "subject": "Linguistics",
        "worldRank": "25",
        "score": 94.4
      },
      {
        "subject": "Medicine",
        "worldRank": "25",
        "score": 92.8
      },
      {
        "subject": "Mathematics",
        "worldRank": "18",
        "score": 93.7
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "20",
        "score": 90.1
      },
      {
        "subject": "Chemistry",
        "worldRank": "35",
        "score": 88.3
      }
    ]
  },
  {
    "id": "uni_3",
    "name": "Zhejiang University",
    "location": "China",
    "overall": 77.3,
    "citations": 75.7,
    "employability": 98.5,
    "intlStudents": 79.4,
    "teaching": 94.3,
    "research": 98.1,
    "academicReputation": 95.3,
    "employerReputation": 85.4,
    "facultyStudentRatio": 71.3,
    "subjects": [
      "Engineering",
      "Medicine",
      "Humanities",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "Zhejiang University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      49,
      90,
      90,
      50,
      47
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.zhejiangedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Linguistics",
        "worldRank": "250-300",
        "score": 74.5
      },
      {
        "subject": "Chemistry",
        "worldRank": "350-400",
        "score": 71.5
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "300-350",
        "score": 79.7
      },
      {
        "subject": "Mathematics",
        "worldRank": "400-450",
        "score": 72.5
      },
      {
        "subject": "Medicine",
        "worldRank": "300-350",
        "score": 79.7
      }
    ]
  },
  {
    "id": "uni_4",
    "name": "Fudan University",
    "location": "China",
    "overall": 81.4,
    "citations": 92.6,
    "employability": 96.0,
    "intlStudents": 58.0,
    "teaching": 70.0,
    "research": 76.3,
    "academicReputation": 96.8,
    "employerReputation": 79.8,
    "facultyStudentRatio": 55.8,
    "subjects": [
      "Medicine",
      "Sciences",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$14,000/year",
    "description": "Fudan University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      50,
      50,
      94,
      32,
      92
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.fudanedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "50-100",
        "score": 84.6
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "100-150",
        "score": 73.4
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "50-100",
        "score": 79.6
      },
      {
        "subject": "Medicine",
        "worldRank": "50-100",
        "score": 84.9
      },
      {
        "subject": "Chemistry",
        "worldRank": "100-150",
        "score": 80.0
      }
    ]
  },
  {
    "id": "uni_5",
    "name": "Shanghai Jiao Tong University",
    "location": "China",
    "overall": 92.6,
    "citations": 95.6,
    "employability": 89.5,
    "intlStudents": 74.1,
    "teaching": 94.0,
    "research": 90.5,
    "academicReputation": 99.1,
    "employerReputation": 96.9,
    "facultyStudentRatio": 58.7,
    "subjects": [
      "Business",
      "Humanities",
      "Medicine",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$13,000/year",
    "description": "Shanghai Jiao Tong University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      59,
      7,
      6,
      56,
      31
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.shanghaijiaotongedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Modern Languages",
        "worldRank": "8",
        "score": 84.8
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "6",
        "score": 94.0
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "12",
        "score": 88.2
      },
      {
        "subject": "Medicine",
        "worldRank": "27",
        "score": 87.0
      }
    ]
  },
  {
    "id": "uni_6",
    "name": "University of Science and Technology of China",
    "location": "China",
    "overall": 70.6,
    "citations": 71.7,
    "employability": 67.9,
    "intlStudents": 58.3,
    "teaching": 88.5,
    "research": 75.2,
    "academicReputation": 82.5,
    "employerReputation": 94.0,
    "facultyStudentRatio": 94.7,
    "subjects": [
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$14,000/year",
    "description": "University of Science and Technology of China is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      35,
      97,
      54,
      50,
      80
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.eduofscienceandtechnologyofchina.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Economics & Econometrics",
        "worldRank": "250-300",
        "score": 69.7
      },
      {
        "subject": "Modern Languages",
        "worldRank": "400-450",
        "score": 73.1
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "250-300",
        "score": 71.3
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "400-450",
        "score": 69.1
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "250-300",
        "score": 70.7
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "250-300",
        "score": 72.1
      }
    ]
  },
  {
    "id": "uni_7",
    "name": "Nanjing University",
    "location": "China",
    "overall": 89.6,
    "citations": 92.4,
    "employability": 85.9,
    "intlStudents": 81.8,
    "teaching": 76.8,
    "research": 83.0,
    "academicReputation": 93.5,
    "employerReputation": 87.6,
    "facultyStudentRatio": 87.2,
    "subjects": [
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$4,000/year",
    "description": "Nanjing University is a premier institution located in China. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      59,
      81,
      55,
      61,
      44
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nanjingedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "50-100",
        "score": 84.8
      },
      {
        "subject": "Materials Science",
        "worldRank": "50-100",
        "score": 90.6
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "50-100",
        "score": 81.7
      }
    ]
  },
  {
    "id": "uni_8",
    "name": "National University of Singapore (NUS)",
    "location": "Singapore",
    "overall": 70.9,
    "citations": 59.7,
    "employability": 80.0,
    "intlStudents": 50.4,
    "teaching": 97.1,
    "research": 86.6,
    "academicReputation": 85.9,
    "employerReputation": 87.4,
    "facultyStudentRatio": 82.3,
    "subjects": [
      "Medicine",
      "Sciences",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$12,000/year",
    "description": "National University of Singapore (NUS) is a premier institution located in Singapore. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      51,
      7,
      98,
      51,
      68
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationaleduofsingaporenus.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "450-500",
        "score": 64.3
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "150-200",
        "score": 62.8
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "200-250",
        "score": 73.6
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "200-250",
        "score": 66.5
      },
      {
        "subject": "Chemistry",
        "worldRank": "150-200",
        "score": 66.3
      },
      {
        "subject": "Medicine",
        "worldRank": "150-200",
        "score": 75.3
      }
    ]
  },
  {
    "id": "uni_9",
    "name": "Nanyang Technological University (NTU)",
    "location": "Singapore",
    "overall": 90.7,
    "citations": 90.0,
    "employability": 90.8,
    "intlStudents": 85.0,
    "teaching": 76.3,
    "research": 82.8,
    "academicReputation": 90.8,
    "employerReputation": 93.5,
    "facultyStudentRatio": 55.6,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$24,000/year",
    "description": "Nanyang Technological University (NTU) is a premier institution located in Singapore. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      77,
      98,
      41,
      67,
      8
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nanyangtechnologicaleduntu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Chemistry",
        "worldRank": "30",
        "score": 85.7
      },
      {
        "subject": "Materials Science",
        "worldRank": "24",
        "score": 93.7
      },
      {
        "subject": "Modern Languages",
        "worldRank": "43",
        "score": 82.5
      },
      {
        "subject": "Mathematics",
        "worldRank": "11",
        "score": 92.5
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "35",
        "score": 84.2
      },
      {
        "subject": "Medicine",
        "worldRank": "30",
        "score": 92.8
      }
    ]
  },
  {
    "id": "uni_10",
    "name": "Singapore Management University",
    "location": "Singapore",
    "overall": 91.4,
    "citations": 98.4,
    "employability": 91.0,
    "intlStudents": 60.0,
    "teaching": 94.6,
    "research": 86.2,
    "academicReputation": 98.1,
    "employerReputation": 98.6,
    "facultyStudentRatio": 91.5,
    "subjects": [
      "Medicine",
      "Business",
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$3,000/year",
    "description": "Singapore Management University is a premier institution located in Singapore. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      72,
      90,
      12,
      74,
      23
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.singaporemanagementedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "13",
        "score": 86.5
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "14",
        "score": 90.4
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "38",
        "score": 83.4
      },
      {
        "subject": "Materials Science",
        "worldRank": "25",
        "score": 83.0
      },
      {
        "subject": "Medicine",
        "worldRank": "15",
        "score": 91.4
      }
    ]
  },
  {
    "id": "uni_11",
    "name": "The University of Hong Kong (HKU)",
    "location": "Hong Kong",
    "overall": 71.4,
    "citations": 82.8,
    "employability": 100.0,
    "intlStudents": 68.8,
    "teaching": 75.9,
    "research": 67.8,
    "academicReputation": 76.3,
    "employerReputation": 92.7,
    "facultyStudentRatio": 89.2,
    "subjects": [
      "Engineering",
      "Medicine",
      "Business",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "The University of Hong Kong (HKU) is a premier institution located in Hong Kong. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      27,
      86,
      7,
      23,
      8
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.theeduofhongkonghku.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Economics & Econometrics",
        "worldRank": "250-300",
        "score": 62.1
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "250-300",
        "score": 68.6
      },
      {
        "subject": "Medicine",
        "worldRank": "150-200",
        "score": 74.8
      },
      {
        "subject": "Materials Science",
        "worldRank": "400-450",
        "score": 73.1
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "400-450",
        "score": 66.0
      }
    ]
  },
  {
    "id": "uni_12",
    "name": "The Chinese University of Hong Kong (CUHK)",
    "location": "Hong Kong",
    "overall": 76.0,
    "citations": 89.6,
    "employability": 67.9,
    "intlStudents": 57.9,
    "teaching": 90.5,
    "research": 85.3,
    "academicReputation": 88.9,
    "employerReputation": 78.4,
    "facultyStudentRatio": 52.6,
    "subjects": [
      "Medicine",
      "Sciences",
      "Social Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$35,000/year",
    "description": "The Chinese University of Hong Kong (CUHK) is a premier institution located in Hong Kong. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      49,
      79,
      12,
      73,
      80
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.thechineseeduofhongkongcuhk.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Law & Legal Studies",
        "worldRank": "400-450",
        "score": 76.3
      },
      {
        "subject": "Chemistry",
        "worldRank": "450-500",
        "score": 67.8
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "200-250",
        "score": 74.1
      },
      {
        "subject": "Medicine",
        "worldRank": "150-200",
        "score": 67.1
      }
    ]
  },
  {
    "id": "uni_13",
    "name": "The Hong Kong University of Science and Technology (HKUST)",
    "location": "Hong Kong",
    "overall": 91.0,
    "citations": 84.0,
    "employability": 92.6,
    "intlStudents": 76.7,
    "teaching": 97.3,
    "research": 83.2,
    "academicReputation": 89.4,
    "employerReputation": 92.0,
    "facultyStudentRatio": 71.2,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Business",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$31,000/year",
    "description": "The Hong Kong University of Science and Technology (HKUST) is a premier institution located in Hong Kong. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      38,
      96,
      43,
      70,
      30
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.thehongkongeduofscienceandtechnologyhkust.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Medicine",
        "worldRank": "24",
        "score": 89.4
      },
      {
        "subject": "Mathematics",
        "worldRank": "29",
        "score": 87.8
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "19",
        "score": 81.8
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "25",
        "score": 94.0
      },
      {
        "subject": "Modern Languages",
        "worldRank": "31",
        "score": 93.6
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "42",
        "score": 91.2
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "17",
        "score": 84.4
      }
    ]
  },
  {
    "id": "uni_14",
    "name": "City University of Hong Kong",
    "location": "Hong Kong",
    "overall": 97.5,
    "citations": 86.8,
    "employability": 94.9,
    "intlStudents": 77.8,
    "teaching": 97.4,
    "research": 87.4,
    "academicReputation": 95.5,
    "employerReputation": 96.9,
    "facultyStudentRatio": 85.8,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$25,000/year",
    "description": "City University of Hong Kong is a premier institution located in Hong Kong. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      5,
      3,
      49,
      99,
      11
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.cityeduofhongkong.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Medicine",
        "worldRank": "11",
        "score": 87.7
      },
      {
        "subject": "Modern Languages",
        "worldRank": "26",
        "score": 87.5
      },
      {
        "subject": "Linguistics",
        "worldRank": "47",
        "score": 95.2
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "49",
        "score": 88.3
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "23",
        "score": 93.1
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "25",
        "score": 99.3
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "18",
        "score": 99.4
      }
    ]
  },
  {
    "id": "uni_15",
    "name": "The Hong Kong Polytechnic University",
    "location": "Hong Kong",
    "overall": 83.6,
    "citations": 88.7,
    "employability": 75.4,
    "intlStudents": 92.4,
    "teaching": 80.0,
    "research": 78.4,
    "academicReputation": 80.8,
    "employerReputation": 92.8,
    "facultyStudentRatio": 56.6,
    "subjects": [
      "Business",
      "Humanities",
      "Medicine",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$25,000/year",
    "description": "The Hong Kong Polytechnic University is a premier institution located in Hong Kong. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      36,
      72,
      29,
      59,
      48
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.thehongkongpolytechnicedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Linguistics",
        "worldRank": "50-100",
        "score": 81.4
      },
      {
        "subject": "Mathematics",
        "worldRank": "50-100",
        "score": 88.0
      },
      {
        "subject": "Materials Science",
        "worldRank": "100-150",
        "score": 82.9
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "100-150",
        "score": 79.4
      },
      {
        "subject": "Modern Languages",
        "worldRank": "100-150",
        "score": 73.7
      },
      {
        "subject": "Medicine",
        "worldRank": "50-100",
        "score": 73.7
      }
    ]
  },
  {
    "id": "uni_16",
    "name": "The University of Tokyo",
    "location": "Japan",
    "overall": 74.4,
    "citations": 85.9,
    "employability": 83.0,
    "intlStudents": 91.1,
    "teaching": 90.0,
    "research": 84.8,
    "academicReputation": 82.0,
    "employerReputation": 79.0,
    "facultyStudentRatio": 67.7,
    "subjects": [
      "Medicine",
      "Business",
      "Sciences",
      "Humanities"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$14,000/year",
    "description": "The University of Tokyo is a premier institution located in Japan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      29,
      87,
      57,
      79,
      51
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.theeduoftokyo.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Chemistry",
        "worldRank": "450-500",
        "score": 77.3
      },
      {
        "subject": "Modern Languages",
        "worldRank": "200-250",
        "score": 65.2
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "350-400",
        "score": 64.6
      },
      {
        "subject": "Medicine",
        "worldRank": "150-200",
        "score": 76.8
      }
    ]
  },
  {
    "id": "uni_17",
    "name": "Kyoto University",
    "location": "Japan",
    "overall": 93.4,
    "citations": 89.1,
    "employability": 91.0,
    "intlStudents": 72.6,
    "teaching": 84.5,
    "research": 88.6,
    "academicReputation": 90.1,
    "employerReputation": 89.9,
    "facultyStudentRatio": 69.2,
    "subjects": [
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$18,000/year",
    "description": "Kyoto University is a premier institution located in Japan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      88,
      23,
      24,
      6,
      69
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.kyotoedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Materials Science",
        "worldRank": "27",
        "score": 86.8
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "15",
        "score": 89.6
      },
      {
        "subject": "Mathematics",
        "worldRank": "37",
        "score": 87.3
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "31",
        "score": 89.6
      }
    ]
  },
  {
    "id": "uni_18",
    "name": "Tokyo Institute of Technology",
    "location": "Japan",
    "overall": 97.9,
    "citations": 86.7,
    "employability": 95.5,
    "intlStudents": 68.8,
    "teaching": 92.6,
    "research": 83.9,
    "academicReputation": 98.2,
    "employerReputation": 95.4,
    "facultyStudentRatio": 59.8,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "Tokyo Institute of Technology is a premier institution located in Japan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      75,
      17,
      56,
      95,
      94
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.tokyoacoftechnology.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Modern Languages",
        "worldRank": "49",
        "score": 90.4
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "18",
        "score": 96.2
      },
      {
        "subject": "Chemistry",
        "worldRank": "17",
        "score": 91.2
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "6",
        "score": 95.2
      },
      {
        "subject": "Medicine",
        "worldRank": "4",
        "score": 89.9
      },
      {
        "subject": "Materials Science",
        "worldRank": "19",
        "score": 93.7
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "43",
        "score": 90.7
      },
      {
        "subject": "Mathematics",
        "worldRank": "34",
        "score": 96.6
      }
    ]
  },
  {
    "id": "uni_19",
    "name": "Osaka University",
    "location": "Japan",
    "overall": 97.2,
    "citations": 95.7,
    "employability": 88.2,
    "intlStudents": 78.9,
    "teaching": 94.9,
    "research": 94.7,
    "academicReputation": 95.3,
    "employerReputation": 97.4,
    "facultyStudentRatio": 70.3,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$5,000/year",
    "description": "Osaka University is a premier institution located in Japan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      92,
      7,
      23,
      62,
      89
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.osakaedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Medicine",
        "worldRank": "31",
        "score": 98.7
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "41",
        "score": 100.0
      },
      {
        "subject": "Materials Science",
        "worldRank": "21",
        "score": 95.1
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "9",
        "score": 91.7
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "41",
        "score": 92.4
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "42",
        "score": 89.3
      },
      {
        "subject": "Linguistics",
        "worldRank": "3",
        "score": 99.8
      },
      {
        "subject": "Chemistry",
        "worldRank": "49",
        "score": 88.6
      }
    ]
  },
  {
    "id": "uni_20",
    "name": "Tohoku University",
    "location": "Japan",
    "overall": 88.7,
    "citations": 79.1,
    "employability": 96.8,
    "intlStudents": 48.5,
    "teaching": 78.4,
    "research": 76.0,
    "academicReputation": 99.2,
    "employerReputation": 95.6,
    "facultyStudentRatio": 74.1,
    "subjects": [
      "Medicine",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$16,000/year",
    "description": "Tohoku University is a premier institution located in Japan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      35,
      8,
      70,
      75,
      48
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.tohokuedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "50-100",
        "score": 91.8
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "100-150",
        "score": 79.8
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "100-150",
        "score": 80.2
      },
      {
        "subject": "Chemistry",
        "worldRank": "150-200",
        "score": 87.2
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "100-150",
        "score": 85.5
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "50-100",
        "score": 81.4
      },
      {
        "subject": "Mathematics",
        "worldRank": "50-100",
        "score": 89.2
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "100-150",
        "score": 90.4
      },
      {
        "subject": "Medicine",
        "worldRank": "50-100",
        "score": 93.7
      }
    ]
  },
  {
    "id": "uni_21",
    "name": "Seoul National University",
    "location": "South Korea",
    "overall": 97.9,
    "citations": 95.5,
    "employability": 99.9,
    "intlStudents": 66.5,
    "teaching": 94.9,
    "research": 98.7,
    "academicReputation": 95.1,
    "employerReputation": 95.7,
    "facultyStudentRatio": 99.2,
    "subjects": [
      "Business",
      "Sciences",
      "Humanities"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$24,000/year",
    "description": "Seoul National University is a premier institution located in South Korea. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      7,
      54,
      17,
      46,
      43
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.seoulnationaledu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Mathematics",
        "worldRank": "31",
        "score": 95.0
      },
      {
        "subject": "Modern Languages",
        "worldRank": "45",
        "score": 93.3
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "38",
        "score": 88.6
      }
    ]
  },
  {
    "id": "uni_22",
    "name": "KAIST - Korea Advanced Institute of Science & Technology",
    "location": "South Korea",
    "overall": 89.5,
    "citations": 80.2,
    "employability": 92.4,
    "intlStudents": 37.9,
    "teaching": 88.1,
    "research": 78.2,
    "academicReputation": 98.4,
    "employerReputation": 88.2,
    "facultyStudentRatio": 90.0,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "KAIST - Korea Advanced Institute of Science & Technology is a premier institution located in South Korea. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      53,
      25,
      67,
      95,
      36
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.kaistkoreaadvancedacofscience&technology.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Linguistics",
        "worldRank": "50-100",
        "score": 79.6
      },
      {
        "subject": "Medicine",
        "worldRank": "100-150",
        "score": 87.8
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "50-100",
        "score": 94.4
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "100-150",
        "score": 93.8
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "100-150",
        "score": 92.1
      },
      {
        "subject": "Mathematics",
        "worldRank": "50-100",
        "score": 88.7
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "100-150",
        "score": 88.8
      }
    ]
  },
  {
    "id": "uni_23",
    "name": "Yonsei University",
    "location": "South Korea",
    "overall": 92.0,
    "citations": 88.8,
    "employability": 99.3,
    "intlStudents": 33.4,
    "teaching": 91.3,
    "research": 88.8,
    "academicReputation": 99.2,
    "employerReputation": 89.9,
    "facultyStudentRatio": 53.4,
    "subjects": [
      "Business",
      "Sciences",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$6,000/year",
    "description": "Yonsei University is a premier institution located in South Korea. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      83,
      58,
      3,
      47,
      62
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.yonseiedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Materials Science",
        "worldRank": "28",
        "score": 83.9
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "29",
        "score": 89.8
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "2",
        "score": 85.1
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "39",
        "score": 88.0
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "10",
        "score": 85.8
      }
    ]
  },
  {
    "id": "uni_24",
    "name": "Korea University",
    "location": "South Korea",
    "overall": 78.7,
    "citations": 76.9,
    "employability": 96.0,
    "intlStudents": 76.0,
    "teaching": 68.8,
    "research": 90.6,
    "academicReputation": 88.3,
    "employerReputation": 73.9,
    "facultyStudentRatio": 56.2,
    "subjects": [
      "Medicine",
      "Business",
      "Humanities",
      "Social Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "Korea University is a premier institution located in South Korea. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      43,
      70,
      2,
      9,
      74
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.koreaedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Social Policy & Administration",
        "worldRank": "250-300",
        "score": 69.3
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "200-250",
        "score": 80.1
      },
      {
        "subject": "Modern Languages",
        "worldRank": "300-350",
        "score": 80.4
      },
      {
        "subject": "Medicine",
        "worldRank": "300-350",
        "score": 77.8
      }
    ]
  },
  {
    "id": "uni_25",
    "name": "Pohang University of Science and Technology (POSTECH)",
    "location": "South Korea",
    "overall": 97.3,
    "citations": 86.8,
    "employability": 91.8,
    "intlStudents": 58.4,
    "teaching": 90.2,
    "research": 84.1,
    "academicReputation": 98.1,
    "employerReputation": 92.4,
    "facultyStudentRatio": 51.1,
    "subjects": [
      "Medicine",
      "Humanities",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$10,000/year",
    "description": "Pohang University of Science and Technology (POSTECH) is a premier institution located in South Korea. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      82,
      51,
      28,
      98,
      79
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.pohangeduofscienceandtechnologypostech.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Business & Management Studies",
        "worldRank": "18",
        "score": 99.7
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "18",
        "score": 96.9
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "41",
        "score": 94.3
      },
      {
        "subject": "Modern Languages",
        "worldRank": "49",
        "score": 95.0
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "23",
        "score": 98.9
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "42",
        "score": 99.0
      },
      {
        "subject": "Medicine",
        "worldRank": "39",
        "score": 99.6
      }
    ]
  },
  {
    "id": "uni_26",
    "name": "National Taiwan University (NTU)",
    "location": "Taiwan",
    "overall": 56.7,
    "citations": 93.6,
    "employability": 72.6,
    "intlStudents": 30.2,
    "teaching": 87.2,
    "research": 74.4,
    "academicReputation": 89.7,
    "employerReputation": 69.4,
    "facultyStudentRatio": 90.7,
    "subjects": [
      "Medicine",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$25,000/year",
    "description": "National Taiwan University (NTU) is a premier institution located in Taiwan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      87,
      84,
      32,
      49,
      59
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationaltaiwaneduntu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Law & Legal Studies",
        "worldRank": "150-200",
        "score": 57.0
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "350-400",
        "score": 57.4
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "400-450",
        "score": 49.1
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "300-350",
        "score": 53.9
      },
      {
        "subject": "Medicine",
        "worldRank": "250-300",
        "score": 52.5
      }
    ]
  },
  {
    "id": "uni_27",
    "name": "National Tsing Hua University",
    "location": "Taiwan",
    "overall": 83.0,
    "citations": 97.2,
    "employability": 78.1,
    "intlStudents": 91.4,
    "teaching": 79.3,
    "research": 73.3,
    "academicReputation": 99.9,
    "employerReputation": 97.3,
    "facultyStudentRatio": 74.8,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$21,000/year",
    "description": "National Tsing Hua University is a premier institution located in Taiwan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      92,
      21,
      3,
      22,
      14
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationaltsinghuaedu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "50-100",
        "score": 78.0
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "100-150",
        "score": 77.0
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "100-150",
        "score": 87.1
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "100-150",
        "score": 84.1
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "100-150",
        "score": 81.2
      },
      {
        "subject": "Materials Science",
        "worldRank": "100-150",
        "score": 77.9
      },
      {
        "subject": "Linguistics",
        "worldRank": "50-100",
        "score": 83.1
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "100-150",
        "score": 83.4
      },
      {
        "subject": "Medicine",
        "worldRank": "100-150",
        "score": 85.4
      }
    ]
  },
  {
    "id": "uni_28",
    "name": "National Cheng Kung University",
    "location": "Taiwan",
    "overall": 64.9,
    "citations": 61.2,
    "employability": 89.2,
    "intlStudents": 76.5,
    "teaching": 58.3,
    "research": 55.8,
    "academicReputation": 89.3,
    "employerReputation": 81.0,
    "facultyStudentRatio": 99.9,
    "subjects": [
      "Business",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$17,000/year",
    "description": "National Cheng Kung University is a premier institution located in Taiwan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      31,
      7,
      62,
      38,
      27
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationalchengkungedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Materials Science",
        "worldRank": "350-400",
        "score": 64.3
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "200-250",
        "score": 67.1
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "200-250",
        "score": 65.8
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "200-250",
        "score": 55.7
      }
    ]
  },
  {
    "id": "uni_29",
    "name": "National Yang Ming Chiao Tung University",
    "location": "Taiwan",
    "overall": 58.2,
    "citations": 89.6,
    "employability": 86.0,
    "intlStudents": 57.9,
    "teaching": 95.3,
    "research": 45.5,
    "academicReputation": 73.2,
    "employerReputation": 71.8,
    "facultyStudentRatio": 98.6,
    "subjects": [
      "Business",
      "Humanities",
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$29,000/year",
    "description": "National Yang Ming Chiao Tung University is a premier institution located in Taiwan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      4,
      81,
      100,
      23,
      89
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationalyangmingchiaotungedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "350-400",
        "score": 48.4
      },
      {
        "subject": "Linguistics",
        "worldRank": "250-300",
        "score": 58.8
      },
      {
        "subject": "Chemistry",
        "worldRank": "300-350",
        "score": 51.0
      },
      {
        "subject": "Materials Science",
        "worldRank": "200-250",
        "score": 49.1
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "200-250",
        "score": 57.4
      },
      {
        "subject": "Modern Languages",
        "worldRank": "200-250",
        "score": 62.6
      },
      {
        "subject": "Mathematics",
        "worldRank": "450-500",
        "score": 55.2
      }
    ]
  },
  {
    "id": "uni_30",
    "name": "Universiti Malaya (UM)",
    "location": "Malaysia",
    "overall": 62.9,
    "citations": 96.1,
    "employability": 61.5,
    "intlStudents": 95.0,
    "teaching": 65.5,
    "research": 64.8,
    "academicReputation": 68.3,
    "employerReputation": 68.8,
    "facultyStudentRatio": 50.2,
    "subjects": [
      "Medicine",
      "Humanities",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$34,000/year",
    "description": "Universiti Malaya (UM) is a premier institution located in Malaysia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      4,
      42,
      52,
      91,
      72
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universitimalayaum.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Medicine",
        "worldRank": "300-350",
        "score": 58.0
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "300-350",
        "score": 53.4
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "350-400",
        "score": 58.1
      },
      {
        "subject": "Linguistics",
        "worldRank": "300-350",
        "score": 54.0
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "300-350",
        "score": 61.9
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "350-400",
        "score": 57.1
      }
    ]
  },
  {
    "id": "uni_31",
    "name": "Universiti Sains Malaysia (USM)",
    "location": "Malaysia",
    "overall": 76.3,
    "citations": 76.6,
    "employability": 95.2,
    "intlStudents": 82.1,
    "teaching": 73.1,
    "research": 83.0,
    "academicReputation": 75.6,
    "employerReputation": 73.6,
    "facultyStudentRatio": 89.1,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$16,000/year",
    "description": "Universiti Sains Malaysia (USM) is a premier institution located in Malaysia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      92,
      27,
      48,
      31,
      16
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universitisainsmalaysiausm.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Economics & Econometrics",
        "worldRank": "350-400",
        "score": 80.5
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "300-350",
        "score": 75.7
      },
      {
        "subject": "Chemistry",
        "worldRank": "300-350",
        "score": 73.4
      },
      {
        "subject": "Modern Languages",
        "worldRank": "250-300",
        "score": 72.8
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "400-450",
        "score": 78.9
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "400-450",
        "score": 72.0
      },
      {
        "subject": "Mathematics",
        "worldRank": "400-450",
        "score": 70.5
      },
      {
        "subject": "Medicine",
        "worldRank": "450-500",
        "score": 81.2
      }
    ]
  },
  {
    "id": "uni_32",
    "name": "Universiti Putra Malaysia (UPM)",
    "location": "Malaysia",
    "overall": 73.2,
    "citations": 66.6,
    "employability": 89.5,
    "intlStudents": 97.2,
    "teaching": 87.4,
    "research": 73.0,
    "academicReputation": 98.7,
    "employerReputation": 96.4,
    "facultyStudentRatio": 51.0,
    "subjects": [
      "Business",
      "Humanities",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$22,000/year",
    "description": "Universiti Putra Malaysia (UPM) is a premier institution located in Malaysia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      93,
      60,
      5,
      20,
      14
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universitiputramalaysiaupm.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Economics & Econometrics",
        "worldRank": "450-500",
        "score": 76.0
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "200-250",
        "score": 69.4
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "350-400",
        "score": 75.2
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "350-400",
        "score": 63.7
      },
      {
        "subject": "Modern Languages",
        "worldRank": "250-300",
        "score": 78.0
      }
    ]
  },
  {
    "id": "uni_33",
    "name": "Universiti Kebangsaan Malaysia (UKM)",
    "location": "Malaysia",
    "overall": 74.2,
    "citations": 72.1,
    "employability": 80.8,
    "intlStudents": 86.3,
    "teaching": 96.1,
    "research": 85.6,
    "academicReputation": 84.0,
    "employerReputation": 92.8,
    "facultyStudentRatio": 53.1,
    "subjects": [
      "Business",
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$35,000/year",
    "description": "Universiti Kebangsaan Malaysia (UKM) is a premier institution located in Malaysia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      73,
      7,
      46,
      71,
      8
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universitikebangsaanmalaysiaukm.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Physics & Astronomy",
        "worldRank": "200-250",
        "score": 74.3
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "200-250",
        "score": 68.4
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "200-250",
        "score": 65.8
      }
    ]
  },
  {
    "id": "uni_34",
    "name": "Universiti Teknologi Malaysia",
    "location": "Malaysia",
    "overall": 65.6,
    "citations": 85.1,
    "employability": 59.9,
    "intlStudents": 60.9,
    "teaching": 82.5,
    "research": 65.3,
    "academicReputation": 91.8,
    "employerReputation": 68.1,
    "facultyStudentRatio": 61.2,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$33,000/year",
    "description": "Universiti Teknologi Malaysia is a premier institution located in Malaysia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      8,
      68,
      43,
      69,
      82
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1592284342371-3315a6760ab5?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universititeknologimalaysia.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Economics & Econometrics",
        "worldRank": "400-450",
        "score": 62.4
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "200-250",
        "score": 56.3
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "200-250",
        "score": 63.0
      },
      {
        "subject": "Linguistics",
        "worldRank": "350-400",
        "score": 65.4
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "350-400",
        "score": 58.4
      },
      {
        "subject": "Medicine",
        "worldRank": "400-450",
        "score": 61.5
      }
    ]
  },
  {
    "id": "uni_35",
    "name": "Indian Institute of Technology Bombay (IITB)",
    "location": "India",
    "overall": 78.5,
    "citations": 68.8,
    "employability": 81.7,
    "intlStudents": 73.2,
    "teaching": 67.0,
    "research": 88.8,
    "academicReputation": 90.9,
    "employerReputation": 81.5,
    "facultyStudentRatio": 61.1,
    "subjects": [
      "Medicine",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$13,000/year",
    "description": "Indian Institute of Technology Bombay (IITB) is a premier institution located in India. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      43,
      23,
      62,
      78,
      91
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.indianacoftechnologybombayiitb.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "300-350",
        "score": 81.7
      },
      {
        "subject": "Medicine",
        "worldRank": "450-500",
        "score": 81.9
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "300-350",
        "score": 69.8
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "300-350",
        "score": 68.6
      },
      {
        "subject": "Mathematics",
        "worldRank": "250-300",
        "score": 77.7
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "350-400",
        "score": 69.9
      }
    ]
  },
  {
    "id": "uni_36",
    "name": "Indian Institute of Technology Delhi (IITD)",
    "location": "India",
    "overall": 68.6,
    "citations": 69.2,
    "employability": 77.5,
    "intlStudents": 78.1,
    "teaching": 82.4,
    "research": 63.8,
    "academicReputation": 72.5,
    "employerReputation": 83.0,
    "facultyStudentRatio": 62.5,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$18,000/year",
    "description": "Indian Institute of Technology Delhi (IITD) is a premier institution located in India. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      34,
      78,
      43,
      44,
      45
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.indianacoftechnologydelhiiitd.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Social Policy & Administration",
        "worldRank": "350-400",
        "score": 69.4
      },
      {
        "subject": "Chemistry",
        "worldRank": "400-450",
        "score": 61.2
      },
      {
        "subject": "Materials Science",
        "worldRank": "200-250",
        "score": 70.6
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "350-400",
        "score": 70.3
      },
      {
        "subject": "Modern Languages",
        "worldRank": "400-450",
        "score": 71.8
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "350-400",
        "score": 63.8
      },
      {
        "subject": "Medicine",
        "worldRank": "250-300",
        "score": 66.7
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "250-300",
        "score": 64.9
      }
    ]
  },
  {
    "id": "uni_37",
    "name": "Indian Institute of Science (IISc)",
    "location": "India",
    "overall": 78.4,
    "citations": 84.7,
    "employability": 86.7,
    "intlStudents": 45.6,
    "teaching": 85.4,
    "research": 89.6,
    "academicReputation": 88.3,
    "employerReputation": 93.1,
    "facultyStudentRatio": 53.0,
    "subjects": [
      "Medicine",
      "Business",
      "Humanities"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$7,000/year",
    "description": "Indian Institute of Science (IISc) is a premier institution located in India. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      66,
      25,
      72,
      81,
      68
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.indianacofscienceiisc.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Business & Management Studies",
        "worldRank": "300-350",
        "score": 73.5
      },
      {
        "subject": "Modern Languages",
        "worldRank": "400-450",
        "score": 72.8
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "400-450",
        "score": 69.3
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "200-250",
        "score": 72.3
      },
      {
        "subject": "Medicine",
        "worldRank": "400-450",
        "score": 73.6
      }
    ]
  },
  {
    "id": "uni_38",
    "name": "Indian Institute of Technology Kharagpur (IIT-KGP)",
    "location": "India",
    "overall": 61.5,
    "citations": 50.2,
    "employability": 58.1,
    "intlStudents": 32.7,
    "teaching": 66.4,
    "research": 51.7,
    "academicReputation": 100.0,
    "employerReputation": 81.9,
    "facultyStudentRatio": 94.8,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Engineering"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$30,000/year",
    "description": "Indian Institute of Technology Kharagpur (IIT-KGP) is a premier institution located in India. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      7,
      89,
      31,
      98,
      1
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.indianacoftechnologykharagpuriitkgp.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Modern Languages",
        "worldRank": "350-400",
        "score": 53.7
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "200-250",
        "score": 56.0
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "450-500",
        "score": 53.5
      },
      {
        "subject": "Linguistics",
        "worldRank": "250-300",
        "score": 64.3
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "400-450",
        "score": 61.4
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "300-350",
        "score": 52.5
      },
      {
        "subject": "Medicine",
        "worldRank": "400-450",
        "score": 60.5
      },
      {
        "subject": "Chemistry",
        "worldRank": "300-350",
        "score": 62.1
      }
    ]
  },
  {
    "id": "uni_39",
    "name": "Indian Institute of Technology Kanpur (IITK)",
    "location": "India",
    "overall": 55.7,
    "citations": 84.3,
    "employability": 85.3,
    "intlStudents": 32.3,
    "teaching": 57.7,
    "research": 57.7,
    "academicReputation": 53.1,
    "employerReputation": 66.9,
    "facultyStudentRatio": 87.8,
    "subjects": [
      "Medicine",
      "Sciences"
    ],
    "languages": [
      "English"
    ],
    "tuition": "$18,000/year",
    "description": "Indian Institute of Technology Kanpur (IITK) is a premier institution located in India. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      87,
      19,
      9,
      17,
      67
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.indianacoftechnologykanpuriitk.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Mathematics",
        "worldRank": "300-350",
        "score": 51.2
      },
      {
        "subject": "Medicine",
        "worldRank": "400-450",
        "score": 59.0
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "250-300",
        "score": 52.4
      }
    ]
  },
  {
    "id": "uni_40",
    "name": "Chulalongkorn University",
    "location": "Thailand",
    "overall": 63.5,
    "citations": 54.0,
    "employability": 82.1,
    "intlStudents": 93.2,
    "teaching": 75.7,
    "research": 96.5,
    "academicReputation": 94.9,
    "employerReputation": 67.0,
    "facultyStudentRatio": 81.9,
    "subjects": [
      "Business",
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$13,000/year",
    "description": "Chulalongkorn University is a premier institution located in Thailand. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      52,
      10,
      28,
      61,
      27
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.chulalongkornedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Materials Science",
        "worldRank": "400-450",
        "score": 65.3
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "200-250",
        "score": 55.5
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "350-400",
        "score": 64.7
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "150-200",
        "score": 65.3
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "450-500",
        "score": 60.2
      },
      {
        "subject": "Chemistry",
        "worldRank": "350-400",
        "score": 55.4
      },
      {
        "subject": "Mathematics",
        "worldRank": "400-450",
        "score": 63.2
      }
    ]
  },
  {
    "id": "uni_41",
    "name": "Mahidol University",
    "location": "Thailand",
    "overall": 83.8,
    "citations": 79.5,
    "employability": 91.2,
    "intlStudents": 54.5,
    "teaching": 91.6,
    "research": 92.2,
    "academicReputation": 89.2,
    "employerReputation": 82.5,
    "facultyStudentRatio": 85.5,
    "subjects": [
      "Business",
      "Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$29,000/year",
    "description": "Mahidol University is a premier institution located in Thailand. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      64,
      69,
      32,
      95,
      14
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.mahidoledu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "50-100",
        "score": 78.1
      },
      {
        "subject": "Chemistry",
        "worldRank": "50-100",
        "score": 76.1
      },
      {
        "subject": "Business & Management Studies",
        "worldRank": "100-150",
        "score": 76.7
      },
      {
        "subject": "Materials Science",
        "worldRank": "100-150",
        "score": 85.6
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "50-100",
        "score": 85.6
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "100-150",
        "score": 81.8
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "50-100",
        "score": 82.2
      }
    ]
  },
  {
    "id": "uni_42",
    "name": "Universitas Indonesia",
    "location": "Indonesia",
    "overall": 50.7,
    "citations": 44.5,
    "employability": 89.0,
    "intlStudents": 37.2,
    "teaching": 59.3,
    "research": 76.1,
    "academicReputation": 81.9,
    "employerReputation": 83.6,
    "facultyStudentRatio": 87.7,
    "subjects": [
      "Business",
      "Humanities",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$28,000/year",
    "description": "Universitas Indonesia is a premier institution located in Indonesia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      13,
      27,
      17,
      26,
      45
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.universitasindonesia.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Accounting & Finance",
        "worldRank": "400-450",
        "score": 52.8
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "450-500",
        "score": 42.3
      },
      {
        "subject": "Linguistics",
        "worldRank": "200-250",
        "score": 43.7
      }
    ]
  },
  {
    "id": "uni_43",
    "name": "Gadjah Mada University",
    "location": "Indonesia",
    "overall": 50.6,
    "citations": 40.5,
    "employability": 98.4,
    "intlStudents": 73.4,
    "teaching": 85.4,
    "research": 78.6,
    "academicReputation": 98.5,
    "employerReputation": 72.7,
    "facultyStudentRatio": 54.1,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$21,000/year",
    "description": "Gadjah Mada University is a premier institution located in Indonesia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      35,
      83,
      20,
      27,
      80
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.gadjahmadaedu.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "400-450",
        "score": 49.2
      },
      {
        "subject": "Medicine",
        "worldRank": "250-300",
        "score": 51.7
      },
      {
        "subject": "Chemistry",
        "worldRank": "250-300",
        "score": 50.3
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "400-450",
        "score": 41.0
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "350-400",
        "score": 51.4
      },
      {
        "subject": "Modern Languages",
        "worldRank": "450-500",
        "score": 42.2
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "400-450",
        "score": 41.3
      }
    ]
  },
  {
    "id": "uni_44",
    "name": "Bandung Institute of Technology (ITB)",
    "location": "Indonesia",
    "overall": 63.7,
    "citations": 48.8,
    "employability": 82.6,
    "intlStudents": 35.3,
    "teaching": 89.6,
    "research": 87.4,
    "academicReputation": 82.2,
    "employerReputation": 66.8,
    "facultyStudentRatio": 78.7,
    "subjects": [
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$3,000/year",
    "description": "Bandung Institute of Technology (ITB) is a premier institution located in Indonesia. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      53,
      86,
      24,
      17,
      5
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.bandungacoftechnologyitb.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "400-450",
        "score": 60.3
      },
      {
        "subject": "Linguistics",
        "worldRank": "150-200",
        "score": 63.3
      },
      {
        "subject": "Accounting & Finance",
        "worldRank": "350-400",
        "score": 60.7
      },
      {
        "subject": "Engineering - Mechanical",
        "worldRank": "450-500",
        "score": 62.1
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "350-400",
        "score": 68.2
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "400-450",
        "score": 53.8
      },
      {
        "subject": "Modern Languages",
        "worldRank": "200-250",
        "score": 54.8
      },
      {
        "subject": "Law & Legal Studies",
        "worldRank": "250-300",
        "score": 58.0
      }
    ]
  },
  {
    "id": "uni_45",
    "name": "Tashkent State Technical University",
    "location": "Uzbekistan",
    "overall": 60.5,
    "citations": 62.3,
    "employability": 54.3,
    "intlStudents": 71.9,
    "teaching": 55.6,
    "research": 90.5,
    "academicReputation": 83.3,
    "employerReputation": 96.4,
    "facultyStudentRatio": 54.5,
    "subjects": [
      "Medicine",
      "Sciences",
      "Humanities",
      "Social Sciences",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$28,000/year",
    "description": "Tashkent State Technical University is a premier institution located in Uzbekistan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      6,
      47,
      66,
      93,
      64
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.tashkentstatetechnicaledu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Chemistry",
        "worldRank": "200-250",
        "score": 54.2
      },
      {
        "subject": "Engineering - Electrical & Electronic",
        "worldRank": "150-200",
        "score": 63.8
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "250-300",
        "score": 55.4
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "450-500",
        "score": 51.7
      },
      {
        "subject": "Linguistics",
        "worldRank": "400-450",
        "score": 63.4
      },
      {
        "subject": "Materials Science",
        "worldRank": "450-500",
        "score": 64.5
      },
      {
        "subject": "Medicine",
        "worldRank": "450-500",
        "score": 62.3
      }
    ]
  },
  {
    "id": "uni_46",
    "name": "National University of Uzbekistan",
    "location": "Uzbekistan",
    "overall": 84.5,
    "citations": 83.8,
    "employability": 96.3,
    "intlStudents": 64.5,
    "teaching": 95.2,
    "research": 85.9,
    "academicReputation": 80.4,
    "employerReputation": 94.4,
    "facultyStudentRatio": 85.3,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$19,000/year",
    "description": "National University of Uzbekistan is a premier institution located in Uzbekistan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      83,
      68,
      77,
      97,
      82
    ],
    "programs": [
      "BSc Computer Science",
      "MSc Artificial Intelligence",
      "Global MBA",
      "PhD Engineering"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1525926476832-61d0d93708a3?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.nationaleduofuzbekistan.edu",
    "hasMedicine": false,
    "qsSubjectRankings": [
      {
        "subject": "Medicine",
        "worldRank": "50-100",
        "score": 79.9
      },
      {
        "subject": "Modern Languages",
        "worldRank": "50-100",
        "score": 81.9
      },
      {
        "subject": "Chemistry",
        "worldRank": "100-150",
        "score": 76.6
      },
      {
        "subject": "Mathematics",
        "worldRank": "100-150",
        "score": 86.0
      },
      {
        "subject": "Materials Science",
        "worldRank": "50-100",
        "score": 78.0
      }
    ]
  },
  {
    "id": "uni_47",
    "name": "Samarkand State Medical University",
    "location": "Uzbekistan",
    "overall": 64.2,
    "citations": 54.7,
    "employability": 96.9,
    "intlStudents": 85.5,
    "teaching": 91.2,
    "research": 99.0,
    "academicReputation": 73.2,
    "employerReputation": 85.8,
    "facultyStudentRatio": 51.0,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Social Sciences"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$35,000/year",
    "description": "Samarkand State Medical University is a premier institution located in Uzbekistan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      28,
      89,
      81,
      77,
      67
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.samarkandstatemedicaledu.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Business & Management Studies",
        "worldRank": "450-500",
        "score": 65.5
      },
      {
        "subject": "Social Policy & Administration",
        "worldRank": "450-500",
        "score": 64.5
      },
      {
        "subject": "Medicine",
        "worldRank": "350-400",
        "score": 58.6
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "350-400",
        "score": 56.0
      },
      {
        "subject": "Linguistics",
        "worldRank": "250-300",
        "score": 61.4
      },
      {
        "subject": "Mathematics",
        "worldRank": "250-300",
        "score": 68.0
      }
    ]
  },
  {
    "id": "uni_48",
    "name": "Tashkent Medical Academy",
    "location": "Uzbekistan",
    "overall": 80.3,
    "citations": 86.3,
    "employability": 99.9,
    "intlStudents": 95.8,
    "teaching": 72.3,
    "research": 82.0,
    "academicReputation": 80.8,
    "employerReputation": 78.2,
    "facultyStudentRatio": 95.1,
    "subjects": [
      "Medicine",
      "Humanities",
      "Sciences",
      "Business",
      "Engineering"
    ],
    "languages": [
      "English",
      "Local Language"
    ],
    "tuition": "$26,000/year",
    "description": "Tashkent Medical Academy is a premier institution located in Uzbekistan. It is consistently recognized globally for its high research output and excellent academic reputation according to QS World University Rankings methodology.",
    "history": [
      46,
      41,
      48,
      43,
      29
    ],
    "programs": [
      "MBBS / MD Medicine",
      "BSc Biomedical Sciences",
      "MSc Global Health"
    ],
    "campusPhoto": "https://images.unsplash.com/photo-1531548731165-c6ae86ff6491?auto=format&fit=crop&w=800&q=80",
    "website": "https://www.tashkentmedicalacademy.edu",
    "hasMedicine": true,
    "qsSubjectRankings": [
      {
        "subject": "Accounting & Finance",
        "worldRank": "50-100",
        "score": 78.7
      },
      {
        "subject": "Medicine",
        "worldRank": "100-150",
        "score": 71.6
      },
      {
        "subject": "Modern Languages",
        "worldRank": "50-100",
        "score": 73.1
      },
      {
        "subject": "Materials Science",
        "worldRank": "100-150",
        "score": 74.0
      },
      {
        "subject": "Economics & Econometrics",
        "worldRank": "50-100",
        "score": 74.8
      },
      {
        "subject": "Linguistics",
        "worldRank": "50-100",
        "score": 81.1
      },
      {
        "subject": "Physics & Astronomy",
        "worldRank": "50-100",
        "score": 79.5
      },
      {
        "subject": "Computer Science & Information Systems",
        "worldRank": "50-100",
        "score": 79.3
      }
    ]
  }
];

export interface Article { id: string; title: string; subtitle: string; contentSummary: string; image: string; source: string; date: string; }
export const FEATURED_ARTICLES: Article[] = [
  {
    id: "art_1",
    title: "QS World University Rankings by Subject 2026: The Asian Surge",
    subtitle: "STEM subjects reach historic highs in East and Central Asian universities.",
    contentSummary: "Asian universities are breaking historical records in STEM rankings, driving massive growth in local research and citations.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    source: "QS Intelligence Unit",
    date: "June 2026"
  },
  {
    id: "art_2",
    title: "Employer Reputation Index: What Top Tech Firms Want",
    subtitle: "Analyzing graduate employability metrics across the C9 League and NUS.",
    contentSummary: "Employability metrics are shifting towards project-based research and international internships. Leading institutions respond.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    source: "Global Careers Report",
    date: "May 2026"
  },
  {
    id: "art_3",
    title: "Central Asian Healthcare Standards & Medical Licensing",
    subtitle: "Auditing Samarkand and Tashkent medical curriculums for global eligibility.",
    contentSummary: "Central Asian medical universities are adopting standardized English curriculums to boost international licensing pass rates.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    source: "Medical Education Hub",
    date: "April 2026"
  }
];
