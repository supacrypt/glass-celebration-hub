import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import AdminDashboard from '@/components/AdminDashboard';

const AdminGifts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#2d3f51]">Gift Registry Management</h1>
            <p className="text-sm text-[#7a736b]">Manage gift registry items and purchases</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/gifts/add')}
          className="bg-wedding-navy hover:bg-wedding-navy-light"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Gift
        </Button>
      </div>

      {/* Admin Dashboard Component - Gift Management Tab */}
      <GlassCard className="p-6">
        <AdminDashboard />
      </GlassCard>
    </div>
  );
};

export default AdminGifts;