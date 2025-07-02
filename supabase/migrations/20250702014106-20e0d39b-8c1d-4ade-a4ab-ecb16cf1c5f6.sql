-- Add missing fields to existing tasks table
ALTER TABLE public.tasks 
ADD COLUMN task_type TEXT DEFAULT 'follow_up',
ADD COLUMN related_claim_id UUID REFERENCES public.claims(id),
ADD COLUMN created_by TEXT NOT NULL DEFAULT 'system',
ADD COLUMN attachment_ids TEXT[]; -- Array of file vault IDs

-- Create task history table for audit trail
CREATE TABLE public.task_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'assigned', 'completed'
  field_name TEXT, -- which field was changed
  old_value TEXT, -- previous value
  new_value TEXT, -- new value
  changed_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS on task_history
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- Create policies for task_history
CREATE POLICY "Authenticated users can view task history" 
ON public.task_history 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create task history" 
ON public.task_history 
FOR INSERT 
WITH CHECK (true);

-- Create function to log task changes
CREATE OR REPLACE FUNCTION public.log_task_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log task creation
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.task_history (task_id, action_type, changed_by, notes)
    VALUES (NEW.id, 'created', NEW.created_by, 'Task created');
    RETURN NEW;
  END IF;

  -- Log task updates
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.task_history (task_id, action_type, field_name, old_value, new_value, changed_by)
      VALUES (NEW.id, 'status_changed', 'status', OLD.status, NEW.status, 'system');
    END IF;

    -- Log assignment changes
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
      INSERT INTO public.task_history (task_id, action_type, field_name, old_value, new_value, changed_by)
      VALUES (NEW.id, 'assigned', 'assigned_to', OLD.assigned_to, NEW.assigned_to, 'system');
    END IF;

    -- Log priority changes
    IF OLD.priority IS DISTINCT FROM NEW.priority THEN
      INSERT INTO public.task_history (task_id, action_type, field_name, old_value, new_value, changed_by)
      VALUES (NEW.id, 'updated', 'priority', OLD.priority, NEW.priority, 'system');
    END IF;

    -- Log due date changes
    IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
      INSERT INTO public.task_history (task_id, action_type, field_name, old_value, new_value, changed_by)
      VALUES (NEW.id, 'updated', 'due_date', OLD.due_date::text, NEW.due_date::text, 'system');
    END IF;

    -- Log completion
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      INSERT INTO public.task_history (task_id, action_type, changed_by, notes)
      VALUES (NEW.id, 'completed', COALESCE(NEW.completed_by, 'system'), 'Task marked as completed');
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for task history logging
CREATE TRIGGER task_history_trigger
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.log_task_changes();

-- Add indexes for better performance
CREATE INDEX idx_task_history_task_id ON public.task_history(task_id);
CREATE INDEX idx_task_history_created_at ON public.task_history(created_at DESC);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);