const { createClient } = require("@supabase/supabase-js");

const supabase = createClient('https://rlkflisvqgndvaojqoao.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsa2ZsaXN2cWduZHZhb2pxb2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MzM4NTUsImV4cCI6MjA1NTAwOTg1NX0.X-ottuHt6nzv5KpBG582AFgJ7PniCzz_xA_resiXfR8');

module.exports = supabase;
