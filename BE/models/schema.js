import { pgTable, uuid, text, timestamp, boolean, smallint, bigint, numeric, integer, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'mitra']);
// export const listingStatusEnum = pgEnum('listing_status', ['Active', 'Pending', 'Rejected']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'thumbnail']);
export const documentTypeEnum = pgEnum('document_type', ['HAKI', 'NIB', 'KTP']);
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'pending_review', 'active', 'rejected']);
export const bannerPositionEnum = pgEnum('banner_position', ['HERO_CAROUSEL', 'STATIC_PROMO']);

// Table: users
export const users = pgTable('users', {
    userId: uuid('user_id').primaryKey().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    username: text('username').default(null),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull().default('user'),
    refreshToken: text('refresh_token'),
    registrationDate: timestamp('registration_date', { withTimezone: true }).default(sql`NOW()`),
    isActive: boolean('is_active').notNull().default(true),
    isSuspended: boolean('is_suspended').notNull().default(false),
});

// Table: franchisors
export const franchisors = pgTable('franchisors', {
    userId: uuid('user_id').primaryKey().default(sql`gen_random_uuid()`), 
    companyName: text('company_name').notNull(),
    contactName: text('contact_name'),
    email: text('email').notNull(),
    phoneNumber: text('phone_number'),
    listingName: text('listing_name').notNull(),
    bussinesCategory: text('bussines_category').notNull(),
    isVerified: boolean('is_verified').default(false),
    registrationDate: timestamp('registration_date', { withTimezone: true }).default(sql`NOW()`),
});

// Table: franchiseListings
export const franchiseListings = pgTable("franchise_listings", {
    listingId: uuid("listing_id").primaryKey().default(sql`gen_random_uuid()`),
    franchisorId: uuid("franchisor_id").references(() => franchisors.userId, { onDelete: "set null" }), 
    listingName: text("listing_name").notNull(),
    slogan: text("slogan"),
    description: text("description"),
    location: text("location"),
    status: listingStatusEnum("status").default("Pending"),
    views: bigint("views", { mode: "number" }).default(0),
    whatsappClicks: bigint("whatsapp_clicks", { mode: "number" }).default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`NOW()`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`NOW()`),
});

// Table: investmentMetrics
export const investmentMetrics = pgTable('investment_metrics', {
    metricsId: uuid('metrics_id').primaryKey().default(sql`gen_random_uuid()`),
    listingId: uuid('listing_id').unique().references(() => franchiseListings.listingId, { onDelete: 'cascade' }), 
    initialCapitalMin: bigint('initial_capital_min', { mode: 'number' }),
    initialCapitalMax: bigint('initial_capital_max', { mode: 'number' }),
    franchiseFee: bigint('franchise_fee', { mode: 'number' }),
    royaltyFeePercent: numeric('royalty_fee_percent', { precision: 5, scale: 2 }),
    estimatedBepMonthsMin: integer('estimated_bep_months_min'),
    estimatedBepMonthsMax: integer('estimated_bep_months_max'),
});

// Table: categories
export const categories = pgTable('categories', {
    categoryId: uuid('category_id').primaryKey().default(sql`gen_random_uuid()`),
    categoryName: text('category_name').notNull().unique(),
});

// Table: franchiseCategories (Many-to-Many Join Table)
export const franchiseCategories = pgTable('franchise_categories', {
    listingId: uuid('listing_id').references(() => franchiseListings.listingId, { onDelete: 'cascade' }).notNull(),
    categoryId: uuid('category_id').references(() => categories.categoryId, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.listingId, t.categoryId] }),
}));

// Table: reviews
export const reviews = pgTable('reviews', {
    reviewId: uuid('review_id').primaryKey().default(sql`gen_random_uuid()`),
    listingId: uuid('listing_id').references(() => franchiseListings.listingId, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.userId, { onDelete: 'set null' }), 
    rating: smallint('rating'), 
    reviewText: text('review_text'),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
});

// Table: media
export const media = pgTable('media', {
    mediaId: uuid('media_id').primaryKey().default(sql`gen_random_uuid()`),
    listingId: uuid('listing_id').references(() => franchiseListings.listingId, { onDelete: 'cascade' }),
    mediaUrl: text('media_url').notNull(),
    mediaType: mediaTypeEnum('media_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).default(sql`NOW()`),
});

// Table: packageAndSupport
export const packageAndSupport = pgTable('package_and_support', {
    packageId: uuid('package_id').primaryKey().default(sql`gen_random_uuid()`),
    listingId: uuid('listing_id').references(() => franchiseListings.listingId, { onDelete: 'cascade' }),
    supportItem: text('support_item').notNull(),
});

//Table: favorites
export const favorites = pgTable('favorites', {
    userId: uuid('user_id').notNull().references(() => users.userId, {onDelete: 'cascade'}),
    listingId: uuid('listing_id').notNull().references(() => franchiseListings.listingId, {onDelete: 'cascade'}),
    createdAt: timestamp('created_at', {withTimezone: true}).default(sql`NOW()`),
}, (t) => ({
    pk: primaryKey({columns: [t.userId, t.listingId]}),
}));

//Table: documments
export const documents = pgTable('documents', {
    documentId: uuid('document_id').primaryKey().defaultRandom(),
    listingId: uuid('listing_id')
        .notNull()
        .references(() => franchiseListings.listingId, { onDelete: 'cascade' }),
    documentType: documentTypeEnum('document_type').notNull(),
    storageUrl: text('storage_url').notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});

//Table: listing history
export const listingHistory = pgTable('listing_history', {
    historyId: uuid('history_id').primaryKey().defaultRandom(),
    listingId: uuid('listing_id')
        .notNull()
        .references(() => franchiseListings.listingId, { onDelete: 'cascade' }),
    userId: uuid('user_id') // User ID Admin/Mitra yang melakukan aksi
        .notNull()
        .references(() => users.userId, { onDelete: 'restrict' }), 
    oldStatus: listingStatusEnum('old_status').notNull(),
    newStatus: listingStatusEnum('new_status').notNull(),
    reason: text('reason'),
    changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
});

//Table: banners
export const banners = pgTable('banners', {
    bannerId: uuid('banner_id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    imageUrl: text('image_url').notNull(),
    linkUrl: text('link_url'),
    position: bannerPositionEnum('position').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// User Relations
export const userRelations = relations(users, ({ one, many }) => ({
    // Relasi One-to-One: users ke franchisors
    franchisorDetail: one(franchisors, {
        fields: [users.userId],
        references: [franchisors.userId],
    }),
    // Relasi One-to-Many: users ke reviews
    reviews: many(reviews), 
    favorites: many(favorites),
}));

// Franchisor Relations
export const franchisorRelations = relations(franchisors, ({ one, many }) => ({
    // Relasi One-to-One: franchisors kembali ke users
    user: one(users, {
        fields: [franchisors.userId],
        references: [users.userId],
    }),
    // Relasi One-to-Many: franchisors ke franchiseListings
    franchiseListings: many(franchiseListings),
}));

// Franchise Listings Relations
export const franchiseListingRelations = relations(franchiseListings, ({ one, many }) => ({
    franchisor: one(franchisors, {
        fields: [franchiseListings.franchisorId],
        references: [franchisors.userId], 
    }),
    metrics: one(investmentMetrics, {
        fields: [franchiseListings.listingId],
        references: [investmentMetrics.listingId],
    }),
    reviews: many(reviews),
    media: many(media),
    packages: many(packageAndSupport),
    franchiseCategories: many(franchiseCategories),
    favorites: many(favorites),
    documents: many(documents),
    history: many(listingHistory)
}));

// Categories Relations
export const categoryRelations = relations(categories, ({ many }) => ({
    franchiseCategories: many(franchiseCategories),
}));

// Franchise Categories Relations (Join Table)
export const franchiseCategoryRelations = relations(franchiseCategories, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [franchiseCategories.listingId],
        references: [franchiseListings.listingId],
    }),
    category: one(categories, {
        fields: [franchiseCategories.categoryId],
        references: [categories.categoryId],
    }),
}));

// Investment Metrics Relations
export const investmentMetricsRelations = relations(investmentMetrics, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [investmentMetrics.listingId],
        references: [franchiseListings.listingId],
    }),
}));

// Reviews Relations
export const reviewRelations = relations(reviews, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [reviews.listingId],
        references: [franchiseListings.listingId],
    }),
    user: one(users, {
        fields: [reviews.userId],
        references: [users.userId],
    }),
}));

// Media Relations
export const mediaRelations = relations(media, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [media.listingId],
        references: [franchiseListings.listingId],
    }),
}));

// Package and Support Relations
export const packageAndSupportRelations = relations(packageAndSupport, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [packageAndSupport.listingId],
        references: [franchiseListings.listingId],
    }),
}));

//Favorites relation 
export const favoritesRelation = relations(favorites, ({one}) => ({
    user: one(users, {
        fields: [favorites.userId],
        references: [users.userId],
    }),
    listing: one(franchiseListings, {
        fields: [favorites.listingId],
        references: [franchiseListings.listingId],
    }),
}))

//Doccument relation
export const documentsRelations = relations(documents, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [documents.listingId],
        references: [franchiseListings.listingId],
    }),
}));

//Listing history relation
export const listingHistoryRelations = relations(listingHistory, ({ one }) => ({
    listing: one(franchiseListings, {
        fields: [listingHistory.listingId],
        references: [franchiseListings.listingId],
    }),
    user: one(users, { // Relasi ke Admin/Mitra yang membuat entri
        fields: [listingHistory.userId],
        references: [users.userId],
    }),
}));



