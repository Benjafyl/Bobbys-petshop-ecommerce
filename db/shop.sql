-- Dedicated Bobby's Pet Shop database. Run after Better Auth's core migration.
create table if not exists shop_admin_accounts (
  user_id text primary key references "user"(id) on delete cascade,
  email text not null unique check (lower(email) = 'antonelarodil@gmail.com'),
  created_at timestamptz not null default now()
);

create table if not exists shop_inventory (
  variant_key text primary key,
  product_slug text not null,
  size text not null,
  design text not null default '',
  price_clp integer not null check (price_clp > 0),
  stock_on_hand integer not null check (stock_on_hand between 0 and 9999),
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (product_slug, size, design)
);

create table if not exists shop_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id text references "user"(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  delivery_address text not null default '',
  delivery_city text not null default '',
  delivery_region text not null default '',
  status text not null default 'PENDING' check (status in ('PENDING','PAID','PREPARING','READY','SHIPPED','DELIVERED','CANCELLED','REFUNDED')),
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING','PAID','FAILED','REFUNDED')),
  payment_method text,
  payment_reference text,
  payment_preference_id text,
  reservation_expires_at timestamptz,
  reservation_released_at timestamptz,
  paid_at timestamptz,
  subtotal_clp integer not null check (subtotal_clp >= 0),
  shipping_clp integer not null default 5000 check (shipping_clp >= 0),
  discount_clp integer not null default 0 check (discount_clp >= 0),
  total_clp integer generated always as (subtotal_clp + shipping_clp - discount_clp) stored,
  discount_code text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shop_orders_status_date_idx on shop_orders(status,created_at desc);
create index if not exists shop_orders_user_idx on shop_orders(user_id,created_at desc);
alter table shop_orders add column if not exists payment_preference_id text;
alter table shop_orders add column if not exists reservation_expires_at timestamptz;
alter table shop_orders add column if not exists reservation_released_at timestamptz;
alter table shop_orders add column if not exists paid_at timestamptz;
create unique index if not exists shop_orders_payment_reference_idx on shop_orders(payment_reference) where payment_reference is not null;

create table if not exists shop_order_notifications (
  order_id uuid primary key references shop_orders(id) on delete cascade,
  sent_at timestamptz,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now()
);

create table if not exists shop_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references shop_orders(id) on delete cascade,
  variant_key text not null,
  product_name text not null,
  size text not null,
  design text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price_clp integer not null check (unit_price_clp >= 0),
  line_total_clp integer generated always as (quantity * unit_price_clp) stored
);

create table if not exists shop_coupons (
  code text primary key check (code = upper(code) and length(code) between 3 and 32),
  kind text not null check (kind in ('PERCENT','FIXED')),
  amount integer not null check (amount > 0),
  minimum_clp integer not null default 0 check (minimum_clp >= 0),
  usage_limit integer check (usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (kind = 'FIXED' or amount <= 100)
);

create table if not exists shop_stock_movements (
  id bigserial primary key,
  variant_key text not null references shop_inventory(variant_key),
  before_units integer not null,
  after_units integer not null,
  actor_id text references "user"(id) on delete set null,
  reason text not null default 'Ajuste manual',
  created_at timestamptz not null default now()
);

create table if not exists shop_audit_logs (
  id bigserial primary key,
  actor_id text references "user"(id) on delete set null,
  action text not null,
  entity_id text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- Seed only missing variants. Existing stock and prices are never overwritten.
insert into shop_inventory(variant_key,product_slug,size,design,price_clp,stock_on_hand) values
('["parka-bicolor-gris","M",""]','parka-bicolor-gris','M','',16000,2),
('["parka-bicolor-gris","L",""]','parka-bicolor-gris','L','',16000,1),
('["parka-bicolor-gris","XL",""]','parka-bicolor-gris','XL','',18000,1),
('["parka-bicolor-beige","M",""]','parka-bicolor-beige','M','',16000,2),
('["parka-bicolor-beige","L",""]','parka-bicolor-beige','L','',16000,1),
('["parka-bicolor-beige","XL",""]','parka-bicolor-beige','XL','',18000,2),
('["parka-rosa-metalizada","S",""]','parka-rosa-metalizada','S','',12000,1),
('["parka-militar","M",""]','parka-militar','M','',12000,1),
('["parka-azul","L",""]','parka-azul','L','',12000,1),
('["poleron-corazones-rosa","S",""]','poleron-corazones-rosa','S','',5500,1),
('["poleron-flores-rosa","S",""]','poleron-flores-rosa','S','',5500,1),
('["poleron-ositos","M",""]','poleron-ositos','M','',5500,1),
('["poleron-leopardo-gris","M",""]','poleron-leopardo-gris','M','',5500,1),
('["poleron-dinosaurios","M",""]','poleron-dinosaurios','M','',5500,1),
('["vestido-vampirita","M-L",""]','vestido-vampirita','M-L','',5990,1),
('["vestido-esqueleto","M-L",""]','vestido-esqueleto','M-L','',5990,1),
('["polera-esqueleto","M-L",""]','polera-esqueleto','M-L','',4000,1),
('["traje-calabaza","M-L",""]','traje-calabaza','M-L','',4000,1),
('["bandana-halloween","Única","Halloween rosado"]','bandana-halloween','Única','Halloween rosado',4000,1),
('["bandana-halloween","Única","Fantasmas y murciélagos"]','bandana-halloween','Única','Fantasmas y murciélagos',4000,1),
('["bandana-halloween","Única","Boo! negro"]','bandana-halloween','Única','Boo! negro',4000,1),
('["collar-murcielago","XS",""]','collar-murcielago','XS','',3500,1),
('["collar-calabaza","XS",""]','collar-calabaza','XS','',3500,1)
on conflict (variant_key) do nothing;
