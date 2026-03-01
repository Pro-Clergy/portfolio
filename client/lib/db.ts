import mongoose from 'mongoose';

/* ─────────────────────────────────────────────
   Cached MongoDB connection for serverless
   (Vercel reuses the module scope across warm invocations)
──────────────────────────────────────────── */

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* eslint-disable no-var */
declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
if (!global._mongooseCache) global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log('✅ MongoDB connected (serverless)');
        return m;
      })
      .catch((err) => {
        console.warn(`⚠️ MongoDB failed: ${err.message}`);
        cached.promise = null;
        return null as unknown as typeof mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ─────────────────────────────────────────────
   Mongoose Models (defined once per process)
──────────────────────────────────────────── */

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, trim: true, default: '' },
    message: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    tags: [String],
    category: {
      type: String,
      enum: ['web', 'data', 'mobile', 'ai', 'other'],
      default: 'other',
    },
    image: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

projectSchema.pre('save', function () {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

const visitorSchema = new mongoose.Schema({
  page: String,
  referrer: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  ip: { type: String, default: '' },
  country: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Project =
  mongoose.models.Project || mongoose.model('Project', projectSchema);
export const Visitor =
  mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
