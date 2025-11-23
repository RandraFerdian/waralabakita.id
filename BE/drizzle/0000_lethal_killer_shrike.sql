CREATE TYPE "public"."listing_status" AS ENUM('Active', 'Pending', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin', 'mitra');--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"username" text DEFAULT null,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"refresh_token" text,
	"registration_date" timestamp with time zone DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" text NOT NULL,
	CONSTRAINT "categories_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "franchisors" (
	"franchisor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text,
	"email" text NOT NULL,
	"phone_number" text,
	"listing_name" text NOT NULL,
	"bussines_category" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"registration_date" timestamp with time zone DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "franchise_listings" (
	"listing_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"franchisor_id" uuid,
	"listing_name" text NOT NULL,
	"slogan" text,
	"description" text,
	"location" text,
	"status" "listing_status" DEFAULT 'Pending',
	"views" bigint DEFAULT 0,
	"whatsapp_clicks" bigint DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT NOW(),
	"updated_at" timestamp with time zone DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "investment_metrics" (
	"metrics_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid,
	"initial_capital_min" bigint,
	"initial_capital_max" bigint,
	"franchise_fee" bigint,
	"royalty_fee_percent" numeric(5, 2),
	"estimated_bep_months_min" integer,
	"estimated_bep_months_max" integer,
	CONSTRAINT "investment_metrics_listing_id_unique" UNIQUE("listing_id")
);
--> statement-breakpoint
CREATE TABLE "franchise_categories" (
	"listing_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "franchise_categories_listing_id_category_id_pk" PRIMARY KEY("listing_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid,
	"user_id" uuid,
	"rating" smallint,
	"review_text" text,
	"created_at" timestamp with time zone DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "media" (
	"media_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid,
	"media_url" text NOT NULL,
	"media_type" "media_type" NOT NULL,
	"created_at" timestamp DEFAULT NOW()
);
--> statement-breakpoint
CREATE TABLE "package_and_support" (
	"package_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid,
	"support_item" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "franchisors" ADD CONSTRAINT "franchisors_franchisor_id_users_user_id_fk" FOREIGN KEY ("franchisor_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_listings" ADD CONSTRAINT "franchise_listings_franchisor_id_franchisors_franchisor_id_fk" FOREIGN KEY ("franchisor_id") REFERENCES "public"."franchisors"("franchisor_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_metrics" ADD CONSTRAINT "investment_metrics_listing_id_franchise_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."franchise_listings"("listing_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_categories" ADD CONSTRAINT "franchise_categories_listing_id_franchise_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."franchise_listings"("listing_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "franchise_categories" ADD CONSTRAINT "franchise_categories_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_franchise_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."franchise_listings"("listing_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_listing_id_franchise_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."franchise_listings"("listing_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_and_support" ADD CONSTRAINT "package_and_support_listing_id_franchise_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."franchise_listings"("listing_id") ON DELETE cascade ON UPDATE no action;