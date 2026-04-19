require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('MongoDB connected');

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true }
  }, { timestamps: true });

  const contractSchema = new mongoose.Schema({
    clientName: String,
    serviceTier: String,
    responseTimeMin: Number,
    resolutionTimeHr: Number,
    penaltyPerBreach: Number,
    status: { type: String, default: 'Pending' },
    createdBy: mongoose.Schema.Types.ObjectId,
    approvedBy: mongoose.Schema.Types.ObjectId,
    totalBreaches: { type: Number, default: 0 },
    totalPenalty: { type: Number, default: 0 }
  }, { timestamps: true });

  const ticketSchema = new mongoose.Schema({
    subject: String,
    description: String,
    priority: String,
    category: String,
    status: { type: String, default: 'Open' },
    createdBy: mongoose.Schema.Types.ObjectId,
    contract: mongoose.Schema.Types.ObjectId,
    slaBreached: { type: Boolean, default: false }
  }, { timestamps: true });

  const alertSchema = new mongoose.Schema({
    ticket: mongoose.Schema.Types.ObjectId,
    contract: mongoose.Schema.Types.ObjectId,
    breachType: String,
    severity: String,
    status: { type: String, default: 'Open' },
    penaltyApplied: Number,
    elapsedTimeMin: Number,
    slaLimitMin: Number
  }, { timestamps: true });

  await mongoose.connection.dropDatabase();
  console.log('Database cleared');

  const User = mongoose.model('User', userSchema);
  const Contract = mongoose.model('SLAContract', contractSchema);
  const Ticket = mongoose.model('Ticket', ticketSchema);
  const Alert = mongoose.model('BreachAlert', alertSchema);

  const adminPass = await bcrypt.hash('Admin@123', 12);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@acme.com',
    password: adminPass,
    role: 'admin'
  });

  const userPass = await bcrypt.hash('User@123', 12);
  const user = await User.create({
    name: 'John Doe',
    email: 'user@acme.com',
    password: userPass,
    role: 'user'
  });

  const gold = await Contract.create({
    clientName: 'Acme Corp',
    serviceTier: 'Gold',
    responseTimeMin: 15,
    resolutionTimeHr: 2,
    penaltyPerBreach: 2500,
    status: 'Approved',
    createdBy: admin._id,
    approvedBy: admin._id
  });

  const silver = await Contract.create({
    clientName: 'TechFlow Ltd',
    serviceTier: 'Silver',
    responseTimeMin: 30,
    resolutionTimeHr: 8,
    penaltyPerBreach: 1000,
    status: 'Approved',
    createdBy: admin._id,
    approvedBy: admin._id
  });

  await Contract.create({
    clientName: 'DataSync Inc',
    serviceTier: 'Bronze',
    responseTimeMin: 60,
    resolutionTimeHr: 24,
    penaltyPerBreach: 500,
    status: 'Pending',
    createdBy: admin._id
  });

  const t1 = await Ticket.create({
    subject: 'API gateway timeout',
    description: 'API gateway throwing 504 errors',
    priority: 'High',
    category: 'Infrastructure',
    status: 'Open',
    createdBy: user._id,
    contract: gold._id
  });

  await Ticket.create({
    subject: 'Dashboard loading slow',
    description: 'Dashboard takes 15 seconds to load',
    priority: 'Medium',
    category: 'Performance',
    status: 'In Progress',
    createdBy: user._id,
    contract: silver._id
  });

  await Ticket.create({
    subject: 'Login failure reports',
    description: 'Users cannot log in',
    priority: 'High',
    category: 'Security',
    status: 'Open',
    createdBy: user._id,
    contract: gold._id
  });

  await Alert.create({
    ticket: t1._id,
    contract: gold._id,
    breachType: 'Response',
    severity: 'Critical',
    status: 'Open',
    penaltyApplied: 2500,
    elapsedTimeMin: 272,
    slaLimitMin: 15
  });

  console.log('✅ Database seeded successfully!');
  console.log('Admin: admin@acme.com / Admin@123');
  console.log('User: user@acme.com / User@123');

  process.exit(0);

}).catch(err => {
  console.error(err);
  process.exit(1);
});