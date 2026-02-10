-- Add QR Purchases table and subscription_status column
-- Migration: 002_add_qr_purchases

-- Track individual QR code purchases
CREATE TABLE IF NOT EXISTS public.qr_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_gateway TEXT CHECK (payment_gateway IN ('razorpay', 'stripe')),
  gateway_payment_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_qr_purchases_user_id ON public.qr_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_purchases_status ON public.qr_purchases(payment_status);

-- RLS Policies
ALTER TABLE public.qr_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON public.qr_purchases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON public.qr_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add subscription_status column to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'monthly', 'yearly'));
    END IF;
END $$;
