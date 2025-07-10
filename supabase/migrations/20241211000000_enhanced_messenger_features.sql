-- Enhanced Messenger Features Migration
-- Adds support for video/audio calls, enhanced media sharing, and real-time features

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add call-related tables
CREATE TABLE IF NOT EXISTS video_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES direct_chats(id) ON DELETE CASCADE,
    initiator_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    call_type TEXT CHECK (call_type IN ('audio', 'video')) NOT NULL,
    status TEXT CHECK (status IN ('ringing', 'accepted', 'declined', 'ended', 'missed')) DEFAULT 'ringing',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    
    -- WebRTC signaling data
    offer_sdp JSONB,
    answer_sdp JSONB,
    ice_candidates JSONB[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Call participants tracking
CREATE TABLE IF NOT EXISTS call_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_id UUID REFERENCES video_calls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Call state
    is_audio_enabled BOOLEAN DEFAULT TRUE,
    is_video_enabled BOOLEAN DEFAULT TRUE,
    connection_state TEXT CHECK (connection_state IN ('connecting', 'connected', 'disconnected', 'failed')) DEFAULT 'connecting',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(call_id, user_id)
);

-- Enhanced media uploads tracking
CREATE TABLE IF NOT EXISTS media_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    
    -- File details
    original_filename TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    
    -- Media metadata
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    thumbnail_path TEXT,
    
    -- Processing status
    processing_status TEXT CHECK (processing_status IN ('uploading', 'processing', 'completed', 'failed')) DEFAULT 'uploading',
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Typing indicators for real-time chat
CREATE TABLE IF NOT EXISTS typing_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES direct_chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 seconds'),
    
    UNIQUE(chat_id, user_id)
);

-- Enhanced message status tracking
CREATE TABLE IF NOT EXISTS message_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
    
    -- Status tracking
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(message_id, user_id)
);

-- Add call preferences to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS call_preferences JSONB DEFAULT '{
    "audio_enabled": true,
    "video_enabled": true,
    "auto_answer": false,
    "notification_sound": true
}';

-- Add enhanced media columns to chat_messages if not exists
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS dimensions JSONB; -- {width: 1920, height: 1080}

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_calls_chat_id ON video_calls(chat_id);
CREATE INDEX IF NOT EXISTS idx_video_calls_status ON video_calls(status);
CREATE INDEX IF NOT EXISTS idx_video_calls_started_at ON video_calls(started_at);

CREATE INDEX IF NOT EXISTS idx_call_participants_call_id ON call_participants(call_id);
CREATE INDEX IF NOT EXISTS idx_call_participants_user_id ON call_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_media_uploads_message_id ON media_uploads(message_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_uploader_id ON media_uploads(uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_processing_status ON media_uploads(processing_status);

CREATE INDEX IF NOT EXISTS idx_typing_indicators_chat_id ON typing_indicators(chat_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_expires_at ON typing_indicators(expires_at);

CREATE INDEX IF NOT EXISTS idx_message_status_message_id ON message_status(message_id);
CREATE INDEX IF NOT EXISTS idx_message_status_user_id ON message_status(user_id);

-- Create function to clean up expired typing indicators
CREATE OR REPLACE FUNCTION cleanup_expired_typing_indicators()
RETURNS VOID AS $$
BEGIN
    DELETE FROM typing_indicators WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to update call duration
CREATE OR REPLACE FUNCTION update_call_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ended_at IS NOT NULL AND OLD.ended_at IS NULL THEN
        NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for call duration updates
DROP TRIGGER IF EXISTS trigger_update_call_duration ON video_calls;
CREATE TRIGGER trigger_update_call_duration
    BEFORE UPDATE ON video_calls
    FOR EACH ROW
    EXECUTE FUNCTION update_call_duration();

-- Create function to automatically create message status entries
CREATE OR REPLACE FUNCTION create_message_status_entries()
RETURNS TRIGGER AS $$
DECLARE
    member_record RECORD;
BEGIN
    -- Create status entries for all chat members except the sender
    FOR member_record IN 
        SELECT cm.user_id 
        FROM chat_members cm 
        WHERE cm.chat_id = NEW.chat_id 
        AND cm.user_id != NEW.sender_id 
        AND cm.left_at IS NULL
    LOOP
        INSERT INTO message_status (message_id, user_id)
        VALUES (NEW.id, member_record.user_id)
        ON CONFLICT (message_id, user_id) DO NOTHING;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic message status creation
DROP TRIGGER IF EXISTS trigger_create_message_status ON chat_messages;
CREATE TRIGGER trigger_create_message_status
    AFTER INSERT ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION create_message_status_entries();

-- Row Level Security (RLS) Policies

-- video_calls policies
ALTER TABLE video_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view calls in their chats" ON video_calls
    FOR SELECT USING (
        auth.uid() IN (
            SELECT cm.user_id 
            FROM chat_members cm 
            WHERE cm.chat_id = video_calls.chat_id 
            AND cm.left_at IS NULL
        )
    );

CREATE POLICY "Users can create calls in their chats" ON video_calls
    FOR INSERT WITH CHECK (
        auth.uid() = initiator_id AND
        auth.uid() IN (
            SELECT cm.user_id 
            FROM chat_members cm 
            WHERE cm.chat_id = video_calls.chat_id 
            AND cm.left_at IS NULL
        )
    );

CREATE POLICY "Users can update their initiated calls" ON video_calls
    FOR UPDATE USING (auth.uid() = initiator_id);

-- call_participants policies
ALTER TABLE call_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view call participants in their calls" ON call_participants
    FOR SELECT USING (
        auth.uid() IN (
            SELECT cp.user_id 
            FROM call_participants cp 
            WHERE cp.call_id = call_participants.call_id
        )
    );

CREATE POLICY "Users can join calls they're invited to" ON call_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON call_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- media_uploads policies
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view media in their chats" ON media_uploads
    FOR SELECT USING (
        auth.uid() IN (
            SELECT cm.user_id 
            FROM chat_members cm 
            JOIN chat_messages msg ON msg.chat_id = cm.chat_id
            WHERE msg.id = media_uploads.message_id 
            AND cm.left_at IS NULL
        )
    );

CREATE POLICY "Users can upload media to their messages" ON media_uploads
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their own uploads" ON media_uploads
    FOR UPDATE USING (auth.uid() = uploader_id);

-- typing_indicators policies
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view typing in their chats" ON typing_indicators
    FOR SELECT USING (
        auth.uid() IN (
            SELECT cm.user_id 
            FROM chat_members cm 
            WHERE cm.chat_id = typing_indicators.chat_id 
            AND cm.left_at IS NULL
        )
    );

CREATE POLICY "Users can indicate typing in their chats" ON typing_indicators
    FOR ALL USING (
        auth.uid() = user_id AND
        auth.uid() IN (
            SELECT cm.user_id 
            FROM chat_members cm 
            WHERE cm.chat_id = typing_indicators.chat_id 
            AND cm.left_at IS NULL
        )
    );

-- message_status policies
ALTER TABLE message_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view message status for their messages" ON message_status
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT msg.sender_id 
            FROM chat_messages msg 
            WHERE msg.id = message_status.message_id
        )
    );

CREATE POLICY "Users can update their own message status" ON message_status
    FOR UPDATE USING (auth.uid() = user_id);

-- Create storage buckets for enhanced media (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('call-recordings', 'call-recordings', false, 104857600, ARRAY['video/webm', 'video/mp4', 'audio/webm', 'audio/mp3']),
    ('media-thumbnails', 'media-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies
CREATE POLICY "Users can upload call recordings" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'call-recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their call recordings" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'call-recordings' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view media thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'media-thumbnails');

CREATE POLICY "Users can upload media thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'media-thumbnails' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_video_calls_updated_at ON video_calls;
CREATE TRIGGER trigger_video_calls_updated_at
    BEFORE UPDATE ON video_calls
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_media_uploads_updated_at ON media_uploads;
CREATE TRIGGER trigger_media_uploads_updated_at
    BEFORE UPDATE ON media_uploads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_message_status_updated_at ON message_status;
CREATE TRIGGER trigger_message_status_updated_at
    BEFORE UPDATE ON message_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE video_calls IS 'Stores video and audio call sessions between users';
COMMENT ON TABLE call_participants IS 'Tracks users participating in calls and their connection state';
COMMENT ON TABLE media_uploads IS 'Enhanced tracking of media files uploaded to chats';
COMMENT ON TABLE typing_indicators IS 'Real-time typing indicators for chat conversations';
COMMENT ON TABLE message_status IS 'Tracks delivery and read status of messages';

COMMENT ON COLUMN video_calls.offer_sdp IS 'WebRTC session description protocol offer';
COMMENT ON COLUMN video_calls.answer_sdp IS 'WebRTC session description protocol answer';
COMMENT ON COLUMN video_calls.ice_candidates IS 'Array of ICE candidates for WebRTC connection';
COMMENT ON COLUMN profiles.call_preferences IS 'User preferences for voice and video calls';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;