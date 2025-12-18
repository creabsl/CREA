const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureDir(dirPath) {
  try { fs.mkdirSync(dirPath, { recursive: true }); } catch {}
}

function storageFor(subdir) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dest = path.join(__dirname, '..', 'uploads', subdir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });
}

function fileFilter(_req, file, cb) {
  const ok =
    file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (!ok) return cb(new Error('Only images, PDF, DOC, or DOCX allowed'));
  return cb(null, true);
}

function bulkUploadFileFilter(_req, file, cb) {
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  const allowedExtensions = ['.csv', '.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  const ok = allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext);
  if (!ok) return cb(new Error('Only CSV and Excel files allowed'));
  return cb(null, true);
}

exports.uploadSingle = (subdir) =>
  multer({ storage: storageFor(subdir), fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

exports.uploadBulkMembers = multer({ 
  storage: storageFor('bulk-uploads'), 
  fileFilter: bulkUploadFileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for bulk upload files
}).single('file');

exports.upload = multer({ 
  storage: storageFor('suggestions'), 
  fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } 
});

exports.uploadAdImage = multer({ 
  storage: storageFor('ads'), 
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/');
    if (!ok) return cb(new Error('Only images allowed for advertisements'));
    return cb(null, true);
  }, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for ad images
}).single('image');

exports.uploadMultiple = (subdir) =>
  multer({ 
    storage: storageFor(subdir), 
    fileFilter: (_req, file, cb) => {
      const ok = file.mimetype.startsWith('image/');
      if (!ok) return cb(new Error('Only images allowed'));
      return cb(null, true);
    }, 
    limits: { fileSize: 10 * 1024 * 1024 } 
  }).array('photos', 10); // Allow up to 10 photos
