const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BodyMember = require('../models/bodyMemberModel');

dotenv.config();

const seedBodyMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing body members
    await BodyMember.deleteMany({});
    console.log('Cleared existing body members');

    // Sample body members
    const bodyMembers = [
      {
        name: 'A. Sharma',
        designation: 'President',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Mumbai'
      },
      {
        name: 'R. Gupta',
        designation: 'General Secretary',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Mumbai'
      },
      {
        name: 'S. Khan',
        designation: 'Treasurer',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Mumbai'
      },
      {
        name: 'P. Deshmukh',
        designation: 'President',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Pune'
      },
      {
        name: 'M. Kulkarni',
        designation: 'Secretary',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Pune'
      },
      {
        name: 'V. Patil',
        designation: 'President',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Nagpur'
      },
      {
        name: 'A. Joshi',
        designation: 'Secretary',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Nagpur'
      },
      {
        name: 'S. Pawar',
        designation: 'President',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Solapur'
      },
      {
        name: 'R. More',
        designation: 'Secretary',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'Solapur'
      },
      {
        name: 'K. Rao',
        designation: 'President',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'BSL'
      },
      {
        name: 'N. Kumar',
        designation: 'Secretary',
        photoUrl: 'https://via.placeholder.com/150',
        division: 'BSL'
      }
    ];

    await BodyMember.insertMany(bodyMembers);
    console.log(`✅ Seeded ${bodyMembers.length} body members`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedBodyMembers();
