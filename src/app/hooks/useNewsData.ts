import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  content?: string;
  link: string;
  imageUrl?: string;
  featured?: boolean;
  category?: string;
}

export function useNewsData() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking an API call to fetch news data
    const fetchNews = async () => {
      setLoading(true);
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setNews([
        {
          id: '1',
          title: 'Tsinghua University Tops 2026 Asia Rankings',
          date: 'July 6, 2026',
          summary: 'Tsinghua retains the #1 spot, leading in research output and employer reputation. The latest metrics show an unprecedented surge in global collaboration.',
          content: 'Tsinghua University has once again secured the number one position in the 2026 Asia University Rankings. The institution saw significant growth in its research citation index and International Faculty ratios. According to the intelligence desk, Tsinghua\'s strategic partnerships with over 50 global institutions this year contributed heavily to its unparalleled academic and employer reputation scores.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
          featured: true,
          category: 'Rankings Update'
        },
        {
          id: '2',
          title: 'New Medical Program Scholarships Announced in Uzbekistan',
          date: 'July 5, 2026',
          summary: 'Several top universities in Uzbekistan have introduced new scholarships for international MBBS students to foster global medical talent.',
          content: 'In a major push to attract international medical students, the Ministry of Higher Education in Uzbekistan, alongside leading medical institutes, announced a $5 Million scholarship fund. The fund will subsidize up to 50% of tuition for high-performing international students pursuing MBBS degrees, aiming to position the country as a premier destination for medical education in Central Asia.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
          category: 'Scholarships'
        },
        {
          id: '3',
          title: 'Singapore Introduces AI-Focused Engineering Degrees',
          date: 'July 4, 2026',
          summary: 'NUS and NTU launch joint programs to meet the surging demand for AI professionals in the region, featuring state-of-the-art research labs.',
          content: 'Responding to the booming tech sector, the National University of Singapore (NUS) and Nanyang Technological University (NTU) have collaborated to launch specialized undergraduate degrees in Applied Artificial Intelligence. These programs integrate closely with industry partners, offering students hands-on experience in specialized AI labs and guaranteed internships with leading tech firms in Singapore.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
          category: 'Academics'
        },
        {
          id: '4',
          title: 'Regional Summit on Higher Education Policy',
          date: 'July 2, 2026',
          summary: 'Education ministers from 14 Asian nations convene to discuss cross-border degree recognition and standardized accreditation.',
          content: 'The 2026 Asian Higher Education Summit concluded yesterday with a landmark agreement. Education ministers from 14 nations signed a memorandum of understanding to streamline cross-border degree recognition. This policy shift is expected to drastically increase student mobility across the region, making it easier for graduates to find employment or pursue postgraduate studies in neighboring countries without facing prolonged accreditation hurdles.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=600&q=80',
          category: 'Policy'
        },
        {
          id: '5',
          title: 'Tokyo University Launches Global Sustainability Institute',
          date: 'July 1, 2026',
          summary: 'A new multidisciplinary institute focused on climate change and sustainable technologies opens in Tokyo.',
          content: 'The University of Tokyo has inaugurated a $500M Global Sustainability Institute. Bringing together top researchers from Asia, Europe, and the Americas, the institute will focus on next-generation solar tech, urban resilience, and green policy.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
          category: 'Research'
        },
        {
          id: '6',
          title: 'Seoul National University Expands Biotech Campus',
          date: 'June 28, 2026',
          summary: 'SNU partners with major pharma companies to build a state-of-the-art biotechnology research campus.',
          content: 'Seoul National University announced a major expansion of its Biotech hub. The project, heavily backed by private sector pharma giants, aims to accelerate vaccine research and personalized medicine development.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
          category: 'Infrastructure'
        },
        {
          id: '7',
          title: 'Malaysia Unveils Digital Education Blueprint',
          date: 'June 25, 2026',
          summary: 'A comprehensive plan to integrate digital learning tools and AI across all public universities.',
          content: 'Malaysia\'s Ministry of Higher Education unveiled a 5-year Digital Blueprint. Every public university will receive upgraded cloud infrastructure and standardized AI learning tools to prepare graduates for a digital-first economy.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
          category: 'Policy'
        },
        {
          id: '8',
          title: 'Hong Kong Universities See Surge in Tech Grants',
          date: 'June 22, 2026',
          summary: 'Government tech grants for HK universities hit a record high, focusing on FinTech and Smart Cities.',
          content: 'The Innovation and Technology Fund in Hong Kong has awarded record-breaking grants to local universities. The funding is largely directed towards FinTech innovations, blockchain research, and smart city infrastructure development.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee57d5?w=600&q=80',
          category: 'Funding'
        },
        {
          id: '9',
          title: 'IIT Bombay Ranks #1 in Asian Startup Founders',
          date: 'June 20, 2026',
          summary: 'A new report highlights IIT Bombay as the top Asian university for producing unicorn startup founders.',
          content: 'According to the 2026 Global Startup Report, the Indian Institute of Technology Bombay has surpassed all other Asian universities in producing founders of billion-dollar startups, largely driven by its strong alumni network and tech incubator.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1559136555-e46be98a8731?w=600&q=80',
          category: 'Rankings Update'
        },
        {
          id: '10',
          title: 'Vietnam National University Launches Space Program',
          date: 'June 18, 2026',
          summary: 'VNU introduces the country\'s first comprehensive aerospace engineering and satellite program.',
          content: 'In a historic move, Vietnam National University has launched a dedicated Aerospace Engineering program. The curriculum includes hands-on satellite design, in collaboration with regional space agencies.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
          category: 'Academics'
        },
        {
          id: '11',
          title: 'Peking University Hosts Global AI Ethics Forum',
          date: 'June 15, 2026',
          summary: 'Scholars and tech leaders gather in Beijing to draft guidelines for ethical AI development in education.',
          content: 'Peking University hosted a 3-day forum on AI Ethics, bringing together over 200 global experts. The resulting "Beijing Accord on AI in Education" establishes guidelines for data privacy and algorithmic fairness in university admissions and grading.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1591453081816-0f1661603d6f?w=600&q=80',
          category: 'Events'
        },
        {
          id: '12',
          title: 'Taiwan Universities Boost Semiconductor Training',
          date: 'June 12, 2026',
          summary: 'A new consortium of Taiwanese universities aims to double the output of semiconductor engineers.',
          content: 'With the global chip shortage in mind, top Taiwanese universities have formed a consortium to overhaul their electrical engineering curricula. They plan to double the number of graduates specializing in advanced semiconductor manufacturing by 2030.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
          category: 'Academics'
        },
        {
          id: '13',
          title: 'Chulalongkorn University Expands Exchange Program',
          date: 'June 10, 2026',
          summary: 'Thailand\'s top university signs 20 new exchange agreements with European institutions.',
          content: 'Chulalongkorn University has significantly expanded its global footprint, finalizing exchange agreements with 20 leading universities across Europe. The focus is on cultural exchange and joint research in tropical medicine and agriculture.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
          category: 'Global'
        },
        {
          id: '14',
          title: 'Indonesia Pioneers Green Campus Initiatives',
          date: 'June 8, 2026',
          summary: 'Major Indonesian universities pledge to reach net-zero carbon emissions by 2040.',
          content: 'Five of Indonesia\'s top universities have signed a pledge to achieve net-zero carbon emissions by 2040. The initiative includes massive investments in campus solar grids and waste-to-energy facilities.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
          category: 'Sustainability'
        },
        {
          id: '15',
          title: 'KAIST Unveils Next-Gen Robotics Lab',
          date: 'June 5, 2026',
          summary: 'South Korea\'s KAIST opens a state-of-the-art lab dedicated to humanoid robotics and automation.',
          content: 'The Korea Advanced Institute of Science and Technology (KAIST) has unveiled its new Robotics Innovation Center. The facility will spearhead research into humanoid robots for disaster response and healthcare assistance.',
          link: '#',
          imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
          category: 'Research'
        }
      ]);
      setLoading(false);
    };

    fetchNews();
  }, []);

  return { news, loading };
}
