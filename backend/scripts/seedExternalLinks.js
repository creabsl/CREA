const defaultLinks = [
  // Government Links
  {
    title: "Indian Railways Official Portal",
    url: "https://indianrailways.gov.in",
    category: "government",
    description: "Official website of Indian Railways - Ministry of Railways",
    order: 1
  },
  {
    title: "Central Railway Zone",
    url: "https://cr.indianrailways.gov.in",
    category: "government",
    description: "Official portal of Central Railway Zone",
    order: 2
  },
  {
    title: "Railway Board",
    url: "https://www.railwayboard.gov.in",
    category: "government",
    description: "Railway Board - Policy making body of Indian Railways",
    order: 3
  },
  {
    title: "Ministry of Railways",
    url: "https://www.indianrailways.gov.in/railwayboard",
    category: "government",
    description: "Ministry of Railways, Government of India",
    order: 4
  },
  {
    title: "NAIR - National Academy of Indian Railways",
    url: "https://www.nair.indianrailways.gov.in",
    category: "government",
    description: "Training academy for railway officers and staff",
    order: 5
  },

  // Industry Links
  {
    title: "RDSO - Research Designs & Standards Organisation",
    url: "https://rdso.indianrailways.gov.in",
    category: "industry",
    description: "R&D wing of Indian Railways for standards and designs",
    order: 1
  },
  {
    title: "IRCON International Limited",
    url: "https://www.ircon.org",
    category: "industry",
    description: "Railway construction and infrastructure company",
    order: 2
  },
  {
    title: "RITES Limited",
    url: "https://www.rites.com",
    category: "industry",
    description: "Engineering consultancy for railways and infrastructure",
    order: 3
  },
  {
    title: "Rail India Technical and Economic Service",
    url: "https://www.rites.com",
    category: "industry",
    description: "Technical and economic consultancy services",
    order: 4
  },
  {
    title: "Indian Railway Catering & Tourism Corporation",
    url: "https://www.irctc.co.in",
    category: "industry",
    description: "IRCTC - Railway ticketing and tourism services",
    order: 5
  },

  // Organization Links
  {
    title: "Institution of Engineers (India)",
    url: "https://www.ieindia.org",
    category: "organization",
    description: "Professional body of engineers in India",
    order: 1
  },
  {
    title: "Indian Railway Technical Supervisors Association",
    url: "https://www.irtsa.net",
    category: "organization",
    description: "Association for railway technical supervisors",
    order: 2
  },
  {
    title: "All India Railwaymen's Federation",
    url: "https://www.airf.in",
    category: "organization",
    description: "Federation of railway employees across India",
    order: 3
  },
  {
    title: "National Federation of Indian Railwaymen",
    url: "https://www.nfir.org.in",
    category: "organization",
    description: "Federation representing railway workers",
    order: 4
  },
  {
    title: "Indian Society for Technical Education",
    url: "https://www.isteonline.in",
    category: "organization",
    description: "Professional society for technical education",
    order: 5
  },

  // Other Links
  {
    title: "Rail Analysis India",
    url: "https://www.railanalysis.com",
    category: "other",
    description: "News and analysis portal for Indian Railways",
    order: 1
  },
  {
    title: "Indian Railways Enquiry",
    url: "https://enquiry.indianrail.gov.in",
    category: "other",
    description: "Train schedule and PNR status enquiry",
    order: 2
  },
  {
    title: "Rail Madad - Grievance Portal",
    url: "https://railmadad.indianrailways.gov.in",
    category: "other",
    description: "Railway grievance redressal portal",
    order: 3
  },
  {
    title: "CRIS - Centre for Railway Information Systems",
    url: "https://www.cris.org.in",
    category: "other",
    description: "IT solutions provider for Indian Railways",
    order: 4
  },
  {
    title: "NFIR Digital Library",
    url: "https://www.nfir.org.in/library",
    category: "other",
    description: "Digital resources for railway professionals",
    order: 5
  }
];

const seedExternalLinks = async () => {
  try {
    const ExternalLink = require('../models/externalLinkModel');
    
    // Clear existing links
    await ExternalLink.deleteMany({});
    
    // Insert default links
    await ExternalLink.insertMany(defaultLinks);
    
    console.log('External links seeded successfully');
    return defaultLinks.length;
  } catch (error) {
    console.error('Error seeding external links:', error);
    return 0;
  }
};

module.exports = { seedExternalLinks };