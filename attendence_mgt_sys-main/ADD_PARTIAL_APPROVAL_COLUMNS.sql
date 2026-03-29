-- Enhanced Leave Management System - Database Schema Updates
-- Run this in Supabase SQL Editor

-- Add columns for partial approval tracking
ALTER TABLE leave_forms
ADD COLUMN IF NOT EXISTS approved_days INTEGER,
ADD COLUMN IF NOT EXISTS approved_from_date DATE,
ADD COLUMN IF NOT EXISTS approved_to_date DATE;

-- Add comment to explain the fields
COMMENT ON COLUMN leave_forms.approved_days IS 'Number of days approved by teacher (may differ from requested num_days)';
COMMENT ON COLUMN leave_forms.approved_from_date IS 'Approved start date (may differ from requested from_date)';
COMMENT ON COLUMN leave_forms.approved_to_date IS 'Approved end date (may differ from requested to_date)';

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'leave_forms'
AND column_name IN ('approved_days', 'approved_from_date', 'approved_to_date')
ORDER BY column_name;
