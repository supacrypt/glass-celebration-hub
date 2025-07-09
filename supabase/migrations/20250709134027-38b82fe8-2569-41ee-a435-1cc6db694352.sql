-- Create dietary_requirements table for enhanced dietary management
CREATE TABLE public.dietary_requirements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    rsvp_id UUID NOT NULL REFERENCES public.rsvps(id) ON DELETE CASCADE,
    dietary_option_id TEXT,
    custom_requirement TEXT,
    severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_dietary_requirements_rsvp_id ON public.dietary_requirements(rsvp_id);
CREATE INDEX idx_dietary_requirements_dietary_option_id ON public.dietary_requirements(dietary_option_id);
CREATE INDEX idx_dietary_requirements_severity ON public.dietary_requirements(severity);

-- Enable RLS
ALTER TABLE public.dietary_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own dietary requirements"
    ON public.dietary_requirements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.rsvps 
            WHERE rsvps.id = dietary_requirements.rsvp_id 
            AND rsvps.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all dietary requirements"
    ON public.dietary_requirements FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_dietary_requirements_updated_at
    BEFORE UPDATE ON public.dietary_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to validate dietary requirements
CREATE OR REPLACE FUNCTION public.validate_dietary_requirement()
RETURNS TRIGGER AS $$
BEGIN
    -- Must have either dietary_option_id or custom_requirement
    IF NEW.dietary_option_id IS NULL AND NEW.custom_requirement IS NULL THEN
        RAISE EXCEPTION 'Must specify either dietary_option_id or custom_requirement';
    END IF;
    
    -- Cannot have both dietary_option_id and custom_requirement
    IF NEW.dietary_option_id IS NOT NULL AND NEW.custom_requirement IS NOT NULL THEN
        RAISE EXCEPTION 'Cannot specify both dietary_option_id and custom_requirement';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_dietary_requirement_trigger
    BEFORE INSERT OR UPDATE ON public.dietary_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_dietary_requirement();

-- Create function to sync RSVP dietary_restrictions field
CREATE OR REPLACE FUNCTION public.sync_rsvp_dietary_restrictions()
RETURNS TRIGGER AS $$
DECLARE
    rsvp_id_val UUID;
    dietary_summary TEXT;
BEGIN
    -- Get RSVP ID from the affected row
    IF TG_OP = 'DELETE' THEN
        rsvp_id_val := OLD.rsvp_id;
    ELSE
        rsvp_id_val := NEW.rsvp_id;
    END IF;
    
    -- Generate summary of dietary requirements
    SELECT string_agg(
        CASE 
            WHEN dr.dietary_option_id IS NOT NULL THEN 
                CASE dr.dietary_option_id
                    WHEN 'vegetarian' THEN 'Vegetarian'
                    WHEN 'vegan' THEN 'Vegan'
                    WHEN 'gluten_free' THEN 'Gluten-Free'
                    WHEN 'dairy_free' THEN 'Dairy-Free'
                    WHEN 'nut_allergy' THEN 'Nut Allergy'
                    WHEN 'shellfish_allergy' THEN 'Shellfish Allergy'
                    WHEN 'halal' THEN 'Halal'
                    WHEN 'kosher' THEN 'Kosher'
                    WHEN 'low_sodium' THEN 'Low Sodium'
                    WHEN 'diabetic' THEN 'Diabetic-Friendly'
                    ELSE dr.dietary_option_id
                END
            ELSE dr.custom_requirement
        END,
        ', '
    ) INTO dietary_summary
    FROM public.dietary_requirements dr
    WHERE dr.rsvp_id = rsvp_id_val;
    
    -- Update RSVP record
    UPDATE public.rsvps 
    SET dietary_restrictions = dietary_summary
    WHERE id = rsvp_id_val;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync dietary restrictions
CREATE TRIGGER sync_rsvp_dietary_restrictions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.dietary_requirements
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_rsvp_dietary_restrictions();