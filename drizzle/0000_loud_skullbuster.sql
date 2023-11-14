CREATE TABLE `book` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`book_type_id` integer NOT NULL,
	`book_condition_id` integer NOT NULL,
	`is_visited` integer NOT NULL,
	`google_book_ref` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book_type` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `book_condition` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `borrow` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_id` integer NOT NULL,
	`borrower_name` text NOT NULL,
	`borrowed_date_time` integer NOT NULL,
	`returned_date` integer,
	`returned_book_condition_id` integer NOT NULL,
	`borrow_status_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `borrow_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL
);
