-- Create guests table for wedding guest management
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_names TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  mobile TEXT,
  category TEXT NOT NULL, -- Family, Newcastle, Sydney, etc.
  location TEXT, -- Notes about location/address
  save_the_date_sent BOOLEAN DEFAULT false,
  invite_sent BOOLEAN DEFAULT false,
  rsvp_status TEXT DEFAULT 'pending', -- 'pending', 'attending', 'declined', 'cannot_contact'
  rsvp_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Create policies for guest management
CREATE POLICY "Admins and couple can manage guests" 
ON public.guests 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'couple'::app_role));

CREATE POLICY "Everyone can view guests" 
ON public.guests 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all wedding guests

-- Family guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Cheryl and Bill', 2, '0404 895 087', 'Family', true, true, 'declined', 0, 'Invited but unlikely to come'),
('Stephanie Coupland', 1, '0466 511 119', 'Family', true, true, 'attending', 1, 'France'),
('Elaine Ryvers', 1, '0416 961 137', 'Family', true, true, 'pending', 0, 'Brownsville'),
('Bev Schembri', 1, '0449 173 936', 'Family', true, true, 'pending', 0, 'Berkeley'),
('John Ryvers and Les Hambly', 2, '0403 068 439', 'Family', true, true, 'pending', 0, 'Engadine'),
('John''s carer', 1, NULL, 'Family', false, false, 'attending', 1, 'Carer for John'),
('Cristeena Jackson', 1, '0404 269 215', 'Family', true, true, 'pending', 0, 'Warrawong'),
('Michael and Leonie', 2, '0439 485 168', 'Family', true, true, 'pending', 0, 'Ningi QLD'),
('Curtis and Mara', 2, '0417 899 025', 'Family', false, false, 'cannot_contact', 0, 'Cannot send save the date'),
('Maddy and Jayden', 2, NULL, 'Family', false, true, 'pending', 0, 'Ningi QLD'),
('Rachel and Iain', 2, '+44 7906 172246', 'Family', true, true, 'declined', 0, 'Already RSVPed no'),
('Chris and Derek', 2, '+44 7842 381062', 'Family', true, true, 'pending', 0, 'Scotland'),
('James and Andrew', 2, '+44 7895 275893', 'Family', true, true, 'pending', 0, 'UK');

-- Newcastle guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Meredith Downes and Mark Swartz', 2, '0413 795 844', 'Newcastle', true, true, 'pending', 0, 'Mayfield'),
('Maddy Jeffries and Robert Davey', 2, '0400 484 527', 'Newcastle', true, true, 'pending', 0, 'Mayfield'),
('Murielle Kluge', 1, '0422 953 665', 'Newcastle', true, true, 'pending', 0, 'The Hill'),
('Mark Goodger', 1, '0429 982 337', 'Newcastle', true, true, 'pending', 0, 'The Hill'),
('Michael Minter and Tilly', 2, '0410 370 640', 'Newcastle', true, true, 'pending', 0, 'New Lambton Heights'),
('Andi and Chris', 2, '0413 223 604', 'Newcastle', true, true, 'pending', 0, 'Hamilton'),
('Lara Viskovich and Benji', 2, '0415 505 404', 'Newcastle', true, true, 'pending', 0, 'Mayfield'),
('Michelle Roach', 1, '0424 323 506', 'Newcastle', true, true, 'pending', 0, 'Tighes Hill'),
('Lucy Miller', 1, '0433 020 870', 'Newcastle', true, true, 'pending', 0, 'Newcastle'),
('Prue and John', 2, '0427 417 870', 'Newcastle', true, true, 'pending', 0, 'Tighes Hill');

-- North Coast guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Tavis and Jen Oceans', 2, '0400 800 838', 'North Coast', true, true, 'pending', 0, 'Pillar Valley'),
('James and Alicia Galletly', 2, '0429 005 032', 'North Coast', true, true, 'pending', 0, 'Crescent Head'),
('Chris McFerran', 1, '0416 324 296', 'North Coast', true, true, 'pending', 0, 'Bangalow'),
('Jye and Kelly', 2, '0402 550 828', 'North Coast', true, true, 'pending', 0, 'Forster');

-- Overseas guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Laetitia Lemoine', 1, '+46 7293 02798', 'Overseas', true, true, 'attending', 1, 'London, UK'),
('Joana Braga Pereira and Giovanni', 2, '+46 7099 66186', 'Overseas', true, true, 'attending', 1, 'Sweden'),
('David Skerret-Byrne and Aki', 2, '+49 171 295 2274', 'Overseas', true, true, 'attending', 1, 'Germany'),
('Bernie Schreiner', 1, '+49 176 7323 4679', 'Overseas', true, true, 'attending', 1, 'Germany'),
('Mustafa al Mustafa Ismail and Selma', 2, '+46 7369 04647', 'Overseas', true, true, 'attending', 1, 'Sweden'),
('Raul Loera Valencia and Alma', 2, '+52 449 355 7390', 'Overseas', true, true, 'attending', 1, 'Mexico'),
('Simone Tambaro', 1, '+46 7693 23175', 'Overseas', true, true, 'attending', 1, 'Sweden');

-- Sydney guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Steven and Irene McConnell', 2, '0449 616 050', 'Sydney', true, true, 'pending', 0, 'Elizabeth Bay'),
('Sam and Arun', 2, '0481 199 100', 'Sydney', true, true, 'declined', 0, 'Marrickville'),
('Andrew and Michelle', 2, '0432 528 029', 'Sydney', false, true, 'pending', 0, 'Leichhardt'),
('Lisa and Hermann', 2, '0411 430 341', 'Sydney', true, true, 'pending', 0, 'Pyrmont'),
('Lesley and Desmond Sutton', 2, '0421 594 215', 'Sydney', true, true, 'pending', 0, 'Bundanoon'),
('Damo and Ri', 2, '0411 889 561', 'Sydney', true, true, 'pending', 0, 'Gymea Bay'),
('Damian Krigstein and Bruna', 2, '0466 110 047', 'Sydney', false, true, 'pending', 0, 'Rozelle'),
('Matt and Tammy', 2, '0497 839 328', 'Sydney', true, true, 'pending', 0, 'Umina Beach'),
('Timmy and Meagan', 2, '0421 883 876', 'Sydney', false, true, 'pending', 0, 'Forest Lodge'),
('Rapha Draschler and Daniel', 2, '0422 365 276', 'Sydney', true, true, 'pending', 0, 'Padstowe'),
('Nadia Vitlin', 1, '0405 326 551', 'Sydney', true, true, 'pending', 0, 'Sandringham'),
('Kyle Thompson and Pip', 2, '0423 628 781', 'Sydney', true, true, 'pending', 0, 'Cremorne'),
('Alison and Andrew Madry', 2, '0400 497 439', 'Sydney', true, true, 'pending', 0, 'Manly'),
('Lochie and Kat', 2, '0414 882 766', 'Sydney', false, true, 'pending', 0, 'Parap NT'),
('Richard', 1, '0418 228 609', 'Sydney', false, true, 'pending', 0, 'Port Macquarie'),
('Anthony', 1, '0423 531 517', 'Sydney', false, true, 'pending', 0, 'Pyrmont'),
('Davor and Nicole', 2, '0411 383 778', 'Sydney', true, true, 'pending', 0, 'Pyrmont'),
('Sam Thorpe and Cat', 2, '0490 871 200', 'Sydney', true, true, 'pending', 0, 'Mortdale'),
('Mark Slavin', 1, '0415 188 826', 'Sydney', false, true, 'pending', 0, 'Canberra'),
('KT and Daph', 2, '0414 738 155', 'Sydney', true, true, 'pending', 0, 'Coogee'),
('Pash and Elenie', 2, '0406 666 171', 'Sydney', false, true, 'pending', 0, 'Kingsford'),
('Dula and Emily', 2, '0412 873 272', 'Sydney', true, true, 'pending', 0, 'Redfern'),
('Val Hans and Mick', 2, '0428 876 001', 'Sydney', true, true, 'pending', 0, 'Pyrmont'),
('Marianne Hallupp', 1, '0421 019 985', 'Sydney', true, true, 'pending', 0, 'Ultimo'),
('Wendy', 1, '0417 507 889', 'Sydney', true, true, 'declined', 0, 'Pyrmont'),
('Jodie Ford', 1, '0403 318 639', 'Sydney', false, true, 'pending', 0, 'Kenthurst'),
('Tipsy staff 1', 1, NULL, 'Sydney', false, false, 'pending', 0, 'Wedding staff'),
('Tipsy staff 2', 1, NULL, 'Sydney', false, false, 'pending', 0, 'Wedding staff');

-- Wollongong guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Dan and Nicky Flurien', 2, '0459 954 372', 'Wollongong', false, false, 'pending', 0, 'Cannot send'),
('Tim Twyford and Anna', 2, '0406 289 418', 'Wollongong', false, false, 'pending', 0, 'Cannot send');

-- Further South guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Clay and Alison Walsh', 2, '0431 105 691', 'Further South', true, true, 'pending', 0, 'Deua River Valley'),
('Viv and Eddie', 2, '0488 982 299', 'Further South', true, true, 'pending', 0, 'Moruya');

-- Interstate guests
INSERT INTO public.guests (guest_names, guest_count, mobile, category, save_the_date_sent, invite_sent, rsvp_status, rsvp_count, notes) VALUES
('Michelle Rank', 1, '0422 886 782', 'Interstate', true, true, 'pending', 0, 'Melbourne VIC'),
('Halley and Brad', 2, '0403 991 266', 'Interstate', true, true, 'pending', 0, 'Glenorchy TAS'),
('Catherine dal Cin', 1, '0430 152 700', 'Interstate', true, true, 'pending', 0, 'Canberra ACT'),
('Barbara Toson', 1, '0468 313 874', 'Interstate', true, true, 'pending', 0, 'Adelaide SA');