ALTER TABLE "users" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profession" text;