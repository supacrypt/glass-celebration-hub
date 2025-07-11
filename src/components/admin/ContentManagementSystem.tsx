import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { supabase } from '@/integrations/supabase/client';

interface ContentBlock {
  id: string;
  section: string;
  type: 'text' | 'rich_text' | 'image' | 'video' | 'faq' | 'event';
  title: string;
  content: string;
  metadata: Record<string, any>;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface ContentSection {
  id: string;
  name: string;
  description: string;
  blocks: ContentBlock[];
}

const ContentManagementSystem: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [newBlockType, setNewBlockType] = useState<ContentBlock['type']>('text');

  // Content sections that admins can fully control
  const defaultSections = [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Main welcome message and visual elements',
      blocks: []
    },
    {
      id: 'faq',
      name: 'FAQ Section',
      description: 'Frequently asked questions for guests',
      blocks: []
    },
    {
      id: 'events',
      name: 'Event Timeline',
      description: 'Wedding event schedule and details',
      blocks: []
    },
    {
      id: 'venue',
      name: 'Venue Information',
      description: 'Location details and directions',
      blocks: []
    },
    {
      id: 'dress_code',
      name: 'Dress Code',
      description: 'Attire guidelines for guests',
      blocks: []
    },
    {
      id: 'accommodations',
      name: 'Accommodations',
      description: 'Hotel and lodging recommendations',
      blocks: []
    },
    {
      id: 'transport',
      name: 'Transportation',
      description: 'Travel and parking information',
      blocks: []
    },
    {
      id: 'contact',
      name: 'Contact Information',
      description: 'Emergency contacts and support',
      blocks: []
    }
  ];

  useEffect(() => {
    loadContentSections();
  }, []);

  const loadContentSections = async () => {
    try {
      setLoading(true);
      
      // Load existing content blocks
      const { data: blocks, error } = await (supabase as any)
        .from('content_blocks')
        .select('*')
        .order('section', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;

      // Group blocks by section
      const groupedSections = defaultSections.map(section => ({
        ...section,
        blocks: blocks?.filter(block => block.section === section.id) || []
      }));

      setSections(groupedSections);
      if (groupedSections.length > 0) {
        setActiveSection(groupedSections[0].id);
      }
    } catch (error) {
      console.error('Error loading content sections:', error);
      toast({
        title: "Error",
        description: "Failed to load content sections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContentBlock = async (block: Partial<ContentBlock>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('content_blocks')
        .upsert([{
          ...block,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSections(prev => prev.map(section => {
        if (section.id === block.section) {
          const updatedBlocks = block.id 
            ? section.blocks.map(b => b.id === block.id ? data : b)
            : [...section.blocks, data];
          return { ...section, blocks: updatedBlocks };
        }
        return section;
      }));

      toast({
        title: "Success",
        description: "Content block saved successfully",
      });

      setEditingBlock(null);
    } catch (error) {
      console.error('Error saving content block:', error);
      toast({
        title: "Error",
        description: "Failed to save content block",
        variant: "destructive"
      });
    }
  };

  const deleteContentBlock = async (blockId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('content_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      setSections(prev => prev.map(section => ({
        ...section,
        blocks: section.blocks.filter(block => block.id !== blockId)
      })));

      toast({
        title: "Success",
        description: "Content block deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting content block:', error);
      toast({
        title: "Error",
        description: "Failed to delete content block",
        variant: "destructive"
      });
    }
  };

  const toggleBlockVisibility = async (block: ContentBlock) => {
    await saveContentBlock({
      ...block,
      is_visible: !block.is_visible
    });
  };

  const createNewBlock = async () => {
    const newBlock: Partial<ContentBlock> = {
      section: activeSection,
      type: newBlockType,
      title: 'New Content Block',
      content: '',
      metadata: {},
      order_index: sections.find(s => s.id === activeSection)?.blocks.length || 0,
      is_visible: true
    };

    await saveContentBlock(newBlock);
  };

  const activeContentSection = sections.find(s => s.id === activeSection);

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold"></div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy">Content Management System</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Control all guest-facing content from one central location
          </p>
        </div>
        <Button onClick={createNewBlock} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Content Block
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="p-4">
            <h3 className="font-semibold text-wedding-navy mb-4">Content Sections</h3>
            <div className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-wedding-gold/20 text-wedding-gold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{section.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {section.blocks.length} blocks
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Content Management */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6">
            {activeContentSection && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-wedding-navy">
                    {activeContentSection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeContentSection.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {activeContentSection.blocks.map(block => (
                    <div key={block.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-wedding-gold/20 text-wedding-gold text-xs rounded">
                            {block.type}
                          </span>
                          <h4 className="font-medium">{block.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlockVisibility(block)}
                          >
                            {block.is_visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingBlock(block)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteContentBlock(block.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {block.type === 'rich_text' ? (
                          <div dangerouslySetInnerHTML={{ __html: block.content }} />
                        ) : (
                          <p>{block.content.substring(0, 100)}...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Content Block</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingBlock.title}
                    onChange={(e) => setEditingBlock({
                      ...editingBlock,
                      title: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                   {editingBlock.type === 'rich_text' ? (
                     <RichTextEditor
                       label="Content"
                       value={editingBlock.content}
                       onChange={(content) => setEditingBlock({
                         ...editingBlock,
                         content
                       })}
                       onSave={() => {}}
                     />
                   ) : (
                    <Textarea
                      id="content"
                      value={editingBlock.content}
                      onChange={(e) => setEditingBlock({
                        ...editingBlock,
                        content: e.target.value
                      })}
                      rows={6}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="visible"
                    checked={editingBlock.is_visible}
                    onChange={(e) => setEditingBlock({
                      ...editingBlock,
                      is_visible: e.target.checked
                    })}
                  />
                  <Label htmlFor="visible">Visible to guests</Label>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={() => saveContentBlock(editingBlock)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingBlock(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default ContentManagementSystem;