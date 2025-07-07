-- Add foreign key relationship between messages and profiles
ALTER TABLE public.messages 
ADD CONSTRAINT messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add foreign key relationship between message_likes and profiles  
ALTER TABLE public.message_likes
ADD CONSTRAINT message_likes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Insert some sample profiles for the mock users
INSERT INTO public.profiles (user_id, email, first_name, last_name, display_name) VALUES
('123e4567-e89b-12d3-a456-426614174001', 'sarah.johnson@email.com', 'Sarah', 'Johnson', 'Sarah J.'),
('123e4567-e89b-12d3-a456-426614174002', 'mike.davis@email.com', 'Mike', 'Davis', 'Mike D.'),
('123e4567-e89b-12d3-a456-426614174003', 'emma.wilson@email.com', 'Emma', 'Wilson', 'Emma W.'),
('123e4567-e89b-12d3-a456-426614174004', 'james.brown@email.com', 'James', 'Brown', 'James B.'),
('123e4567-e89b-12d3-a456-426614174005', 'lisa.taylor@email.com', 'Lisa', 'Taylor', 'Lisa T.');

-- Insert mock messages for the social feed
INSERT INTO public.messages (user_id, content, created_at, is_public) VALUES
('123e4567-e89b-12d3-a456-426614174001', 'So excited for Tim and Kirsten''s wedding! The venue looks absolutely stunning. Can''t wait to celebrate with everyone! 💕 #TimAndKirsten2025', NOW() - INTERVAL '2 hours', true),
('123e4567-e89b-12d3-a456-426614174002', 'Just booked my stay at the Ben Ean Pokolbin! Looking forward to a weekend of love, laughter, and good wine. Congratulations to the happy couple! 🥂 #BenEan #WeddingBliss', NOW() - INTERVAL '1 day', true),
('123e4567-e89b-12d3-a456-426614174003', 'Tim and Kirsten, you two are absolutely perfect for each other! I''ve watched your love story unfold and it''s been beautiful. Can''t wait to see you say "I do"! #ForeverLove', NOW() - INTERVAL '3 hours', true),
('123e4567-e89b-12d3-a456-426614174004', 'Hunter Valley weddings hit different! This is going to be such a magical celebration. Congratulations Tim & Kirsten! 🍾 #HunterValleyWedding', NOW() - INTERVAL '5 hours', true),
('123e4567-e89b-12d3-a456-426614174005', 'Already planning my outfit for the big day! Tim and Kirsten, thank you for including us in your special moment. Love you both! ✨ #TimAndKirsten2025 #WeddingBliss', NOW() - INTERVAL '8 hours', true);

-- Add some likes to the messages
INSERT INTO public.message_likes (user_id, message_id) 
SELECT 
    profile_users.user_id,
    msg.id
FROM (VALUES 
    ('123e4567-e89b-12d3-a456-426614174002'),
    ('123e4567-e89b-12d3-a456-426614174003'),
    ('123e4567-e89b-12d3-a456-426614174004')
) AS profile_users(user_id)
CROSS JOIN (
    SELECT id FROM public.messages LIMIT 3
) AS msg;